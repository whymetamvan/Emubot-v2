const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('qr')
        .setDescription('QRコードを生成するよ')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('QRにしたいURLを入力してね')
                .setRequired(true)),

    async execute(interaction) {
        try {
          // URLを取得
            const url = interaction.options.getString('url');

          // embedを送信
            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('QRコードにしました！')
                .setTimestamp()
                .setFooter({ text:'Emubot | qr'})
          　    .setImage(`https://qrickit.com/api/qr.php?d=${encodeURIComponent(url)}`);

            await interaction.reply({ embeds: [embed] , ephemeral: true});
        } catch (error) {
            console.error(error);
            await interaction.reply('エラーが発生しました');
        }
    },
};
