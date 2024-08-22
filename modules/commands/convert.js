const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const { generate: generateGenhera } = require('genhera');
const { generate: generateCjp } = require('cjp');
const conversionData = require(path.join(__dirname, '..', '..', 'lib', 'data', 'convert.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('文字列を指定形式に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices(
          { name: 'ルーン文字', value: 'rune' },
          { name: 'フェニキア文字', value: 'phoenicia' },
          { name: 'ヒエログリフ', value: 'hieroglyphs' },
          { name: '逆読み', value: 'reverse' },
          { name: 'アナグラム', value: 'anagram' },
          { name: 'ﾒﾝﾍﾗ文生成', value: 'genhera' },
          { name: '怪しい日本語生成', value: 'cjp' },))
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)),

  async execute(interaction) {
    const type = interaction.options.getString('type');
    const text = interaction.options.getString('text');

    if (/^<@!?(\d+)>$/.test(text)) {
      await interaction.reply({ content: 'メンションが含まれているため、変換を行いません。', ephemeral: true });
      return;
    }
    await interaction.deferReply();
    const convertedText = convertText(type, text);

    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('変換完了！')
      .setDescription('```' + convertedText + '```')
      .setTimestamp()
      .setFooter({ text: 'Emubot | convert', iconURL: interaction.client.user.displayAvatarURL() });
    await interaction.editReply({ embeds: [embed] });
  },
};

function convertText(type, text) {
  switch (type) {
    case 'rune':
    case 'phoenicia':
    case 'hieroglyphs':
      return text.toUpperCase().split('').map(char => conversionData[type][char] || char).join('');
    case 'reverse':
      return text.split('').reverse().join('');
    case 'anagram':
      return text.split('').sort(() => Math.random() - 0.5).join('');
    case 'genhera':
      return generateGenhera(text);
    case 'cjp':
      return generateCjp(text);
    default:
      return 'エラーが発生しました。';
  }
}
