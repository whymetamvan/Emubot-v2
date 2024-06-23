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
    // 選曲オプションと曲数を取得
    const option = interaction.options.getString("action");
    const count = interaction.options.getInteger("count");
   //deferReply 
    await interaction.deferReply();
    
    let dataFilePath;

    // 選択
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
      // txtの読み込み
      const rawData = fs.readFileSync(dataFilePath, 'utf8');
      const songList = rawData.split('\n').filter(song => song.trim() !== '');

      // txt内が空の場合
      if (songList.length === 0) {
        await interaction.editReply("曲が見つかりませんでした。");
        return;
      }
      // 曲数が1より少ないかtxt内より多い場合
      if (count < 1 || count > songList.length) {
        await interaction.editReply("曲数は1以上、曲リストの総数以下で指定してください。");
        return;
      }

      // ランダム
      const selectedSongs = [];
      while (selectedSongs.length < count) {
        const randomIndex = Math.floor(Math.random() * songList.length);
        const randomSong = songList[randomIndex];
        if (!selectedSongs.includes(randomSong)) {
          selectedSongs.push(randomSong);
        }
      }

      // embedを送信
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
