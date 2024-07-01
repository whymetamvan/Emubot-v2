const { SlashCommandBuilder,EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('1週間のメッセージが多い順にランキング'),
    async execute(interaction) {
       try{        
        await interaction.deferReply();
        // 1週間内のメッセージ数を取得
        const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const messages = await fetchMessages(interaction.guild, oneWeekAgo);
        const messageCounts = countMessages(messages);
        const topUsers = getTopUsers(messageCounts, 5);

        // embedの送信
        const embed = new EmbedBuilder()
            .setTitle('Top Active Users！')
            .setColor('#f8b4cb')
            .setTimestamp()
            .setFooter({ text:'Emubot | top'})
            .setDescription(
                topUsers.length > 0
                    ? topUsers.map((user, index) => `${index + 1}. <@${user.id}> - ${user.count} messages`).join('\n')
                    : 'い、いない...'
            );

        await interaction.editReply({ embeds: [embed] });
    } catch (error) {
        console.error('topコマンドエラー', error);
        await interaction.editReply('エラーが発生しました');
    }
    }
    };

async function fetchMessages(guild, afterTimestamp) {
    try {
      // テキストチャンネルからbot以外のメッセージを取得
        const messages = [];
        const channels = guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText);

        for (const channel of channels.values()) {
            let lastId;
            while (true) {
                try {
                    const options = { limit: 100 };
                    if (lastId) options.before = lastId;

                    const fetchedMessages = await channel.messages.fetch(options);
                    if (fetchedMessages.size === 0) break;

                    fetchedMessages.forEach(message => {
                        if (message.createdTimestamp >= afterTimestamp && !message.author.bot) {
                            messages.push(message);
                        }
                    });

                    lastId = fetchedMessages.last().id;
                } catch (error) {
                    console.error(`Error fetching messages from channel ${channel.id}:`, error);
                    break;
                }
            }
        }

        return messages;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Failed to fetch messages');
    }
}

function countMessages(messages) {
    try {
      // メッセージをユーザー事でカウント
        const counts = {};
        messages.forEach(message => {
            if (!counts[message.author.id]) {
                counts[message.author.id] = 0;
            }
            counts[message.author.id]++;
        });
        return counts;
    } catch (error) {
        console.error('Error counting messages:', error);
        throw new Error('Failed to count messages');
    }
}

function getTopUsers(counts, topN) {
    try {
      // 上位のユーザーの特定
        const sortedUsers = Object.entries(counts)
            .map(([id, count]) => ({ id, count }))
            .sort((a, b) => b.count - a.count);
        return sortedUsers.slice(0, topN);
    } catch (error) {
        console.error('Error getting top users:', error);
        throw new Error('Failed to get top users');
    }
}
