// メッセージの自動展開
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SETTINGS_FILE = path.join(__dirname, '..', '..', 'lib', 'data', 'msglink.json');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {

    if (message.author.bot) return; 

    // URLを検知
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.content.match(urlRegex);

    if (urls) {

      let settings = {};

      if (fs.existsSync(SETTINGS_FILE)) {
        try {
          const data = fs.readFileSync(SETTINGS_FILE, 'utf8');
          settings = JSON.parse(data);
        } catch (error) {
          console.error('設定ファイルの読み取りまたは解析中にエラーが発生しました:', error);
        }
      }

      // 設定されていないかtrueの場合のみ展開を行う
      const guildId = message.guild.id;
      const shouldExpandLinks = settings[guildId] !== undefined ? settings[guildId] : true;

      if (!shouldExpandLinks) return;

      for (const url of urls) {
        if (url.includes('discord.com/channels/')) {

          const urlParts = url.split('/');
          const guildId = urlParts[urlParts.indexOf('channels') + 1];
          const channelId = urlParts[urlParts.indexOf('channels') + 2];
          const messageId = urlParts[urlParts.indexOf('channels') + 3];

          try {
            const fetchedMessage = await client.guilds.cache.get(guildId)?.channels.cache.get(channelId)?.messages.fetch(messageId);

            // メッセージの内容の取得、embedの場合は展開しない
            if (fetchedMessage) {

              const messageContent = fetchedMessage.content;
              const hasEmbed = Boolean(fetchedMessage.embeds.length);
              const hasAttachment = Boolean(fetchedMessage.attachments.size);

              if (!messageContent && hasEmbed) {
                console.log('Embedのため、展開できませんでした');
                return;
              }

              // embedを送信
              const embed = new EmbedBuilder()
                .setColor(0xf8b4cb)
                .setTimestamp(fetchedMessage.createdTimestamp)
                .setAuthor({ name: fetchedMessage.author.tag, iconURL: fetchedMessage.author.displayAvatarURL() });

              // 画像、動画、ファイルなどの添付ファイルがある場合の処理
              if (hasAttachment) {
                const attachment = fetchedMessage.attachments.first();
                if (attachment.contentType.startsWith('image/')) {
                  embed.setImage(attachment.proxyURL);
                } else if (attachment.contentType.startsWith('video/')) {
                  embed.addFields({ name: 'Video', value: `[動画ファイル](${attachment.proxyURL})` });
                } else {
                  embed.addFields({ name: 'File', value: `[${attachment.name}](${attachment.proxyURL})` });
                }
              }

              if (messageContent) {
                embed.setDescription(messageContent);
              }

              message.channel.send({ embeds: [embed] });
            }
          } catch (error) {
            console.error('メッセージの取得中にエラーが発生しました:', error);
          }
        }
      }
    }
  }
};
