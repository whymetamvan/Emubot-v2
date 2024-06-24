const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');

const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉", "凶", "大凶"];
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
          result = fortunes[Math.floor(Math.random() * fortunes.length)];
        } while (dailyFortunes.get(userId) === result); 

        const embed = new EmbedBuilder()
          .setTitle('おみくじ結果')
          .setDescription(`今日の<@${interaction.user.id}>は **${result}** だよ！\nまた明日引いてね！`)
          .setTimestamp()
          .setFooter({ text:'Emubot | omikuji'})

          .setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
          .setColor('#f8b4cb');

        await interaction.editReply({
          embeds: [embed],
          files: [{
            attachment: thumbnailPath,
            name: path.basename(thumbnailPath)
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

const thumbnailPath = path.join(__dirname, '..', '..', 'lib', 'images', 'omikuji.png');

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}
