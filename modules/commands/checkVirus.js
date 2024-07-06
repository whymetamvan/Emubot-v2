require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check-virus')
        .setDescription('URLやファイルの危険性を判断します')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('調べたいものを選択')
                .setRequired(true)
                .addChoices(
                    { name: 'URL', value: 'url' },
                    { name: 'File', value: 'file' },
                ))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URLを入力してください')
                .setRequired(false))
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('ファイルをアップロードしてください')
                .setRequired(false)),
    async execute(interaction) {
        const type = interaction.options.getString('type');
        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        if (type === 'url') {
            const url = interaction.options.getString('url');
            if (!url) {
                return interaction.reply({ content: 'URLを入力してください', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('URL Check')
                .setDescription(`Checking the URL: ${url} <a:load:1259148838929961012>`)
                .setColor(0x00FF00);

            await interaction.reply({ embeds: [embed] });

            try {
                const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '');
                const response = await axios.get(`https://www.virustotal.com/api/v3/urls/${encodedUrl}`, {
                    headers: {
                        'x-apikey': apiKey
                    }
                });

                const data = response.data;
                const analysisResults = data.data.attributes.last_analysis_results;
                const results = Object.keys(analysisResults).map(key => ({
                    engine: key,
                    result: analysisResults[key].result,
                    category: analysisResults[key].category
                }));

                const detectedResults = results.filter(result => result.result !== 'clean' && result.result !== 'unrated');
                const cleanResults = results.filter(result => result.result === 'clean');
                const unratedResults = results.filter(result => result.result === 'unrated').slice(0, 5);

                const descriptionSuffix = detectedResults.length >= 3 ? ' ⚠️' : detectedResults.length === 0 ? ' ✅' : '';

                const embedResult = new EmbedBuilder()
                    .setTitle('URL check completed!')
                    .setDescription(`診断URL: ${url}${descriptionSuffix}`)
                    .setColor(detectedResults.length > 0 ? 0xFF0000 : 0x00FF00);

                let totalFields = 0;

                detectedResults.forEach(result => {
                    if (totalFields < 25) {
                        embedResult.addFields(
                            { name: result.engine, value: result.result || 'clean', inline: true }
                        );
                        totalFields++;
                    }
                });

                cleanResults.forEach(result => {
                    if (totalFields < 25) {
                        embedResult.addFields(
                            { name: result.engine, value: result.result || 'clean', inline: true }
                        );
                        totalFields++;
                    }
                });

                unratedResults.forEach(result => {
                    if (totalFields < 25) {
                        embedResult.addFields(
                            { name: result.engine, value: result.result || 'unrated', inline: true }
                        );
                        totalFields++;
                    }
                });

                await interaction.editReply({ embeds: [embedResult] });
            } catch (error) {
                console.error(error);

                const embedError = new EmbedBuilder()
                    .setTitle('URLcheck error')
                    .setDescription(`エラーが発生したURL: ${url}`)
                    .setColor(0xFF0000);

                await interaction.editReply({ embeds: [embedError] });
            }
        } else if (type === 'file') {
            const file = interaction.options.getAttachment('file');
            if (!file) {
                return interaction.reply({ content: 'ファイルをアップロードしてください', ephemeral: true });
            }

            const embed = new EmbedBuilder()
                .setTitle('File Check')
                .setDescription(`Checking this file...: ${file.name} <a:load:1259148838929961012>`)
                .setColor(0x00FF00);

            await interaction.reply({ embeds: [embed] });

            try {
                const filePath = path.join(__dirname, file.name);
                const writer = fs.createWriteStream(filePath);

                const response = await axios({
                    url: file.url,
                    method: 'GET',
                    responseType: 'stream'
                });

                response.data.pipe(writer);

                writer.on('finish', async () => {
                    const form = new FormData();
                    form.append('file', fs.createReadStream(filePath));

                    const fileResponse = await axios.post('https://www.virustotal.com/api/v3/files', form, {
                        headers: {
                            'x-apikey': apiKey,
                            ...form.getHeaders()
                        }
                    });

                    const fileData = fileResponse.data;
                    if (!fileData.data || !fileData.data.attributes || !fileData.data.attributes.last_analysis_results) {
                        throw new Error('Unable to process file type');
                    }

                    const fileResults = fileData.data.attributes.last_analysis_results;
                    const fileResultArray = Object.keys(fileResults).map(key => ({
                        engine: key,
                        result: fileResults[key].result,
                        category: fileResults[key].category
                    }));

                    const detectedFileResults = fileResultArray.filter(result => result.result !== 'clean' && result.result !== 'unrated');
                    const cleanFileResults = fileResultArray.filter(result => result.result === 'clean');
                    const unratedFileResults = fileResultArray.filter(result => result.result === 'unrated').slice(0, 5);

                    const descriptionSuffix = detectedFileResults.length >= 3 ? ' ⚠️' : detectedFileResults.length === 0 ? ' ✅' : '';

                    const embedFileResult = new EmbedBuilder()
                        .setTitle('File check completed!')
                        .setDescription(`診断ファイル: ${file.name}${descriptionSuffix}`)
                        .setColor(detectedFileResults.length > 0 ? 0xFF0000 : 0x00FF00);

                    let totalFields = 0;

                    detectedFileResults.forEach(result => {
                        if (totalFields < 25) {
                            embedFileResult.addFields(
                                { name: result.engine, value: result.result || 'clean', inline: true }
                            );
                            totalFields++;
                        }
                    });

                    cleanFileResults.forEach(result => {
                        if (totalFields < 25) {
                            embedFileResult.addFields(
                                { name: result.engine, value: result.result || 'clean', inline: true }
                            );
                            totalFields++;
                        }
                    });

                    unratedFileResults.forEach(result => {
                        if (totalFields < 25) {
                            embedFileResult.addFields(
                                { name: result.engine, value: result.result || 'unrated', inline: true }
                            );
                            totalFields++;
                        }
                    });

                    await interaction.editReply({ embeds: [embedFileResult] });
                    fs.unlinkSync(filePath);
                });

                writer.on('error', (error) => {
                    console.error(error);

                    const embedError = new EmbedBuilder()
                        .setTitle('File Check Error')
                        .setDescription(`エラーが発生したファイル: ${file.name}`)
                        .setColor(0xFF0000);

                    interaction.editReply({ embeds: [embedError] });
                    fs.unlinkSync(filePath);
                });
            } catch (error) {
                console.error(error);

                const embedError = new EmbedBuilder()
                    .setTitle('File Check Error')
                    .setDescription(`There was an error checking the file: ${file.name}`)
                    .setColor(0xFF0000);

                await interaction.editReply({ embeds: [embedError] });
            }
        }
    },
};
