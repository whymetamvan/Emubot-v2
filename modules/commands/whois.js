require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('whois')
        .setDescription('whois情報の表示')
        .addStringOption(option =>
            option.setName('domain')
                .setDescription('調べたいドメイン')
                .setRequired(true)),
    async execute(interaction) {

        await interaction.deferReply();
        const domain = interaction.options.getString('domain');
        const thumbnailPath = path.join(__dirname, '../../lib/images/whois.png');
        const ip2_API = process.env.ip_API;
        try {

            const response = await axios.get(`https://api.ip2whois.com/v2?key=${ip2_API}&domain=${domain}`);
            const data = response.data;

            const embed = new EmbedBuilder()
                .setTitle(`WHOIS Lookup for ${domain}`)
                .addFields(
                    { name: '作成日', value: data.create_date || 'None' },
                    { name: '更新日', value: data.update_date || 'None' },
                    { name: '有効期限', value: data.expire_date || 'None' },
                    { name: '登録者名', value: data.registrant.name || 'None' },
                    { name: '登録者地域', value: data.registrant.city || 'None' },
                    { name: 'email', value: data.registrant.email || 'None' },
                )
                .setColor('#f8b4cb')
                .setTimestamp()
                .setFooter({ text: 'Emubot | whois', iconURL:'https://play-lh.googleusercontent.com/wpvk25q3DH4Sx5q5a3Ux5ZbimMZ5U33vq-qnyOTrhL05CdD9apw_YzHfTI_BqJkbuw=w240-h480-rw' })
                .setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
                .setTimestamp();

          await interaction.editReply(
            { embeds: [embed],files: [{attachment:thumbnailPath,name:path.basename(thumbnailPath)}] });        } catch (error) {
            console.log('whois error');
            await interaction.editReply('whois検索に失敗しました');
        }
    },
};
