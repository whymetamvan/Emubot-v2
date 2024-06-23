const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce-create')
        .setDescription('お知らせをするえむbot開発室を作ります'),
    async execute(interaction) {
        const guild = interaction.guild;
        const channelName = 'えむbot開発室';

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'あなたに実行権限が有りません。', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: 'チャンネルの作成権限がありません。', ephemeral: true });
        }

        const existingChannel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === 0);

        if (existingChannel) {
            await interaction.reply({ content: 'えむbot開発室は既にあります', ephemeral: true });
        } else {
            try {
                const createdChannel = await guild.channels.create({
                    name: channelName,
                    type: 0
                });
                const embed = new EmbedBuilder()
                    .setColor('#f8b4cb')
                    .setTitle('えむbot開発室')
                  .setDescription('お知らせチャンネルを作成しました')
                  .setTimestamp()
                  .setFooter({ text:'Emubot | announce-create'});
                
                console.log(`${createdChannel.id}を作成`);
                await interaction.reply({ embeds:[embed]});
            } catch (error) {
                console.error('アナウンスの作成エラー', error);
                await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
            }
        }
    },
};
