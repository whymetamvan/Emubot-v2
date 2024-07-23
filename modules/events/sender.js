const { ChannelType, Events } = require('discord.js');

module.exports = {
  name: Events.MessageCreate,
  execute(message, client) {
    const targetChannelId = '1236430386427334848';
    if (message.channel.id === targetChannelId) {
      const targetMessage = message.content;

      const sendPromises = client.guilds.cache.map(guild => {
        const targetChannel = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.name === 'えむbot開発室');
        if (targetChannel) {
          return targetChannel.send(targetMessage).catch(error => {
            console.error("メッセージの転送中にエラーが発生しました:", error);
          });
        }
      }).filter(Boolean);

      Promise.all(sendPromises)
        .then(() => console.log("メッセージを同時に転送しました"))
        .catch(error => console.error("メッセージの転送中にエラーが発生しました:", error));
    }
  }
};
