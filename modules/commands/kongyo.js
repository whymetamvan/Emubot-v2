const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kon')
    .setDescription('コンギョを送信します。'),
  async execute(interaction) {
    try {
      await interaction.reply("[コンギョー](https://www.youtube.com/watch?v=IkOEbH7lawI)");
    } catch (error) {
      console.error(error);
      console.log("kon error");
    }
  },
};
