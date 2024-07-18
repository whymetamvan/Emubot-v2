require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const cooldowns = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search-gif')
    .setDescription('指定したワードに関するGIFを送信します')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('検索したいワード')
        .setRequired(true)),
  async execute(interaction) {

    if (cooldowns.has(interaction.guildId)) {
      const cooldown = cooldowns.get(interaction.guildId);
      const now = Date.now();
      if (cooldown > now) {
        const remainingTime = Math.ceil((cooldown - now) / 1000); 
        await interaction.reply({ content: `クールダウン中です。\nあと${remainingTime} 秒後にもう一度やってね！`, ephemeral: true });
        return;
      }
    }

    const apiKey = process.env.tenorAPI;
    const query = interaction.options.getString('query');

    try {
      const response = await axios.get(`https://tenor.googleapis.com/v2/search?q=${query}&key=${apiKey}&random=true`);
      const gifUrl = response.data.results[0].media_formats.gif.url;

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTimestamp()
        .setFooter({ text:'Emubot | search-GIF', iconURL:'https://play-lh.googleusercontent.com/ycHJqqNVtnAJbsnzHlDcTVlwcOhFygF8DmF_kCM8pkb8E6Fk9RFm8TjBARWnNiy0YD4=w240-h480-rw' })
        .setTitle(`${query}のGIFです！`)
        .setImage(gifUrl);
      
      await interaction.deferReply();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('gif nai..');
      await interaction.editReply('GIFが見つかりませんでした');
    }

    const cooldownTime = 15000; 
    cooldowns.set(interaction.guildId, Date.now() + cooldownTime);
    setTimeout(() => cooldowns.delete(interaction.guildId), cooldownTime);
  },
};