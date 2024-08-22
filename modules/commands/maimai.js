const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('maimai')
    .setDescription('maimaiの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices(
          { name: '全曲', value: 'all' },
          { name: 'maimaiジャンル', value: 'maimai' },
          { name: '宴譜面', value: 'utage' }
        )
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const option = interaction.options.getString("action");
    const count = interaction.options.getInteger("count");
    const dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'maimai', `${option.toUpperCase()}.txt`);

    if (!['all', 'maimai', 'utage'].includes(option)) {
      await interaction.editReply('選択肢から選んでください：```全曲、maimaiジャンルのみ、宴譜面```');
      return;
    }

    if (count > 20) {
      await interaction.editReply('曲数は20以下で指定してください。');
      return;
    }
    
    try {
      const songList = fs.readFileSync(dataFilePath, 'utf8').split('\n').filter(song => song.trim() !== '');

      if (songList.length === 0) {
        await interaction.editReply('曲が見つかりませんでした。');
        return;
      }
      if (count < 1 || count > songList.length) {
        await interaction.editReply('曲数は1以上、曲リストの総数以下で指定してください。');
        return;
      }


      const selectedSongs = [];
      while (selectedSongs.length < count) {
        const randomSong = songList[Math.floor(Math.random() * songList.length)];
        if (!selectedSongs.includes(randomSong)) {
          selectedSongs.push(randomSong);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(`ランダム選曲の結果 (${selectedSongs.length} 曲)`)
        .setDescription(selectedSongs.join("\n"))
        .setTimestamp()
        .setFooter({ text: 'Emubot | maimai', iconURL: 'https://pbs.twimg.com/profile_images/1270188881581756419/7hrfPNnB_400x400.jpg' })
        .setColor('#58bcf4');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('エラーが発生しました。');
    }
  }
};
