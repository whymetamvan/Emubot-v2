const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, '../../lib/data/sukiya.json');
const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sukiya')
        .setDescription('1000円に近いランダムなすき家メニューを表示します'),

    async execute(interaction) {
        await interaction.deferReply();
        let ins = ChoiceRandom();
        while (ins[ins.length - 1].Total < 970) {
            ins = ChoiceRandom();
        }

        const embed = new EmbedBuilder()
            .setColor('#f8b4cb')
            .setTitle('すき家1000円ガチャの結果')
            .setTimestamp()
            .setFooter({ text: 'Emubot | sukiya', iconURL: 'https://www.sukiya.jp/assets/img/common/h_logo.png'})
            .setDescription('以下のメニューが選ばれました');

        ins.slice(0, -1).forEach(item => {
            embed.addFields({ name: item.name, value: `${item.price}円` });
        });

        embed.addFields({ name: '合計', value: `${ins[ins.length - 1].Total}円`, inline: true });
        embed.addFields({ name: '使用データ元(古いかも)', value: '[このサイトのデータを使用](https://ituyama.com/SukiyaRandom/)', inline: true })

        await interaction.editReply({ embeds: [embed] });
    }
};

// ランダム整数生成
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

// ランダムな牛丼を選択する
function ChoiceGyudon() {
    return menu[getRandomInt(0, 22)];
}

// メニューを1000円に近づける
function ChoiceRandom() {
    let fs = ChoiceGyudon();
    let price = fs.price;
    let MenuList = [fs.name];
    let MenuPriceList = [fs.price];
    let TotalList = [fs];

    while (price < 1000) {
        let MenuNow = menu[getRandomInt(22, menu.length)];
        MenuList.push(MenuNow.name);
        MenuPriceList.push(MenuNow.price);
        TotalList.push(MenuNow);
        price += MenuNow.price;
    }

    if (price > 1000) {
        MenuList.pop();
        MenuPriceList.pop();
        TotalList.pop();
    }

    let totalPrice = MenuPriceList.reduce((a, b) => a + b, 0);
    TotalList.push({ Total: totalPrice });
    return TotalList;
}
