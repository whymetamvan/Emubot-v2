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

      const image = interaction.options.getAttachment('image');

      if (image.contentType !== 'image/png' && image.contentType !== 'image/jpeg') {
        return await interaction.editReply('webpはできないんだよね..\n[ここ](<https://www.iloveimg.com/ja>)でPNG形式に変換してやってみて！');
      }

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

const embed = new EmbedBuilder()
.setTitle('背景を透過しました')
.setColor(0xf8b4cb)
.setTimestamp()
.setFooter({ text: 'Emutest | remove', iconURL:'https://play-lh.googleusercontent.com/4kF2IUQxdLs86iAVsmnHA1B34uO-dvtszKM8qzscc1InZb-2_JI0WANyOiWiV3qyNg=w240-h480-rw' })
.setImage('attachment://removebg.png');

await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (error) {
      console.error('画像の背景透過中にエラーが発生しました：', error);
      await interaction.editReply('エラーが発生しました');
    }
  },
};
