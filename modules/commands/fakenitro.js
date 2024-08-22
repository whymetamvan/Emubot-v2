const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fake-nitrogen')
        .setDescription('nitroギフトリンクの生成')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('リンクの種類を選択')
                .setRequired(true)
                .addChoices(
                    { name: 'Nitroギフト形式', value: 'nitro' },
                    { name: 'プロモNitro形式', value: 'promo' },))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成する数')
                .setRequired(true)),

    async execute(interaction) {  
        try {
            await interaction.deferReply();

            const quantity = interaction.options.getInteger('count');
            const type = interaction.options.getString('type');
            const channelID = interaction.channel.id;
            const countLimited = Math.min(quantity, 10);
            if (quantity > 10) {
                return interaction.editReply({ content: '生成する数は10以下にしてね' });
            }

            const nitroLinks = generateNitroLinks(countLimited, type, channelID);

            const embed = new EmbedBuilder()
                .setColor('#f47fff')
                .setTimestamp()
                .setFooter({ text: 'Emubot | fake nitro', iconURL: 'https://i.gyazo.com/c54986b000f7374bb077839e6c9fecb9.png' })
                .setDescription(`**Fake ${type === 'nitro' ? 'Nitro Gift' : 'Promo Nitro'} Links** <a:nitronitronitro:1240815301801545789>\n${type === 'nitro' ? 'Nitroギフトリンク' : 'プロモニトロリンク'}\n${nitroLinks.join('\n')}`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('リンクの生成中にエラーが発生しました：', error);
            await interaction.editReply({ content: 'リンクの生成中にエラーが発生しました。', ephemeral: true });
        }
    },
};

function generateNitroLinks(quantity, type, channelID) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const nitroLinks = [];

    for (let j = 0; j < quantity; j++) {
        let code = '';
        if (type === 'nitro') {
            for (let i = 0; i < 16; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            nitroLinks.push(`https://discord.com/gifts/${code}`);
        } else {
            for (let i = 0; i < 24; i++) {
                code += characters.charAt(Math.floor(Math.random() * characters.length));
                if ((i + 1) % 4 === 0 && i !== 23) {
                    code += '-';
                }
            }
            nitroLinks.push(`https://discord.com/billing/promotions/${channelID}/${code}`);
        }
    }
    return nitroLinks;
}
