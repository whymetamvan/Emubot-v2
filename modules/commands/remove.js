require('dotenv').config();
const { SlashCommandBuilder, AttachmentBuilder,EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('画像の背景透過')
    .addAttachmentOption(option => option.setName('image').setDescription('背景を削除したい画像を選択').setRequired(true)),

  async execute(interaction) {
    try {
      await interaction.deferReply();

      // 画像の取得、remove.bgの制限上、pngとjpg以外はメッセージの送信
      const image = interaction.options.getAttachment('image');

      if (image.contentType !== 'image/png' && image.contentType !== 'image/jpeg') {
        return await interaction.editReply('webpはできないんだよね..\n[ここ](<https://www.iloveimg.com/ja>)でPNG形式に変換してやってみて！');
      }

      // APIキーの取得、remove.bgAPIに投げる
      const apiKey = process.env.remove_API;

      const response = await axios.post('https://api.remove.bg/v1.0/removebg',
        {
          image_url: image.proxyURL,
          size: 'auto'
        },
        {
          headers: {
            'X-Api-Key': apiKey,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      const buffer = Buffer.from(response.data, 'binary');
      const attachment = new AttachmentBuilder(buffer, { name: 'removebg.png' });

      // embedを送信
　　　const embed = new EmbedBuilder()
　　　.setTitle('背景を透過しました')
　　　.setColor(0xf8b4cb)
　　　.setTimestamp()
　　　.setFooter({ text: "Emutest | remove"})
　　　.setImage('attachment://removebg.png');

　　　await interaction.editReply({ embeds: [embed], files: [attachment] });
   　　 } catch (error) {
    　　  console.error('画像の背景透過中にエラーが発生しました：', error);
     　　 await interaction.editReply('エラーが発生しました');
   　　 }
 　　 },
　　};
