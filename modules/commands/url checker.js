require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('check-virus')
    .setDescription('URLの危険性を判断します')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URLを入力してください')
        .setRequired(true)),

  async execute(interaction) {
    const url = interaction.options.getString('url');
    const apiKey = process.env.VIRUSTOTAL_API_KEY;

    if (!url) {
      return interaction.reply({ content: 'URLを入力してください', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle('URL Check')
      .setDescription(`Checking the URL: ${url} <a:load:1259148838929961012>`)
      .setColor(0x00FF00);

    await interaction.reply({ embeds: [embed], ephemeral: true });

    try {
      const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '');
      const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
        headers: {
          'x-apikey': apiKey
        }
      });

      const data = response.data;
      if (!data || !data.data || !data.data.attributes || !data.data.attributes.last_analysis_results) {
        throw new Error('Invalid response from VirusTotal API');
      }

      const analysisResults = data.data.attributes.last_analysis_results;
      const results = Object.keys(analysisResults).map(key => ({
        engine: key,
        result: analysisResults[key].result,
        category: analysisResults[key].category
      }));

      const detectedResults = results.filter(result => result.result !== 'clean' && result.result !== 'unrated');
      const cleanResults = results.filter(result => result.result === 'clean');
      const unratedResults = results.filter(result => result.result === 'unrated').slice(0, 5);

      const descriptionSuffix = detectedResults.length >= 3 ? ' ⚠️' : detectedResults.length === 0 ? ' ✅' : '';

      const embedResult = new EmbedBuilder()
        .setTitle('URL check completed!')
        .setFooter({ text: 'Emubot | check-virus', iconURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6c51b7ce-37c6-46e8-8a60-f77282a66f9c/dfq0c21-66386d21-3b27-47e7-808d-c9c03248549b.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZjNTFiN2NlLTM3YzYtNDZlOC04YTYwLWY3NzI4MmE2NmY5Y1wvZGZxMGMyMS02NjM4NmQyMS0zYjI3LTQ3ZTctODA4ZC1jOWMwMzI0ODU0OWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZkEMTvm821TYDactsf7ajI6AcUjzV5WuKW-EPd3Oj2k' })
        .setDescription(`診断URL: ${url}${descriptionSuffix}`)
        .setColor(detectedResults.length > 3 ? 0xFF0000 : 0x00FF00);

      let totalFields = 0;

      detectedResults.forEach(result => {
        if (totalFields < 25) {
          embedResult.addFields(
            { name: result.engine, value: result.result || 'clean', inline: true }
          );
          totalFields++;
        }
      });

      cleanResults.forEach(result => {
        if (totalFields < 25) {
          embedResult.addFields(
            { name: result.engine, value: result.result || 'clean', inline: true }
          );
          totalFields++;
        }
      });

      unratedResults.forEach(result => {
        if (totalFields < 25) {
          embedResult.addFields(
            { name: result.engine, value: result.result || 'unrated', inline: true }
          );
          totalFields++;
        }
      });

      await interaction.editReply({ embeds: [embedResult], ephemeral: true });
    } catch (error) {
      console.error(error);

      let errorMessage = 'エラーが発生しました。';
      if (error.response && error.response.status === 404) {
        errorMessage = '指定されたURLが見つかりませんでした。';
      } else if (error.response && error.response.status === 401) {
        errorMessage = 'APIキーが無効です。';
      }

      const embedError = new EmbedBuilder()
        .setTitle('URLチェックエラー')
        .setTimestamp()
        .setFooter({ text: 'Emubot | check-virus', iconURL: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6c51b7ce-37c6-46e8-8a60-f77282a66f9c/dfq0c21-66386d21-3b27-47e7-808d-c9c03248549b.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZjNTFiN2NlLTM3YzYtNDZlOC04YTYwLWY3NzI4MmE2NmY5Y1wvZGZxMGMyMS02NjM4NmQyMS0zYjI3LTQ3ZTctODA4ZC1jOWMwMzI0ODU0OWIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ZkEMTvm821TYDactsf7ajI6AcUjzV5WuKW-EPd3Oj2k' })
        .setDescription(`エラーが発生したURL: ${url}\n${errorMessage}`)
        .setColor(0xFF0000);

      await interaction.editReply({ embeds: [embedError], ephemeral: true });
    }
  },
};
