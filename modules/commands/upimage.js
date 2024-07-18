const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('image-to-link')
        .setDescription('画像をリンクに変換します')
        .addAttachmentOption(option => 
            option.setName('image')
                .setDescription('リンクにしたい画像をアップロード')
                .setRequired(true)
        ),
    
    async execute(interaction) {
        await interaction.deferReply({ ephemeral:true });

        const attachment = interaction.options.getAttachment('image');
        const imagePath = path.join(__dirname, attachment.name);

        try {
            const writer = fs.createWriteStream(imagePath);
            const response = await axios.get(attachment.url, { responseType: 'stream' });
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            const form = new FormData();
            form.append('files', fs.createReadStream(imagePath));

            const uploadResponse = await axios.post('https://hm-nrm.h3z.jp/uploader/work.php', form, {
                headers: {
                    ...form.getHeaders(),
                    'Accept': 'application/json'
                }
            });

            const uploadData = uploadResponse.data;
            if (uploadData.files && uploadData.files.length > 0) {
                const imageUrl = uploadData.files[0].url;

                const embed = new EmbedBuilder()
                    .setColor(0xf8b4cb)
                    .setTitle('リンクに変換しました！')
                    .setTimestamp()
                    .setFooter({ text: 'Emubot | image-to-link', iconURL: interaction.client.user.displayAvatarURL() })
                    .setDescription(`画像のリンク: ${imageUrl}`)
                    .setImage(imageUrl);

                await interaction.editReply({ embeds: [embed] });
            } else {
                throw new Error('画像のアップロードに失敗しました。');
            }
        } catch (error) {
            console.error(error);

            try {
                await interaction.editReply('画像のアップロード中にエラーが発生しました。');
            } catch (replyError) {
                console.error('Failed to send error message to the user:', replyError);
            }
        } finally {
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
    },
};