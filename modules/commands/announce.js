const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce-create')
        .setDescription('お知らせをするえむbot開発室を作ります'),
    async execute(interaction) {
        await interaction.deferReply();
        const guild = interaction.guild;
        const channelName = 'えむbot開発室';

        // ユーザーとbotの権限の確認
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.editReply({ content: 'あなたに実行権限が有りません。', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.editReply({ content: 'チャンネルの作成権限がありません。', ephemeral: true });
        }

        // えむbot開発室が既にある場合の処理
        const existingChannel = guild.channels.cache.find(channel => channel.name === channelName && channel.type === ChannelType.GuildText);

        if (existingChannel) {
            return interaction.editReply({ content: 'えむbot開発室は既にあります', ephemeral: true });
        }

        // なかった場合は作成
        try {
            const createdChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText // テキストチャンネルです
            });
            // embedを送信
            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('えむbot開発室')
                .setDescription('お知らせチャンネルを作成しました')
                .setTimestamp()
                .setFooter({ text: 'Emubot | announce-create' });

            console.log(`${createdChannel.id}を作成`);
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('アナウンスの作成エラー', error);
            let errorMessage = 'エラーが発生しました';

            // チャンネル上限エラーが発生したときのエラー
            if (error.message.includes('Maximum number of channels reached')) {
                errorMessage = 'チャンネル上限のため作成できませんでした。';
            }

            // 2要素認証エラーが発生した時
            if (error.message.includes('Two factor authentication is required')) {
                errorMessage = '2要素認証が必要なため作成できませんでした。手動で'+'```'+'えむbot開発室'+'```'+'という名前のチャンネルを作ってください。';
            }

            await interaction.editReply({ content: errorMessage, ephemeral: true });
        }
    },
};
