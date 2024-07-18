const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dot')
        .setDescription('ドット絵に変換します')
        .addAttachmentOption(option =>
            option.setName('image')
                .setDescription('画像をアップロード')
                .setRequired(true)),
    async execute(interaction) {
        const attachment = interaction.options.getAttachment('image');
        if (!attachment) {
            return interaction.reply({ content: '画像がアップロードされていません', ephemeral: true });
        }

        const imageUrl = attachment.url;
        const apiUrl = `https://pixel-image.vercel.app/api?image=${encodeURIComponent(imageUrl)}&size=4&k=8`;

        try {
            const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
            const resultImageUrl = response.request.res.responseUrl;

            const embed = new EmbedBuilder()
                .setTitle('ドット絵に変換しました！')
                .setTimestamp()
                .setFooter({ text: 'Emubot | dot', iconURL: interaction.client.user.displayAvatarURL() })
                .setImage(resultImageUrl)
                .setTimestamp();

            await interaction.deferReply();
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'エラーが発生しました', ephemeral: true });
        }
    },
};
