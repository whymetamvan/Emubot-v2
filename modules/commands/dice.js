const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dice')
        .setDescription('サイコロをふります'),
    
    async execute(interaction) {
        try {
            await interaction.deferReply();
            const thumbnailPath = path.join(__dirname, '../../lib/images/dice.gif');

            const diceRoll = Math.floor(Math.random() * 6) + 1;

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('サイコロ 🎲')
                .setTimestamp()
                .setFooter({ text:'Emubot | dice', iconURL:'https://cdn.icon-icons.com/icons2/1465/PNG/512/678gamedice_100992.png'})
                .setThumbnail(`attachment://${path.basename(thumbnailPath)}`)
                .setDescription(`サイコロの目は \`${diceRoll}\` です！`);

            await interaction.editReply({ embeds: [embed],files: [{attachment:thumbnailPath,name:path.basename(thumbnailPath)}] });
        } catch (error) {
            console.error('diceエラー',error);

            try {
                await interaction.editReply({ content: 'エラーが発生しました', ephemeral: true });
            } catch (replyError) {
                console.error('Replyエラー', replyError);
            }
        }
    },
};
