const { EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require('../../lib/data/config.json');
const client = require('../../clients'); 
async function sendErrorEmbed(errorType, error, promise = null) {
    const logChannel = client.channels.cache.get(config.logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setTitle(errorType)
        .setColor('#FF0000')
        .addFields(
            { name: 'Error', value: error.message || String(error), inline: true },
            { name: 'Stack', value: error.stack ? `\`\`\`${error.stack}\`\`\`` : 'No stack trace available', inline: false }
        )
        .setTimestamp();

    if (promise) {
        embed.addFields({ name: 'Promise', value: `\`\`\`${promise}\`\`\``, inline: false });
    }

    const fileMatch = error.stack && error.stack.split('\n')[1].match(/\((.*):(\d+):(\d+)\)/);
    const fileName = fileMatch ? path.basename(fileMatch[1]) : 'unknown';
    const lineNumber = fileMatch ? fileMatch[2] : 'unknown';
    const columnNumber = fileMatch ? fileMatch[3] : 'unknown';

    embed.addFields(
        { name: 'File', value: fileName, inline: true },
        { name: 'Line', value: lineNumber, inline: true },
        { name: 'Column', value: columnNumber, inline: true },
        { name: 'Error Code', value: error.code || 'N/A', inline: true },
        { name: 'Syscall', value: error.syscall || 'N/A', inline: true },
        { name: 'Path', value: error.path || 'N/A', inline: false }
    );

    await logChannel.send({ embeds: [embed] });
}

process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    await sendErrorEmbed('Unhandled Rejection', reason, promise);
});

process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    await sendErrorEmbed('Uncaught Exception', error);
});

client.on('error', async (error) => {
    console.error('Discord client error:', error);
    await sendErrorEmbed('Discord Client Error', error);
});

module.exports = {
    sendErrorEmbed
};
