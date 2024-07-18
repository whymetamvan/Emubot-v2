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
        .setRequired(true)
    ),

  async execute(interaction) {
    const option = interaction.options.getString("action");
    const count = interaction.options.getInteger("count");
    const dataFilePath = path.join(__dirname, '..', '..', 'lib', 'random', 'prsk', `${option.toUpperCase()}.txt`);

    if (!['master', 'append'].includes(option)) {
      await interaction.reply({ content:"選択肢から選んでください：```MASTER、APPEND```", ephemeral: true });
      return;
    }

    try {
      const songList = fs.readFileSync(dataFilePath, 'utf8').split('\n').filter(song => song.trim() !== '');

      if (songList.length === 0) {
        await interaction.reply({ content:"曲が見つかりませんでした。", ephemeral: true });
        return;
      }
      if (count < 1 || count > songList.length) {
        await interaction.reply({ content:"曲数は1以上、曲リストの総数以下で指定してください。", ephemeral: true });
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
        .setFooter({ text: 'Emubot | prsk', iconURL: 'https://pjsekai.sega.jp/assets/img/special/dl/sns_icon/icon_virtualsinger_1_miku.png' })
        .setColor('#34ccbc');

      await interaction.deferReply();
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({ content: 'エラーが発生しました。', ephemeral: true });
    }
  }
};
