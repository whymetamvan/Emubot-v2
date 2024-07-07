const { SlashCommandBuilder,PermissionsBitField, WebhookClient } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('spoofing')
        .setDescription('なりすまし的な(?)')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('メンションまたはユーザーID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('送信するメッセージ')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral:true });
        // botの権限確認
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
            return interaction.editReply('webhookの管理権限がありません');
        }

        const targetUser = interaction.options.getUser('target');
        const message = interaction.options.getString('message');

        // ユーザーの名前とアイコンを取得
        const member = interaction.guild.members.cache.get(targetUser.id);
        const nickname = member ? member.nickname || targetUser.displayName : targetUser.displayName;
        const avatarURL = targetUser.displayAvatarURL();

        try {
            // ウェブフックの作成
            const webhook = await interaction.channel.createWebhook({
                name: nickname,
                avatar: avatarURL,
                reason: 'Spoofing command execution',
            });

            const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
            await webhookClient.send(message);

            // ウェブフックの削除
            await webhook.delete('Spoofing message sent');

            // 返信
            await interaction.editReply('メッセージを送信しました。');
        } catch (error) {
            console.error('Error creating or sending webhook:', error);
            await interaction.editReply('メッセージの送信中にエラーが発生しました。');
        }
    },
};
