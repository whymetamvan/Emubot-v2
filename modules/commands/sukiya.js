const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const menu = JSON.parse(fs.readFileSync(path.join(__dirname, '../../lib/data/sukiya.json'), 'utf8'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sukiya')
    .setDescription('1000円に近いランダムなすき家メニューを表示します'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral:true });
    let selectedItems;
    do {
      selectedItems = chooseMenuItems();
    } while (selectedItems[selectedItems.length - 1].Total < 970);

    const embed = new EmbedBuilder()
      .setColor('#f8b4cb')
      .setTitle('すき家1000円ガチャの結果')
      .setTimestamp()
      .setFooter({ text: 'Emubot | sukiya', iconURL: 'https://www.sukiya.jp/assets/img/common/h_logo.png' })
      .setDescription('以下のメニューが選ばれました');

    selectedItems.slice(0, -1).forEach(item => {
      embed.addFields({ name: item.name, value: `${item.price}円` });
    });

    embed.addFields({ name: '合計', value: `${selectedItems[selectedItems.length - 1].Total}円`, inline: true });
    embed.addFields({ name: '使用データ元(古いかも)', value: '[このサイトのデータを使用](https://ituyama.com/SukiyaRandom/)', inline: true });

    await interaction.editReply({ embeds: [embed] });
  }
};

function chooseMenuItems() {
  const items = [];
  let total = 0;
  while (total < 1000) {
    const item = menu[total === 0 ? getRandomInt(0, 22) : getRandomInt(22, menu.length)];
    if (total + item.price > 1000) break;
    items.push(item);
    total += item.price;
  }
  items.push({ Total: total });
  return items;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
