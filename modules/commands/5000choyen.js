const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('5000choyen')
    .setDescription('5000兆円欲しい!!風の画像生成')
    .addStringOption(option =>
      option.setName('top')
        .setDescription('上部文字列')
        .setRequired(true),
    )
    .addStringOption(option =>
      option.setName('bottom')
        .setDescription('下部文字列')
        .setRequired(true),
    ),
  
  async execute(interaction) {
    
    try {
      const top = interaction.options.getString('top');
      const bottom = interaction.options.getString('bottom');
      
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setFooter({ text:'Emubot | 5000choyen'})
        .setTimestamp()
        .setImage(`https://gsapi.cbrx.io/image?top=${encodeURIComponent(top)}&bottom=${encodeURIComponent(bottom)}&type=png`);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('画像生成中にエラーが発生しました');
      await interaction.editReply('画像生成中にエラーが発生しました。');
    }
  },
};
