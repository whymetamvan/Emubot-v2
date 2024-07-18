const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverlist')
        .setDescription('参加サーバー一覧'),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true});

            const guilds = interaction.client.guilds.cache.map(guild => guild.name);
            const guildCount = guilds.length;

            const half = Math.ceil(guilds.length / 2);
            const guildsFirstHalf = guilds.slice(0, half);
            const guildsSecondHalf = guilds.slice(half);

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTimestamp()
                .setFooter({ text: 'Emubot | serverlist', iconURL: interaction.client.user.displayAvatarURL() })
                .setTitle(`サーバー一覧（現在: ${guildCount}）`)
                .addFields(
                    { name: 'list1', value: guildsFirstHalf.join('\n'), inline: true },
                    { name: 'list2', value: guildsSecondHalf.join('\n'), inline: true }
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    },
};
