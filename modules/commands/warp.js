const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warpkey-gen')
        .setDescription('warpVPNのキーを生成します。(これはちゃんと使えるやつだよ)'),

    async execute(interaction) {
        await interaction.deferReply();

        const result = await generateKey();

        if (result) {
            const { key } = result;

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('生成完了！')
                .addFields(
                    { name: 'warp Key', value: '```' + key + '```'}
                )
                .setTimestamp()
                .setFooter({ text: 'Emubot | warpkey-gen', iconURL: interaction.client.user.displayAvatarURL() });

            await interaction.editReply({ embeds: [embed] });
        } else {
            console.error(error);
            await interaction.editReply({ content: 'エラーが発生しました' });
        }
    },
};

let keys = [];

const keyFilePath = path.join(__dirname, '..', '..', 'lib', 'data', '積み立てwarp.txt');

fs.readFile(keyFilePath, "utf8", (err, data) => {
    if (err) throw err;
    keys = data.split(/\s+/);
});

async function generateKey() {
    try {
        const headers = {
            "CF-Client-Version": "a-6.11-2223",
            "Host": "api.cloudflareclient.com",
            "connection": "Keep-Alive",
            "Accept-Encoding": "gzip",
            "x-cache-set": "false",
            "x-envoy-upstream-service-time": "0",
        };

        const key = keys[Math.floor(Math.random() * keys.length)];

        const client = axios.create({
            headers: headers,
            timeout: 35000
        });

        const response = await client.post("https://api.cloudflareclient.com/v0a2223/reg");
        const response_data = response.data;
        const r_id = response_data.id;
        const token = response_data.token;

        const headers_post = {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": `Bearer ${token}`
        };

        const json_data = { license: key };
        await client.put(`https://api.cloudflareclient.com/v0a2223/reg/${r_id}/account`, json_data, { headers: headers_post });

        const account_response = await client.get(`https://api.cloudflareclient.com/v0a2223/reg/${r_id}/account`, { headers: headers_post });
        const account_data = account_response.data;
        const gened_key = account_data.license;

        await client.delete(`https://api.cloudflareclient.com/v0a2223/reg/${r_id}`, { headers: headers_post });

        return { key: gened_key };

    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
}
