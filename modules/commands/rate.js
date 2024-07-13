// exchangerate-apiを使用するため、登録をしてください
require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('現在の為替レートを表示します。')
        .addStringOption(option =>
            option.setName('currency')
                .setDescription('表示したい通貨ペアを選択してください')
                .setRequired(true)
                .addChoices(
                    { name: 'ドル/円', value: 'USDJPY' },
                    { name: 'ユーロ/円', value: 'EURJPY' }
                )),
    async execute(interaction) {
        await interaction.deferReply();

        // apiにポーン
        const apiKey = process.env.exchangeAPI;
        const currencyPair = interaction.options.getString('currency');
        const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currencyPair.slice(0, 3)}`;

        try {
            const response = await axios.get(apiUrl);
            const { data } = response;

            if (data.result !== 'success' || !data.conversion_rates || !data.conversion_rates.JPY) {
                await interaction.editReply('為替レートの取得に失敗しました。後でもう一度お試しください。');
                return;
            }

            // embedほーい
            const rate = data.conversion_rates.JPY;
            const currencyName = currencyPair.slice(0, 3) === 'USD' ? 'ドル' : 'ユーロ';

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle(`${currencyName}/円 為替レート`)
                .addFields(
                    { name: `1 ${currencyName}`, value: `${rate} 円`, inline: true },
                )
                .setTimestamp()
                .setFooter({ text: 'EmuBOT | rate', iconURL: 'https://mpreview.aflo.com/UoR1jS55MseL/afloimagemart_163682654.jpg' });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('エラーが発生しました。後でもう一度お試しください。');
        }
    },
};
