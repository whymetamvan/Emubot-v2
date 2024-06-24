// Yahoonの制限上、EUサーバーからでは使えません
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');

const cooldowns = new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yahoo')
        .setDescription('ランダムなYahooニュースリンクを取得します'),

    async execute(interaction) {
        const guildId = interaction.guild.id;
        const currentTime = Date.now();
        const cooldownAmount = 2 * 60 * 1000; 

      // クールダウン中の処理
        if (cooldowns.has(guildId)) {
            const expirationTime = cooldowns.get(guildId) + cooldownAmount;
            if (currentTime < expirationTime) {
                const timeLeft = (expirationTime - currentTime) / 1000;
                return interaction.reply({ content: `このコマンドを再度使用するには ${timeLeft.toFixed(1)} 秒待つ必要があります。`, ephemeral: true });
            }
        }

        cooldowns.set(guildId, currentTime);

        await interaction.deferReply();

      // yahoo.co.jpからニュースリンクを取得
        const url = 'https://www.yahoo.co.jp/';

        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            const newsLinks = [];

            $('a[href*="news.yahoo.co.jp/pickup"]').each((i, el) => {
                newsLinks.push($(el).attr('href'));
            });

            if (newsLinks.length > 0) {
                const randomLink = newsLinks[Math.floor(Math.random() * newsLinks.length)];

                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.EmbedLinks)) {
                    return interaction.editReply({ content: '埋め込みリンクを送信する権限がありません。', ephemeral: true });
                }

              // 取得したリンクを送信
                await interaction.editReply({ content: randomLink });
            } else {
                await interaction.editReply('ニュースが見つかりません');
            }
        } catch (error) {
            console.error('Error with Yahoo scraping:', error);

            let errorMessage = 'エラーが発生しました。もう一度試してください。';
            if (error.response) {

                errorMessage = `Yahooサーバーからのエラー: ${error.response.status} - ${error.response.statusText}`;
            } else if (error.request) {
                errorMessage = 'Yahooサーバーからの応答がありませんでした。';
            } else {
                errorMessage = `リクエストの設定中にエラーが発生しました: ${error.message}`;
            }
console.log(`${errorMessage}`);
            await interaction.editReply('エラーが発生しました');
        }
    }
};
