// プロセカランダム選曲コマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prsk')
    .setDescription('プロセカの曲をランダムに選択します。')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('選曲オプションを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "MASTER", value: "master" },
          { name: "APPEND", value: "append" }
        )
    )
    .addIntegerOption(option =>
      option.setName('count')
        .setDescription('選択する曲の数を指定します。')
        .setRequired(true)),

  async execute(interaction) {
    if (interaction.commandName === "prsk") {
      // 曲数とオプションを取得
      const option = interaction.options.getString("action");
      const count = interaction.options.getInteger("count");

await interaction.deferReply();
      
      let dataFilePath;

      switch (option) {
        case "master":
          dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'prsk', 'MASTER.txt');
          break;
        case "append":
          dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'prsk', 'APPEND.txt');
          break;
        default:
          await interaction.editReply("選択肢から選んでください：MASTER、APPEND");
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

        // ランダム
        const selectedSongs = [];
        while (selectedSongs.length < count) {
          const randomIndex = Math.floor(Math.random() * songList.length);
          const randomSong = songList[randomIndex];
          if (!selectedSongs.includes(randomSong)) {
            selectedSongs.push(randomSong);
          }
        }

         // embedの送信
        const embed = new EmbedBuilder()
          .setTitle(`ランダム選曲の結果 (${selectedSongs.length} 曲)`)
          .setDescription(selectedSongs.join("\n"))
          .setTimestamp()
          .setFooter({ text:'Emubot | prsk'})
          .setColor('#34ccbc');

        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        await interaction.editReply({ content: 'エラーが発生しました。', ephemeral: true });
      }
    }
  }
};
