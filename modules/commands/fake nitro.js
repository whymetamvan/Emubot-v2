const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fake-nitrogen')
        .setDescription('nitroギフトリンクの生成')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成する数')
                .setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply(); 

          // 生成数を取得、10以上の場合はエラー
            const quantity = interaction.options.getInteger('count');

            const countLimited = Math.min(quantity, 10);
            if (quantity > 10) {
                return interaction.editReply({ content: '生成する数は10以下にしてね' });
            }
            const nitroLinks = generateNitroLinks(countLimited);

          // embedを送信 (Descriptionの絵文字は適宜変更)
            const embed = new EmbedBuilder()
                .setColor('#f47fff')
                .setTimestamp()
                .setFooter({ text:'Emubot | fake nitro'})
                .setDescription(`**Fake Nitro Gift Links** <a:nitronitronitro:1240815301801545789>\nNitroギフトリンク\n${nitroLinks.join('\n')}`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Nitro ギフトリンクの生成中にエラーが発生しました：', error);
            await interaction.editReply({ content: 'Nitro ギフトリンクの生成中にエラーが発生しました。', ephemeral: true });
        }
    },
};

// fake nitroリンク生成
function generateNitroLinks(quantity) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nitroLinks = [];

    for (let j = 0; j < quantity; j++) {
        let code = '';
        for (let i = 0; i < 16; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        nitroLinks.push(`https://discord.com/gifts/${code}`);
    }

    return nitroLinks;
}
