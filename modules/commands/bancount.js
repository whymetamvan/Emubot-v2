const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bancount')
        .setDescription('BANされているユーザーのカウント'),

    async execute(interaction) {
        try {
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                return interaction.reply({ content: '監査ログの閲覧権限がありません', ephemeral: true });
            }

            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUsersCount = bannedUsers.size;

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('Banned Users')
                .setTimestamp()
                .setFooter({ text:'Emubot | bancount', iconURL: interaction.client.user.displayAvatarURL() })
                .setDescription(`このサーバーのBANユーザー数: ${bannedUsersCount}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    },
};