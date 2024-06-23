const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bancount')
        .setDescription('BANされているユーザーのカウント'),

    async execute(interaction) {
        try {
　　　　　　// botの権限の確認(ViewAuditLogであっているのだろうか..ここは微妙)
            if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) {
                return interaction.reply({ content: '監査ログの閲覧権限がありません', ephemeral: true });
            }

   　　　　　 // BANされているユーザーを取得
            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUsersCount = bannedUsers.size;

  　　　　　  // embedを送信
            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('Banned Users')
                .setTimestamp()
                .setFooter({ text:'Emubot | bancount'})
                .setDescription(`このサーバーのBANユーザー数: ${bannedUsersCount}`);

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
        }
    },
};
