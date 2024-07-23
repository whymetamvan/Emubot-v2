const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fake-tokengen')
    .setDescription('token(のような文字列)を生成')
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('生成する数')
        .setRequired(true)
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      const count = Math.min(interaction.options.getInteger('count'), 10); 
      const tokens = getRandomMemberIds(interaction.guild.members.cache, count)
        .map(generateToken);

      const embed = new EmbedBuilder()
        .setColor('#7289da')
        .setTitle('Token')
        .setTimestamp()
        .setFooter({ text: 'Emubot | fake-tokengen', iconURL: 'https://i.gyazo.com/c54986b000f7374bb077839e6c9fecb9.png' })
        .setDescription(tokens.join('\n'));

      await interaction.followUp({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('token生成エラー:', error);
      await interaction.followUp({ content: '生成中にエラーが発生しました', ephemeral: true });
    }
  },
};

function getRandomMemberIds(members, count) {
  return Array.from({ length: count }, () => members.random().id);
}

function generateToken(memberId) {
  const base64Id = Buffer.from(memberId).toString('base64');
  const randomSegment = length => Array.from({ length }, () => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-'.charAt(Math.floor(Math.random() * 64))).join('');
  return `${base64Id}.${randomSegment(6)}.${randomSegment(32)}`;
}
