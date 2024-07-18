const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fake-tokengen')
        .setDescription('token(のような文字列)を生成')
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('生成する数')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const count = interaction.options.getInteger('count') || 1; 
            const guildMembers = interaction.guild.members.cache; 
            const memberIds = getRandomMemberIds(guildMembers, count); 

            const tokens = memberIds.map(memberId => generateToken(memberId));

            const embed = new EmbedBuilder()
                .setColor('#7289da')
                .setTitle('Token')
                .setTimestamp()
                .setFooter({ text:'Emubot | fake-tokengen', iconURL:'https://i.gyazo.com/c54986b000f7374bb077839e6c9fecb9.png' })
                .setDescription(tokens.join('\n'));

            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } catch (error) {
            console.error('token生成エラー:', error);
            await interaction.followUp({ content: '生成中にエラーが発生しました', ephemeral: true });
        }
    },
};

function getRandomMemberIds(guildMembers, count) {
    const memberIds = [];
    for (let i = 0; i < count; i++) {
        const randomMember = guildMembers.random(); 
        memberIds.push(randomMember.id); 
    }
    return memberIds;
}

function generateToken(memberId) {
    const base64MemberId = Buffer.from(memberId).toString('base64');
    const randomString = generateRandomString(6);
    const randomChars = generateRandomString(32, true);
    return `${base64MemberId}.${randomString}.${randomChars}`;
}

function generateRandomString(length, includeChars = false) {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (includeChars) chars += '._-'; 

    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
}