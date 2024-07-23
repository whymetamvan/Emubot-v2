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

    await interaction.deferReply({ ephemeral: true });

    const embed = new EmbedBuilder()
      .setTitle('URL Check')
      .setDescription(`Checking the URL: ${url} <a:load:1259148838929961012>`)
      .setColor('#00FF00');

    await interaction.editReply({ embeds: [embed], ephemeral: true });

    try {
      const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '');
      const { data } = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
        headers: { 'x-apikey': apiKey }
      });

      const results = Object.entries(data.data.attributes.last_analysis_results || {}).map(([engine, result]) => ({
        engine, result: result.result, category: result.category
      }));

      const detected = results.filter(r => r.result !== 'clean' && r.result !== 'unrated');
      const clean = results.filter(r => r.result === 'clean');
      const unrated = results.filter(r => r.result === 'unrated').slice(0, 5);

      const embedResult = new EmbedBuilder()
        .setTitle('URL check completed!')
        .setFooter({ text: 'Emubot | check-virus', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription(`診断URL: ${url} ${detected.length >= 3 ? '⚠️' : detected.length === 0 ? '✅' : ''}`)
        .setColor(detected.length > 3 ? '#FF0000' : '#00FF00');

      [...detected, ...clean, ...unrated].slice(0, 25).forEach(result => {
        embedResult.addFields({ name: result.engine, value: result.result || 'clean', inline: true });
      });

      await interaction.editReply({ embeds: [embedResult], ephemeral: true });
    } catch (error) {
      console.error(error);

      const errorMessage = error.response?.status === 404
        ? '指定されたURLが見つかりませんでした。'
        : error.response?.status === 401
          ? 'APIキーが無効です。'
          : 'エラーが発生しました。';

      const embedError = new EmbedBuilder()
        .setTitle('URLチェックエラー')
        .setTimestamp()
        .setFooter({ text: 'Emubot | check-virus', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription(`エラーが発生したURL: ${url}\n${errorMessage}`)
        .setColor('#FF0000');

      await interaction.editReply({ embeds: [embedError], ephemeral: true });
    }
  },
};
