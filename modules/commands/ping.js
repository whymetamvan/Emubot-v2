const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('ping値の測定'),
  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('Emubot｜ping 🏓')
      .setDescription('Ping値')
      .setTimestamp()
      .setFooter({ text:'Emubot | Ping', iconURL:'https://cdn.icon-icons.com/icons2/1633/PNG/512/52744pingpong_109378.png' })
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