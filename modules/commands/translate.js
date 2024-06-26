const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const axios = require('axios');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('translate')
    .setDescription('日本語を他言語に翻訳します。')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('翻訳したいテキストを入力してください。')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('language')
        .setDescription('翻訳したい言語を選択してください。')
        .setRequired(true)
        .addChoices(
                   { name:"英語", value:"en" },
                   { name:"中国語", value:"zh-cn" },
                   { name:"韓国語", value:"ko" },
                   { name:"ロシア語", value:"ru" })
    ),
async execute(interaction) {
  await interaction.deferReply();

  // 文字列と言語を取得
  const text = interaction.options.getString('text');
  const targetLanguage = interaction.options.getString('language');

  // メンションが含まれていれば終了
if (hasMention(text)) {
  await interaction.editReply({ content: 'メンションが含まれているため、変換を行いません。', ephemeral: true });
  return;
}
  const thumbnailPath = path.join(__dirname, '../../lib/images/translate.png');
  try {
    const translatedText = await gasTranslate(text, 'ja', targetLanguage);

    // embedの送信
    const embed = new EmbedBuilder()
      .setDescription('**翻訳しました！**'+'\n'+'```\n'+`${translatedText}`+'\n```')
      .setTimestamp()
      .setFooter({ text:'Emubot | translate'})
.setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
      .setColor('#f8b4cb');
    
  await interaction.editReply(
    { embeds: [embed],files: [{attachment:thumbnailPath,name:path.basename(thumbnailPath)}] });
  } catch (error) {
    console.error(error);
    await interaction.editReply({ content:'翻訳エラーが発生しました', ephemeral:true });
}
  },
};

// メンションの確認
function hasMention(text) {
  return /<@!?(\d+)>/.test(text);
}

// 翻訳のためのAPIに投げる
function gasTranslate(text, source, target) {
  return axios.get(`https://script.google.com/macros/s/AKfycbweJFfBqKUs5gGNnkV2xwTZtZPptI6ebEhcCU2_JvOmHwM2TCk/exec`, {
    params: {
      text,
      source,
      target
    }
  }).then(response => {
    return response.data;
  }).catch(error => {
    throw error;
  });
}

