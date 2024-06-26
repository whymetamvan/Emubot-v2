const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('calc')
    .setDescription('数式を計算します。')
    .addStringOption(option =>
      option.setName('expression')
        .setDescription('計算する数式')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      await interaction.deferReply();

    // 式を取得
      let expression = interaction.options.getString('expression');
    // ×と÷はそのままだと認識されないので*と/に変換
      expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
      const result = Function(`'use strict'; return ${expression}`)();

    // embedを送信
      const thumbnailPath = path.join(__dirname, '../../lib/images/calc.png');

      const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('Emubot | calculator')
      .setTimestamp()
      .setFooter({ text:'Emubot | calc'})
.setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
      .setDescription('**計算できました！**'+'\n'+'```\n'+`${expression} = ${result}`+'```\n');

      await interaction.editReply(
        { embeds: [embed],files: [{attachment:thumbnailPath,name:path.basename(thumbnailPath)}] });
      
    } catch (error) {
      console.error('計算時にエラーが発生しました',error);
      await interaction.editReply('式の計算に失敗しました。');
    }
  },
};
