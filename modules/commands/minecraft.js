const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mcserver')
    .setDescription('マイクラサーバーの状態を表示します')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('サーバーアドレスを指定')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const ip = interaction.options.getString('ip');
    try {
      const serverStatus = await getServerStatus(ip);
      let statusEmbed = new EmbedBuilder()
        .setTitle('Minecraft ServerStatus')
        .setTimestamp()
        .setFooter({ text:'Emubot | mcserver', iconURL: 'https://img.icons8.com/?size=100&id=XfjNd4vkhBBy&format=png&color=000000'})
        .setColor('#f8b4cb')
        .addFields(
          { name: 'Status', value: serverStatus.online ? '🟢 online' : '🔴 offline'}
        );
      if (serverStatus.online) {
        statusEmbed.addFields(
          { name: 'OnlinePlayers', value: `${serverStatus.players.online}人`}
        );
      }
      await interaction.editReply({ embeds: [statusEmbed] });
    } catch (error) {
      await interaction.editReply({ content: 'サーバーステータスの取得に失敗しました。' });
    }
  },
};

async function getServerStatus(ipAddress) {
  try {
    const response = await axios.get(`https://api.mcsrvstat.us/2/${encodeURIComponent(ipAddress)}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching server status');
  }
}
