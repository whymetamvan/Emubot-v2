const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping'),
  async execute(interaction) {

    // embedの送信
    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('Emubot｜ping 🏓')
      .setDescription('Ping値')
      .setTimestamp()
      .setFooter({ text:'Emubot | Ping'})
      .addFields(
        { name: 'WebSocket Ping', value: `${interaction.client.ws.ping}ms`, inline: true },
        { name: 'API-Endpoint Ping', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
        );

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log("ping error");
      await interaction.reply('エラーが発生しました')
    }
  },
};
