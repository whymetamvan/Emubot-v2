// ランダムに文字列を生成するコマンド
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('ランダム文字生成')
    .addIntegerOption(option =>
      option.setName('length')
        .setDescription('生成したい文字数')
        .setRequired(true)
    ),
  async execute(interaction) {
    // 数を取得、2000以上の場合はエラー
    const length = interaction.options.getInteger('length');

    if (length > 2000) {
      try {
        await interaction.reply("2000以下にしてください");
      } catch (error) {
        console.error(error);
        console.log("random error");
      }
    } else {
      const randomString = Array.from({ length }, () => Math.random().toString(36).charAt(2)).join("");

      // embedを送信
      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTitle('ランダムな文字列')
        .setTimestamp()
        .setFooter({ text:'Emubot | random'})
        .setDescription('```\n' + randomString + '\n```');

      try {
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
　　　　　await interaction.reply({ content: 'エラーが発生しました', ephemeral: true});
      }
    }
  },
};
