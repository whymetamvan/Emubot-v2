require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shorturl')
        .setDescription('URLを短縮します')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('短縮したいURLを入力してください')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        const urlToShorten = interaction.options.getString('url');
        const apiKey = process.env.xgd_API;
        try {
            const response = await axios.get(`https://xgd.io/V1/shorten?url=${encodeURIComponent(urlToShorten)}&key=${apiKey}`);
            if (response.status === 200 && response.data.status === 200) {
                const Url = response.data.shorturl;
                const shortenedUrl = `<${Url}>`;
                const embed = new EmbedBuilder()
                .setDescription(`**[URL](${urlToShorten})を短縮化しました！**\n\n**短縮URL: ${shortenedUrl}**`)
                .setTimestamp()
                .setFooter({ text: 'Emutest | shortURL', iconURL:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpJRM9dYW0kYc3v7MgXiZLRcFt-OWD4kZk9Q&s' })
                .setColor('#f8b4cb');

                await interaction.editReply({ embeds:[embed] });
            } else {
                await interaction.editReply('URLの短縮に失敗しました。');
            }
        } catch (error) {
            console.error(error);
            await interaction.editReply('URLの短縮に失敗しました。');
        }
    },
};