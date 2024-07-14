const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = (client) => {
    client.on('messageCreate', async message => {
        const mentionPattern = /<@1211256321484005436>/;
        if (!mentionPattern.test(message.content)) {
            return;
        }

        if (message.mentions.has(client.user) && !message.author.bot) {
            const referencedMessage = message.reference
                ? await message.channel.messages.fetch(message.reference.messageId)
                : null;

            if (!referencedMessage) {
                return;
            }

            const displayName = referencedMessage.member
                ? referencedMessage.member.displayName
                : referencedMessage.author.username;
            const username = referencedMessage.author.username;
            const text = referencedMessage.content;
            const avatar = referencedMessage.author.displayAvatarURL({
                format: 'png',
                dynamic: true,
            });

            let color = false;  
            if (message.content.toLowerCase().includes('color')) {
                color = true;
            }

            const payload = {
                username: username,
                display_name: displayName,
                text: text,
                avatar: avatar,
                color: color, 
            };

            const loadingMessage = await message.channel.send('画像生成中です...<a:load:1259148838929961012>');

            try {
                const response = await axios.post('https://api.voids.top/fakequote', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const resultImageUrl = response.data.url;

                const embed = new EmbedBuilder() 
                    .setColor('#f8b4cb')
                    .setImage(resultImageUrl);

                await loadingMessage.edit({ content: '', embeds: [embed] });
            } catch (error) {
                console.error(error);
                await loadingMessage.edit('There was an error processing the image.');
            }
        }
    });
};
