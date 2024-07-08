const { SlashCommandBuilder, PermissionsBitField, WebhookClient, Collection } = require('discord.js');

const cooldowns = new Collection();

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
        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.user.id;

        // クールダウンの確認
        if (cooldowns.has(userId)) {
            const expirationTime = cooldowns.get(userId) + 10000;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.editReply(`コマンドのクールダウン中です。あと${timeLeft.toFixed(1)}秒待ってください。`);
            }
        }

        // クールダウン設定
        cooldowns.set(userId, Date.now());
        setTimeout(() => cooldowns.delete(userId), 10000);

        // botの権限確認
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
            return interaction.editReply('webhookの管理権限がありません');
        }

        const targetUser = interaction.options.getUser('target');
        const message = interaction.options.getString('message');

        // メッセージの判定
        if (message.includes('@everyone') || message.includes('@here')) {
            return interaction.editReply('メッセージに@everyoneまたは@hereを含めることはできません。');
        }
        if (message.match(/<@&\d+>/) || message.match(/<@!\d+>/)) {
            return interaction.editReply('メッセージにロールメンションまたはユーザーメンションを含めることはできません。');
        }
        if (message.length > 500) {
            return interaction.editReply('メッセージが500文字を超えています。');
        }
        if (message.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/[^\s]+/)) {
            return interaction.editReply('招待リンクを含むメッセージは送信できません。');
        }

        // ユーザーの名前とアイコンを取得
        const member = interaction.guild.members.cache.get(targetUser.id);
        const nickname = member ? member.nickname || targetUser.displayName : targetUser.displayName;
        const avatarURL = targetUser.displayAvatarURL();

        try {
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
