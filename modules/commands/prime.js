const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prime')
    .setDescription('素数判定')
    .addIntegerOption(option =>
      option.setName('number')
        .setDescription('素数かどうかを判定したい数')
        .setRequired(true)),
  async execute(interaction) {
    try {
      //　数を取得
      const number = interaction.options.getInteger('number');

      // 素数かどうかの判定
      let isPrime = true;

      if (number <= 1) {
        isPrime = false;
      } else {
        for (let i = 2; i <= Math.sqrt(number); i++) {
          if (number % i === 0) {
            isPrime = false;
            break;
          }
        }
      }

      // embedを送信(グロタンディーク素数{57}の場合は特殊処理)
      const embed = new EmbedBuilder()
        .setColor(0xf8b4cb)
        .setTitle('素数判定結果')
        .setTimestamp()
        .setFooter({ text:'Emubot | prime', iconURL:'https://cdn-icons-png.freepik.com/512/8068/8068172.png' })
        .addFields(
          { name: '入力された数', value: number.toString() },
          { name: '結果', value: isPrime ? '素数です' : number === 57 ? '[グロタンディーク素数](<https://dic.nicovideo.jp/a/グロタンディーク素数>)です' : '素数ではないです' },
        );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('素数判定中にエラーが発生しました：', error);
      await interaction.reply('素数判定中にエラーが発生しました。');
    }
  },
};
