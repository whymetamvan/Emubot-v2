const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qr')
    .setDescription('QRコードの生成とQRコードの読み取りを行います')
    .addStringOption(option =>
      option.setName('action')
        .setDescription('実行したい操作を選択してください')
        .setRequired(true)
        .addChoices(
          { name: 'URLをQRコードに変換', value: 'generate' },
          { name: 'QRコードをURLに変換', value: 'read' }
        )
    )
    .addStringOption(option =>
      option.setName('url')
        .setDescription('QRに変換したいURLを入力してください')
        .setRequired(false)
    )
    .addAttachmentOption(option =>
      option.setName('file')
        .setDescription('読み取りたいQRコードの画像をアップロードしてください')
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const action = interaction.options.getString('action');
      const url = interaction.options.getString('url');
      const file = interaction.options.getAttachment('file');

      if (action === 'generate') {
        if (!url) {
          await interaction.editReply('QRコードに変換したいURLを入力してください。');
          return;
        }

        const embed = new EmbedBuilder()
          .setColor('#f8b4cb')
          .setTitle('QRコードにしました！')
          .addFields({ name: 'URL', value: url })
          .setTimestamp()
          .setFooter({ text: 'Emubot | qr', iconURL: 'https://mpreview.aflo.com/pCiOjL55MseL/afloimagemart_217582635.jpg' })
          .setImage(`https://qrickit.com/api/qr.php?d=${encodeURIComponent(url)}`);

        await interaction.editReply({ embeds: [embed], ephemeral: true });
      } else if (action === 'read') {
        if (!file) {
          await interaction.editReply('QRコードの画像をアップロードしてください。');
          return;
        }

        const apiUrl = `https://api.qrserver.com/v1/read-qr-code/?fileurl=${encodeURIComponent(file.url)}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data[0] && data[0].symbol[0] && data[0].symbol[0].data) {
          const decodedUrl = data[0].symbol[0].data;

          const embed = new EmbedBuilder()
            .setColor('#f8b4cb')
            .setTitle('QRコードを読み取りました！')
            .addFields({ name: 'URL', value: decodedUrl })
            .setTimestamp()
            .setFooter({ text: 'Emubot | qr', iconURL: 'https://mpreview.aflo.com/pCiOjL55MseL/afloimagemart_217582635.jpg' });

          await interaction.editReply({ embeds: [embed], ephemeral: true });
        } else {
          await interaction.editReply('QRコードの読み取りに失敗しました。画像が正しいか確認してください。');
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('エラーが発生しました。');
    }
  },
};
