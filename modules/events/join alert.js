const { EmbedBuilder, Events, ChannelType } = require('discord.js');

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    const existingChannel = guild.channels.cache.find(channel => channel.name === 'えむbot開発室' && channel.type === ChannelType.GuildText);
    let channelCreationStatus = '既存のチャンネルが見つかりました';
    let embedColor = '#00FF7F';
    let ownerName = '';
    let ownerMention = '';

    if (!existingChannel) {
      try {
        const channel = await guild.channels.create({
          name: 'えむbot開発室',
          type: ChannelType.GuildText
        });
        console.log(`チャンネルを作成しました: ${channel.name} (${channel.id})`);
        await channel.send('botのお知らせ用チャンネルです。消さないでくれると嬉しいです(?)');
        channelCreationStatus = `チャンネルを作成しました: ${channel.name} (${channel.id})`;
      } catch (error) {
        embedColor = '#FF0000';
        if (error.code === 50013) {
          const owner = await guild.fetchOwner();
          ownerName = owner.user.tag;
          ownerMention = `<@${owner.user.id}>`;

          try {
            await owner.send('**えむbotのチャンネル作成権限がありません**\nチャンネルを作成するためには、えむbotにチャンネル作成権限を付与してください。');
            console.log(`DMを送信しました: ${owner.user.tag}`);
          } catch (dmError) {
            console.error(`DMを送信できませんでした: ${owner.user.tag}`, dmError);
          }
        } else {
          console.error(`チャンネルを作成できませんでした: ${guild.name}:${guild.id}`, error);
        }
        channelCreationStatus = 'チャンネルの作成に失敗しました';
      }
    }

    const targetChannelId = "1249610059491573780";
    try {
      const targetChannel = client.channels.cache.get(targetChannelId);
      if (targetChannel) {
        const owner = await guild.fetchOwner();
        ownerName = owner.user.tag;
        ownerMention = `<@${owner.user.id}>`;

        const embed = new EmbedBuilder()
          .setTitle('サーバーに参加しました')
          .setDescription(`${guild.name} に参加しました！`)
          .addFields(
            { name: 'チャンネル作成ステータス', value: channelCreationStatus },
            { name: 'サーバーオーナー', value: `${ownerName} (${ownerMention})` }
          )
          .setColor(embedColor)
          .setTimestamp();

        await targetChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("参加通知エラーです:", error);
    }
  }
};
