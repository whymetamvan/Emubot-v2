// 為替の取得にexchangerateAPIを使用するので登録をしてキーを取得してください
// 日経平均株価の取得はyahoo-financeを使用するので npm install yahoo-finance2 をしてください
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const yahooFinance = require('yahoo-finance2').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('現在の為替レートまたは日経平均株価を表示します。')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('表示したい情報を選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'ドル/円', value: 'USDJPY' },
                    { name: 'ユーロ/円', value: 'EURJPY' },
                    { name: '日経平均株価', value: 'NIKKEI' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        const apiKey = process.env.exchangeAPI;
        const choice = interaction.options.getString('type');
        const embed = new EmbedBuilder()
            .setColor('#f8b4cb')
            .setTitle('選択された情報')
            .setTimestamp()
            .setFooter({ text: 'EmuBOT | rate', iconURL: 'https://mpreview.aflo.com/UoR1jS55MseL/afloimagemart_163682654.jpg' });

        try {
            if (choice === 'USDJPY' || choice === 'EURJPY') {
                const currencyPair = choice;
                const exchangeApiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currencyPair.slice(0, 3)}`;
                const exchangeResponse = await axios.get(exchangeApiUrl);
                const exchangeData = exchangeResponse.data;

                if (exchangeData.result !== 'success' || !exchangeData.conversion_rates || !exchangeData.conversion_rates.JPY) {
                    await interaction.editReply('為替レートの取得に失敗しました。後でもう一度お試しください。');
                    return;
                }

                const rate = exchangeData.conversion_rates.JPY;
                const currencyName = currencyPair.slice(0, 3) === 'USD' ? 'ドル' : 'ユーロ';

                embed.setTitle(`${currencyName}/円 為替レート`)
                    .addFields({ name: `1 ${currencyName}`, value: `${rate} 円`, inline: true });

            } else if (choice === 'NIKKEI') {
                const symbol = '^N225'; 
                const quote = await yahooFinance.quote(symbol);

                if (!quote || !quote.regularMarketPrice) {
                    await interaction.editReply('日経平均株価の取得に失敗しました。後でもう一度お試しください。');
                    return;
                }

                const nikkeiPrice = quote.regularMarketPrice;
                embed.setTitle('日経平均株価')
                    .addFields({ name: '日経平均株価', value: `${nikkeiPrice} 円`, inline: true });
            }

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('エラーが発生しました。後でもう一度お試しください。');
        }
    },
};
