const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const { generate: generateGenhera } = require('genhera');
const { generate: generateCjp } = require('cjp');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('文字列を指定形式に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "rune文字", value: "rune" },
          { name: "フェニキア文字", value: "phoenicia" },
          { name: "ヒエログリフ", value: "hieroglyphs" },
          { name: "逆読み", value: "reverse" },
          { name: "アナグラム", value: "anagram" },
          { name: "ﾒﾝﾍﾗ文生成", value: "genhera" },
          { name: "怪しい日本語生成", value: "cjp" }
        )
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)
    ),

  async execute(interaction) {
    const type = interaction.options.getString('type');
    const text = interaction.options.getString('text');
    const conversionData = require(path.join(__dirname, '..', '..', 'lib', 'data', 'convert.json'));

    if (/^<@!?(\d+)>$/.test(text)) {
      await interaction.reply({ content: 'メンションが含まれているため、変換を行いません。', ephemeral: true });
      return;
    }

    let convertedText = '';
    switch (type) {
      case 'rune':
        convertedText = convertText(text, conversionData.rune);
        break;
      case 'phoenicia':
        convertedText = convertText(text, conversionData.phoenicia);
        break;
      case 'hieroglyphs':
        convertedText = convertText(text, conversionData.hieroglyphs);
        break;
      case 'reverse':
        convertedText = text.split('').reverse().join('');
        break;
      case 'anagram':
        convertedText = anagram(text);
        break;
      case 'genhera':
        convertedText = generateGenhera(text);
        break;
      case 'cjp':
        convertedText = generateCjp(text);
        break;
      default:
        await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        return;
    }

    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('変換完了！')
      .setDescription('```'+convertedText+'```')
      .setTimestamp()
      .setFooter({ text: 'Emubot | convert', iconURL: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4No8kzYwqTUgca_83uUhfOSJzFqbLaTM_VQJY1qbQ1m2szo_ZNEmilQfYNDEbW_a1SOo&usqp=CAU' });

    await interaction.deferReply();
    await interaction.editReply({ embeds: [embed] });
  },
};

function convertText(text, conversionMap) {
  return text.toUpperCase().split('').map(char => conversionMap[char] || char).join('');
}

function anagram(text) {
  const chars = text.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
