const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolecreate')
    .setDescription('新しいロールを作成します。')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('作成するロールの名前')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('color')
        .setDescription('作成するロールの色（カラーコードで指定）')
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'あなたにロールを管理する権限がありません。', ephemeral: true });
      }
      if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        return interaction.reply({ content: 'このサーバーでロールを管理する権限がありません。', ephemeral: true });
      }

      const name = interaction.options.getString('name');
      const color = interaction.options.getString('color');

      const roleCount = interaction.guild.roles.cache.size;

      if (roleCount >= 250) {
        return interaction.reply({ content: 'ロールの作成上限のため、実行できませんでした。', ephemeral: true });
      }

      let roleColor;
      if (color) {
        roleColor = color.toUpperCase();
      } else {
        roleColor = '#99AAB5';
      }

      const createdRole = await interaction.guild.roles.create({
        name: name,
        color: roleColor,
      });

      const embed = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTitle('作成完了!')
        .setTimestamp()
        .setFooter({ text:'Emubot | role create', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription(`作成したロール: <@&${createdRole.id}>`);

      await interaction.deferReply();
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('エラーが発生しました。ロールの作成に失敗しました。');
    }
  },
};