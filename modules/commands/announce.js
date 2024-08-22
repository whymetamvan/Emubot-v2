const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

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

        await interaction.deferReply();
        const existingChannel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === ChannelType.GuildText);

        if (existingChannel) {
            await interaction.editReply('えむbot開発室は既にあります');
        } else {　
            try {
                const createdChannel = await guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText 
                });
                const embed = new EmbedBuilder()
                  .setColor('#f8b4cb')
                  .setTitle('えむbot開発室')
                  .setDescription('お知らせチャンネルを作成しました')
                  .setTimestamp()
                  .setFooter({ text:'Emubot | announce-create', iconURL: 'https://png.pngtree.com/png-vector/20240507/ourlarge/pngtree-announcement-icon-megaphone-vector-illustration-png-image_12366388.png'});
                
                console.log(`${createdChannel.id}を作成`);
                await interaction.editReply({ embeds:[embed]});
            } catch (error) {
                console.error('アナウンスの作成エラー', error);
                await interaction.editReply({ content: 'エラーが発生しました。\n```えむbot開発室```を手動で作成をお願いします..', ephemeral: true });
            }
        }
    },
};
