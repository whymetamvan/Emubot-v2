// convert.js
const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('convert')
    .setDescription('文字列を指定形式に変換します。')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('変換タイプを選択します。')
        .setRequired(true)
        .addChoices(
          { name: "rune文字 (英語のみ)", value: "rune" }, 
          { name: "フェニキア文字 (英語のみ)", value: "phoenicia" },
          { name: "ヒエログリフ (英語のみ)", value: "hieroglyphs" },
          { name: "逆読み", value: "reverse" },
          { name: "アナグラム", value: "anagram" }
        )
    )
    .addStringOption(option =>
      option.setName('text')
        .setDescription('変換するテキストを入力してください。')
        .setRequired(true)),

  async execute(interaction) {
    // 変換する文字列とタイプを取得
    const type = interaction.options.getString('type');
    const text = interaction.options.getString('text');
    const conversionData = require(path.join(__dirname, '..', '..', 'lib', 'data', 'convert.json'));

    // メンションを含む場合は処理を終了
    if (hasMention(text)) {
      await interaction.reply({ content: 'メンションが含まれているため、変換を行いません。', ephemeral: true });
      return;
    }

    // それぞれに対応するもので変換を行う
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
      default:
        await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        return;
    }

    // Embedを送信
    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('変換完了！')
      .setDescription(`${type}に変換しました` + "\n" +'```\n' + `${convertedText}` + '\n```' ) 
      .setTimestamp()
      .setFooter({ text:'Emubot | convert'});
    await interaction.reply({ embeds:[embed] });
  },
};

// メンションを含むかどうかの確認
function hasMention(text) {
  return /<@!?(\d+)>/.test(text);
}

// lib/data/convert.jsonでの変換
function convertText(text, conversionMap) {
  return text.toUpperCase()
    .split('')
    .map(char => conversionMap[char] || char)
    .join('');
}

// アナグラム
function anagram(text) {
  const chars = text.split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}
