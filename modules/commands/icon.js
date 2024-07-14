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
    const { options, user, guild } = interaction;

    const targetUser = options.getUser('user') || user;

    const guildMember = await guild.members.fetch(targetUser.id);
    const avatarURL = guildMember.displayAvatarURL({
      format: 'png',
      size: 1024,
    });

    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}のアイコン`)
      .setImage(avatarURL)
      .setTimestamp()
      .setFooter({ text: 'Emubot | icon', iconURL:'https://kotonohaworks.com/free-icons/wp-content/uploads/kkrn_icon_user_1.png' })
      .setColor('#f8b4cb');

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'エラーが発生しました', ephemeral: true });
    }
  },
};
