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
      const now = new Date();
      const jstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));

      if (!dailyFortunes.has(userId) || !isSameJapaneseDay(dailyFortunes.get(userId).date, jstNow)) {
        let result = '';
        do {
          const random = Math.random();
          if (random < 0.01) { 
            result = specialFortune;
          } else {
            result = fortunes[Math.floor(Math.random() * fortunes.length)];
          }
        } while (dailyFortunes.get(userId)?.result === result); 

        const embed = new EmbedBuilder()
          .setTitle('おみくじ結果')
          .setDescription(`今日の<@${interaction.user.id}>は **${result}** だよ！\nまた明日引いてね！`)
          .setTimestamp()
          .setFooter({ text: 'Emubot | omikuji', iconURL: 'https://tsukatte.com/wp-content/uploads/2021/10/omikuji.png' })
          .setThumbnail(`attachment://${result === specialFortune ? 'special.png' : 'omikuji.png'}`)
          .setColor('#f8b4cb');

        await interaction.editReply({
          embeds: [embed],
          files: [{
            attachment: result === specialFortune ? specialThumbnailPath : thumbnailPath,
            name: result === specialFortune ? 'special.png' : 'omikuji.png'
          }]
        });

        dailyFortunes.set(userId, { result, date: jstNow });
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

function isSameJapaneseDay(date1, date2) {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear();
}
