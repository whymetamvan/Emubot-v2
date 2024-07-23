const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bancount')
        .setDescription('BANされているユーザーのカウント'),

    async execute(interaction) {
        try {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                return interaction.reply({ content: 'BAN権限がないため、BANリストの閲覧ができませんでした', ephemeral: true });
            }

            await interaction.deferReply();
            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUsersCount = bannedUsers.size;

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('Banned Users')
                .setTimestamp()
                .setFooter({ text:'Emubot | bancount', iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`このサーバーのBANユーザー数: ${bannedUsersCount}`);

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('エラーが発生しました。');
        }
    },
};
