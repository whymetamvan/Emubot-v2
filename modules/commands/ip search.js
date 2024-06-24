require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ip')
        .setDescription('IP情報の表示')
        .addStringOption(option =>
            option.setName('ip')
                .setDescription('調べたいIP')
                .setRequired(true)),
    async execute(interaction) {
        // ipを取得
        const ip = interaction.options.getString('ip');
        await interaction.deferReply();

        try {
            const thumbnailPath = path.join(__dirname, '..', '..', 'lib', 'images', 'ip.png');

            // apiキーを取得、ip2locationAPIに投げる
            const ip2_API = process.env.ip_API;

            const response = await axios.get(`https://api.ip2location.io/?key=${ip2_API}&ip=${ip}`);
            const data = response.data;

            // embedを送信
            const embed = new EmbedBuilder()
                .setTitle(`IP Lookup for ${ip}`)
                .addFields(
                    { name: '国', value: data.country_name || 'None', inline: true },
                    { name: '地域', value: data.region_name || 'None', inline: true },
                    { name: '都市', value: data.city_name || 'None', inline: true },
                    { name: '緯度', value: data.latitude ? data.latitude.toString() : 'None', inline: true },
                    { name: '経度', value: data.longitude ? data.longitude.toString() : 'None', inline: true },
                    { name: 'タイムゾーン', value: data.time_zone || 'None', inline: true },
                    { name: 'ASN', value: data.asn || 'None', inline: true },
                    { name: 'ISP', value: data.isp || 'None', inline: true }
                )
                .setColor('#f8b4cb')
                .setTimestamp()
                .setFooter({ text: "Emutest | ip lookup"})
                .setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
                .setTimestamp();

        await interaction.editReply(
            { embeds: [embed],files: [{attachment:thumbnailPath,name:path.basename(thumbnailPath)}] }); 
        } catch (error) {
            console.log('ip error');
            await interaction.editReply('IP検索エラーです');
        }
    },
};
