const { SlashCommandBuilder, PermissionsBitField, WebhookClient, Collection } = require('discord.js');

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

        const guildId = interaction.guild.id;

        console.log('Checking cooldown for guild:', guildId);

        if (serverCooldowns.has(guildId)) {
            const expirationTime = serverCooldowns.get(guildId) + 5000; 
            if (Date.now() < expirationTime) {
                const timeLeft = (expirationTime - Date.now()) / 1000;
                console.log(`Cooldown active. Time left: ${timeLeft.toFixed(1)} seconds`);
                return interaction.editReply(`コマンドのクールダウン中です。あと${timeLeft.toFixed(1)}秒待ってください。`);
            }
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
            return interaction.editReply('webhookの管理権限がありません');
        }

        const targetUser = interaction.options.getUser('target');
        const message = interaction.options.getString('message');
        const attachment = interaction.options.getAttachment('attachment');

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
            const avatarURL = member.displayAvatarURL({ format: null, size: 1024 });

            const webhook = await interaction.channel.createWebhook({
                name: nickname,
                avatar: avatarURL,
                reason: 'Spoofing command execution',
            });

            const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });

            const options = {
                content: message,
            };

            if (attachment) {
                options.files = [attachment];
            }

            await webhookClient.send(options);

            try {
                await webhook.delete('Spoofing message sent');
            } catch (deleteError) {
                console.error('Error deleting webhook:', deleteError);
                await interaction.editReply('メッセージを送信しましたが、webhookの削除に失敗しました。');

                const webhooks = await interaction.channel.fetchWebhooks();
                const botWebhooks = webhooks.filter(wh => wh.owner.id === interaction.client.user.id);

                for (const botWebhook of botWebhooks.values()) {
                    try {
                        await botWebhook.delete('Cleaning up leftover webhooks');
                    } catch (cleanUpError) {
                        console.error('Error cleaning up webhook:', cleanUpError);
                    }
                }

                return;
            }

¥            console.log('Setting cooldown for guild:', guildId);
            serverCooldowns.set(guildId, Date.now());
            setTimeout(() => {
                console.log('Removing cooldown for guild:', guildId);
                serverCooldowns.delete(guildId);
            }, 5000); 

            await interaction.editReply('メッセージを送信しました。');
        } catch (error) {
            console.error('Error creating or sending webhook:', error);
            await interaction.editReply('メッセージの送信中にエラーが発生しました。');
        }
    },
};
