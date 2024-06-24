const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverlist')
        .setDescription('参加サーバー一覧'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true});

            const guilds = interaction.client.guilds.cache;
            const guildNames = guilds.map(guild => guild.name).join('\n');
            const guildCount = guilds.size;

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTimestamp()
                .setFooter({ text: "Emutest | serverlist" })
                .setTitle(`サーバー一覧（現在: ${guildCount}）`)
                .setDescription(guildNames);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。もう一度お試しください。', ephemeral: true });
        }
    },
};