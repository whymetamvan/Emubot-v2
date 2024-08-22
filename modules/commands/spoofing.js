const { SlashCommandBuilder, PermissionsBitField, WebhookClient, Collection } = require('discord.js');

const serverCooldowns = new Collection();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spoofing')
    .setDescription('他のユーザーになりすましできるコマンド')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('メンションまたはユーザーIDでユーザーを指定します')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('送信するメッセージ')
        .setRequired(true))
    .addAttachmentOption(option =>
      option.setName('attachment')
        .setDescription('送信する画像'))
    .addStringOption(option =>
      option.setName('nickname')
        .setDescription('ニックネームを指定')),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guildId = interaction.guild.id;

    if (serverCooldowns.has(guildId) && Date.now() < serverCooldowns.get(guildId) + 5000) {
      const timeLeft = ((serverCooldowns.get(guildId) + 5000 - Date.now()) / 1000).toFixed(1);
      return interaction.editReply(`コマンドのクールダウン中です。あと${timeLeft}秒待ってください。`);
    }
    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageWebhooks)) {
      return interaction.editReply('webhookの管理権限がありません');
    }

    const targetUser = interaction.options.getUser('target');
    const message = interaction.options.getString('message');
    const attachment = interaction.options.getAttachment('attachment');
    const nickname = interaction.options.getString('nickname'); // ニックネームオプションの取得

    const invalidContentChecks = [
      { regex: /@everyone|@here/, error: 'メッセージに@everyoneまたは@hereを含めることはできません。' },
      { regex: /<@&\d+>|<@!\d+>|<@?\d+>/, error: 'メッセージにロールメンションまたはユーザーメンションを含めることはできません。' },
      { regex: /.{501,}/, error: 'メッセージが500文字を超えています。' },
      { regex: /(https?:\/\/)?(www\.)?(discord\.(gg|io|me|li|com\/invite)|discordapp\.com\/invite|dsc\.gg|imgur\.com)\/[^\s]+/, error: '招待リンクやimgurリンクを含むメッセージは送信できません。' },
      { regex: /[\w-]{24}\.[\w-]{6}\.[\w-]{27}/, error: 'メッセージにトークンを含めることはできません。' },
      { regex: /\|{4,}/, error: 'メッセージに連続するスポイラーを含めることはできません。' }
    ];
    for (const check of invalidContentChecks) {
      if (check.regex.test(message)) {
        return interaction.editReply(check.error);
      }
    }

    let webhook;
    try {
      const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);
      const displayName = nickname || (member?.nickname || targetUser.displayName);
      const avatarURL = targetUser.displayAvatarURL({ format: null, size: 1024 });

      webhook = await interaction.channel.createWebhook({
        name: displayName,
        avatar: avatarURL,
        reason: 'Spoofingコマンドを実行',
      });

      const webhookClient = new WebhookClient({ id: webhook.id, token: webhook.token });
      const options = { content: message, files: attachment ? [attachment] : [] };

      await webhookClient.send(options);
      serverCooldowns.set(guildId, Date.now());
      setTimeout(() => serverCooldowns.delete(guildId), 5000);
      await interaction.editReply('メッセージを送信しました。');
    } catch (error) {
      console.error('Error creating or sending webhook:', error);
      await interaction.editReply('メッセージの送信中にエラーが発生しました。');
    } finally {
      if (webhook) {
        try {
          await webhook.delete('Cleaning up webhook after operation');
        } catch (cleanUpError) {
          console.error('Error cleaning up webhook:', cleanUpError);
        }
      }
    }
  },
};
