const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chunithm')
    .setDescription('チュウニズムの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "全曲", value: "all" },
          { name: "ORIGINALのみ", value: "original" },
          { name: "WE,ULTIMAのみ", value: "weUL" }
        )
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    const option = interaction.options.getString("action");
    const count = interaction.options.getInteger("count");

    await interaction.deferReply();
    
    let dataFilePath;

    switch (option) {
      case "all":
        dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'chunithm', 'chunithm ALL.txt');
        break;
      case "original":
        dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'chunithm', 'original.txt');
        break;
      case "weUL":
        dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'chunithm', 'we ul.txt');
        break;
      default:
        await interaction.editReply("選択してください");
        return;
    }

    try {
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      const songList = rawData.split('\n').filter(song => song.trim() !== '');

      if (songList.length === 0) {
        await interaction.editReply("曲が見つかりませんでした。");
        return;
      }
      if (count < 1 || count > songList.length) {
        await interaction.editReply("曲数は1以上、曲リストの総数以下で指定してください。");
        return;
      }

      const selectedSongs = [];
      while (selectedSongs.length < count) {
        const randomIndex = Math.floor(Math.random() * songList.length);
        const randomSong = songList[randomIndex];
        if (!selectedSongs.includes(randomSong)) {
          selectedSongs.push(randomSong);
        }
      }

      const embed = new EmbedBuilder()
        .setTitle(`ランダム選曲の結果 (${selectedSongs.length} 曲)`)
        .setDescription(selectedSongs.join("\n"))
        .setTimestamp()
        .setFooter({ text:'Emubot | chunithm'})
        .setColor('#fffc3c');

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('chunithmエラー',error);
      await interaction.editReply({ content: 'エラーが発生しました', ephemeral: true });
    }
  }
};
