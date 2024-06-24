const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('サーバー情報の表示'),
  async execute(interaction) {
    // それぞれ情報の取得
    const guild = interaction.guild;
    const serverIconUrl = guild.iconURL({ size: 1024 });
    const textChannelsCount = guild.channels.cache.filter(c => c.type === 0).size;
    const voiceChannelsCount = guild.channels.cache.filter(c => c.type === 2).size;
    const categoryChannelsCount = guild.channels.cache.filter(c => c.type === 4).size;

    // もしサーバーアイコンがない場合はlib/images/none.pngを使用
    const thumbnailPath = path.join(__dirname, '..', '..', 'lib', 'images', 'none.png');
    let thumbnailUrl;
    let file;

    if (!serverIconUrl) {
      thumbnailUrl = 'attachment://none.png';
      file = { attachment: fs.readFileSync(thumbnailPath), name: 'none.png' };
    } else {
      thumbnailUrl = serverIconUrl;
    }

    // embedを送信
    const embed = new EmbedBuilder()
      .setColor(0xf8b4cb)
      .setTimestamp()
      .setFooter({ text: "Emutest | serverinfo"})
      .setThumbnail(thumbnailUrl)
      .addFields(
        { name: "サーバー名", value: `${guild.name}` },
        { name: "サーバーID", value: '```\n'+`${guild.id}`+'\n```' },
        { name: "鯖主 👑", value: `<@${guild.ownerId}>` },
        { name: "チャンネル数", value: `text 💬: **${textChannelsCount}**\nvoice <:voice:1254364510072868875>: **${voiceChannelsCount}**\ncategory: **${categoryChannelsCount}**`, inline: true },
        { name: "メンバー数", value: `user <:user:1254362184272707676>:**${guild.memberCount}**\nbot 🤖: **${guild.members.cache.filter(m => m.user.bot).size}**\nロール:**${guild.roles.cache.size}**`, inline: true }
      );

    if (!serverIconUrl) {
      await interaction.reply({ embeds: [embed], files: [file] });
    } else {
      await interaction.reply({ embeds: [embed] });
    }
  }
};
