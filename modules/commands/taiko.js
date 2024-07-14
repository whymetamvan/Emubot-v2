const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('taiko')
    .setDescription('太鼓の曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "全曲", value: "all" },
          { name: "☆10のみ", value: "level10" }
        )
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.commandName === "taiko") {
      const option = interaction.options.getString("action");
      const count = interaction.options.getInteger("count");

      await interaction.deferReply();
      
      let dataFilePath;

      switch (option) {
        case "all":
          dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'taiko', 'taiko ALL.txt');
          break;
        case "level10":
          dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'taiko', 'LEVEL10.txt');
          break;
        default:
          await interaction.editReply("選択肢から選んでください：全曲、☆10のみ");
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
          .setFooter({ text:'Emubot | taiko', iconURL: 'https://pbs.twimg.com/profile_images/501238914330271744/znFmAp9R_400x400.jpeg'})
          .setColor('#ff7c04');

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'エラーが発生しました。', ephemeral: true });
      }
    }
  }
};
