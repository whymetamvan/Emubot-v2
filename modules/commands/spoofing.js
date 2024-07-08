const { SlashCommandBuilder, PermissionsBitField, WebhookClient, Collection } = require('discord.js');

const userCooldowns = new Collection();
const serverCooldowns = new Collection();

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
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('attachment')
                .setDescription('送信する画像')),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const userId = interaction.user.id;
        const guildId = interaction.guild.id;

        // サーバーのクールダウンの確認
        if (serverCooldowns.has(guildId)) {
            const expirationTime = serverCooldowns.get(guildId) + 3000;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.editReply(`サーバー全体のコマンドのクールダウン中です。あと${timeLeft.toFixed(1)}秒待ってください。`);
            }
        }

        // ユーザーのクールダウンの確認
        if (userCooldowns.has(userId)) {
            const expirationTime = userCooldowns.get(userId) + 10000;
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                return interaction.editReply(`コマンドのクールダウン中です。あと${timeLeft.toFixed(1)}秒待ってください。`);
            }
        }

        // クールダウン設定
        userCooldowns.set(userId, Date.now());
        serverCooldowns.set(guildId, Date.now());
        setTimeout(() => userCooldowns.delete(userId), 10000);
        setTimeout(() => serverCooldowns.delete(guildId), 3000);

        // botの権限確認
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
            return interaction.editReply('webhookの管理権限がありません');
        }

        const targetUser = interaction.options.getUser('target');
        const message = interaction.options.getString('message');
        const attachment = interaction.options.getAttachment('attachment');

        // メッセージの判定
        if (message.includes('@everyone') || message.includes('@here')) {
            return interaction.editReply('メッセージに@everyoneまたは@hereを含めることはできません。');
        }
        if (message.match(/<@&\d+>/) || message.match(/<@!\d+>/) || message.match(/<@?\d+>/)) {
            return interaction.editReply('メッセージにロールメンションまたはユーザーメンションを含めることはできません。');
        }
        if (message.length > 500) {
            return interaction.editReply('メッセージが500文字を超えています。');
        }
        if (message.match(/(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com\/invite)|discordapp\.com\/invite|dsc\.gg|imgur\.com)\/[^\s]+/)) {
            return interaction.editReply('招待リンクやimgurリンクを含むメッセージは送信できません。');
        }
        if (message.match(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/)) {
            return interaction.editReply('メッセージにトークンを含めることはできません。');
        }
        if (message.match(/\|{4,}/)) {
            return interaction.editReply('メッセージに連続するスポイラーを含めることはできません。');
        }

        try {
            const member = await interaction.guild.members.fetch(targetUser.id);
            const nickname = member ? member.nickname || targetUser.displayName : targetUser.displayName;
            const avatarURL = member.displayAvatarURL();

            const webhook = await interaction.channel.createWebhook({
                name: nickname,
                avatar: avatarURL,
                reason: 'Spoofing command execution',
            });

            const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

            const options = {
                content: message,
            };

            // 画像が添付されている場合
            if (attachment) {
                options.files = [attachment];
            }

            await webhookClient.send(options);

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
