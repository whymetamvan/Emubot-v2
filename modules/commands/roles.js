const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
.setName('roles')
.setDescription('サーバー内のロール一覧を表示します。'),
async execute(interaction) {
  try {
    await interaction.deferReply({ ephemeral:true });

    if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.editReply({ content: 'ロールの閲覧権限がありません。'});
    }

    const roles = interaction.guild.roles.cache;
    const sortedRoles = roles.sort((a, b) => b.position - a.position);
    const roleList = sortedRoles.map(r => `${r}`).join("\n");

    const embed = new EmbedBuilder()
    .setTitle('サーバーのロール一覧')
    .setTimestamp()
    .setFooter({ text:'Emubot | roles', iconURL: interaction.client.user.displayAvatarURL() })
    .setDescription(`>>> ${roleList}`)
    .setColor('#f8b4cb');

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('エラーが発生しました:', error);
    await interaction.editReply({ content: 'コマンドの実行中にエラーが発生しました。'});
  }
},
};