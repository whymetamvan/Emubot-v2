const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stamp')
    .setDescription('プロセカのスタンプをランダムに送信します'),
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const response = await axios.get('https://pjsekai-souco.com/illustration/stamp/');
      const $ = cheerio.load(response.data);
      const stampUrls = [];

      $('img').each((index,element) => {
        const src = $(element).attr('src');
        if (src && src.includes('/wp-content/uploads/') && !src.includes('スタンプ一覧改')) {
          stampUrls.push(src);
        }
      });

      if (stampUrls.length === 0) {
        await interaction.editReply('スタンプが見つかりませんでした。');
        return;
      }

      const randomIndex = Math.floor(Math.random() * stampUrls.length);
      const randomStampUrl = stampUrls[randomIndex];

      const embed = new EmbedBuilder()
        .setTitle('プロセカスタンプ')
        .setImage(randomStampUrl)
        .setColor('#f8b4cb');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('エラーが発生しました:', error);
      await interaction.editReply('スタンプの取得中にエラーが発生しました。');
    }
  },
};
