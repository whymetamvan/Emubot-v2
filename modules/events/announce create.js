module.exports = {
    name: 'guildCreate',
    async execute(guild) {
      const channelExists = guild.channels.cache.some(channel => channel.name === 'えむbot開発室' && channel.type === 0);
  
      if (!channelExists) {
        try {
            const channel = await guild.channels.create({
                "name": "えむbot開発室",
                "type": 0
            });
            console.log(`チャンネルを作ったよ: ${channel.name} (${channel.id})`);
            await channel.send('botのお知らせ用チャンネルです。消さないでくれると嬉しいです(?)');
        } catch (error) {
            // チャンネル作成権限がない場合の処理(調べたかんじ50013であってるはず..)
            if (error.code === 50013) {
                const owner = await guild.fetchOwner();

              // 鯖主にDMを送信
                try {
                    await owner.send(`**えむbotのチャンネル作成権限がありません**\nチャンネルを作成するためには、えむbotにチャンネル作成権限を付与してください。`);
                    console.log(`DMを送信したよ: ${owner.user.tag}`);
                } catch (error) {
                    console.error(`DMを送信できなかったよ: ${owner.user.tag}`, error);
                }
            } else {
                // その他のエラー
                console.error(`チャンネルを作れなかったよ: ${guild.name}:${guild.id}`, error);
            }
        }
    }
}
};
