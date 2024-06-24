const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('icon')
    .setDescription('アイコン表示')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('表示したいユーザー')
        .setRequired(false)
    ),

  async execute(interaction) {
    const { options, user } = interaction;

    // userのアバターURLを取得
    const targetUser = options.getUser('user') || user;
    const avatarURL = targetUser.displayAvatarURL({
      format: 'png',
      size: 1024,
    });

    // embedを送信
    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}のアイコン`)
      .setImage(avatarURL)
      .setTimestamp()
      .setFooter({ text: 'Emubot | icon'})
      .setColor('#f8b4cb');

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      console.log('icon error');
      await interaction.reply({ content:'エラーが発生しました', ephemeral: true})
    }
  },
};
