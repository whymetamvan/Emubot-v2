const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SETTINGS_FILE = path.join(__dirname, '..', '..', 'lib', 'data', 'msglink.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('メッセージの自動展開')
        .setDescription('メッセージリンクの展開をオンまたはオフにします。')
        .addStringOption(option =>
            option.setName('on-off')
                .setDescription('オンかオフを選択')
                .setRequired(true)
                .addChoices(
                    { name: 'ON', value: 'true' },
                    { name: 'OFF', value: 'false' }
                )
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: 'このコマンドを実行する権限がありません。', ephemeral: true });
        }

        const status = interaction.options.getString('on-off') === 'true';

        let settings = {};

        try {
            await interaction.deferReply({ ephemeral: true });

            if (fs.existsSync(SETTINGS_FILE)) {
                try {
                    const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
                    settings = JSON.parse(data);
                } catch (error) {
                    console.error('設定ファイルの読み取りまたは解析中にエラーが発生しました:', error);
                    await handleError(interaction.client, error);
                    return interaction.followUp({ content: '設定ファイルの読み込み中にエラーが発生しました。', ephemeral: true });
                }
            }

            const currentStatus = settings[interaction.guild.id];

            if (currentStatus === status) {
                return interaction.followUp(`すでに${status ? 'ON' : 'OFF'}になっています。`);
            }

            settings[interaction.guild.id] = status;

            try {
                fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
            } catch (error) {
                console.error('設定ファイルの保存中にエラーが発生しました:', error);
                return interaction.followUp({ content: '設定ファイルの保存中にエラーが発生しました。', ephemeral: true });
            }

            await interaction.followUp(`メッセージリンクの展開は ${status ? 'ON' : 'OFF'} になりました。`);
        } catch (error) {
            console.error('予期しないエラーが発生しました:', error);
            return interaction.followUp({ content: '予期しないエラーが発生しました。', ephemeral: true });
        }
    },
};
