const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('現在のUSD/JPYの為替レートを表示します'),
    async execute(interaction) {
        await interaction.deferReply();
        try {
            // データを取得
            const response = await axios.get('https://svr242api.nakn.jp/rate.json');
            const data = response.data;

            const usdJpyRate = data.rate.USDJPY;

            // Embedを作成
            const rateEmbed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('USD/JPY 為替レート')
                .setDescription(`現在のUSD/JPYの為替レートは **${usdJpyRate}** です。`)
                .setTimestamp()
                .setFooter({ text: 'EmuBOT | rate' });

            await interaction.editReply({ embeds: [rateEmbed] });
        } catch (error) {
            console.error('Error fetching the exchange rate:', error);
            await interaction.editReply('為替レートの取得に失敗しました。');
        }
    },
};
