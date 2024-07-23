// https://github.com/otoneko1102/totsuzennoshi-gen　参考
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('totsu-shi')
    .setDescription('突然の死ジェネレーターです')
    .addStringOption(option => 
      option.setName('content')
        .setDescription('生成する内容')
        .setRequired(true)),
  async execute(interaction) {
    await interaction.deferReply();
    const input = interaction.options.getString('content');
    const generatedText = generateSuddenDeathText(input);
    
    await interaction.editReply('**突然の死でございまーす**' + '\n\n' + generatedText);
  },
};

function generateSuddenDeathText(str) {
  const count = Math.floor(countWidth(str) / 2) + 2;
  const plus = count > 15 ? 1 : 0;
  const up = '人'.repeat(count + plus);
  const under = '^Y'.repeat(count);
  return `＿${up}＿\n＞　${str.replace(/\n/g, '　＜\n＞　')}　＜\n￣${under}￣`;
}

function countWidth(str) {
  return Array.from(str).reduce((acc, char) => acc + (char.charCodeAt(0) <= 0xff ? 1 : 2), 0);
}
