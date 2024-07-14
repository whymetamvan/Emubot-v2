const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉", "凶", "大凶"];
const specialFortune = "わんだほーい！";
const dailyFortunes = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('omikuji')
    .setDescription('おみくじを引けます'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const userId = interaction.user.id;

      // おみくじ、embedの送信
      if (!dailyFortunes.has(userId) || !isToday(dailyFortunes.get(userId))) {
        let result = '';
        do {
          // 特別なおみくじの出る確率を低く設定
          const random = Math.random();
          if (random < 0.01) { // 1%の確率で「わんだほーい！」が出る
            result = specialFortune;
          } else {
            result = fortunes[Math.floor(Math.random() * fortunes.length)];
          }
        } while (dailyFortunes.get(userId) === result); 

        const embed = new EmbedBuilder()
          .setTitle('おみくじ結果')
          .setDescription(`今日の<@${interaction.user.id}>は **${result}** だよ！\nまた明日引いてね！`)
          .setTimestamp()
          .setFooter({ text:'Emubot | omikuji', iconURL:'https://tsukatte.com/wp-content/uploads/2021/10/omikuji.png' })
          .setThumbnail(`attachment://${result === specialFortune ? 'special.png' : 'omikuji.png'}`)
          .setColor('#f8b4cb');

        await interaction.editReply({
          embeds: [embed],
          files: [{
            attachment: result === specialFortune ? specialThumbnailPath : thumbnailPath,
            name: result === specialFortune ? 'special.png' : 'omikuji.png'
          }]
        });

        // 1日1回だけ使えるようにする
        dailyFortunes.set(userId, new Date());
      } else {
        await interaction.editReply('またあした引いてください！');
      }
    } catch (error) {
      console.error('おみくじの実行中にエラーが発生しました：', error);
      await interaction.editReply('おみくじの実行中にエラーが発生しました。');
    }
  },
};

const thumbnailPath = path.join(__dirname, '../../lib/images/omikuji.png');
const specialThumbnailPath = path.join(__dirname, '../../lib/images/special.png');

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}
