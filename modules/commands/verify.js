const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { buttonPages } = require('../events/verifybutton');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('指定したロールを付与します')
        .addRoleOption(option => option.setName('role').setDescription('付与するロール').setRequired(true)),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'あなたは実行できません。', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            return interaction.reply({ content: 'ロールの管理権限がありません。', ephemeral: true });
        }

        if (interaction.guild.members.me.roles.highest.comparePositionTo(role) <= 0) {
            return interaction.reply({ content: 'botロールより上のロールは付与できません。', ephemeral: true });
        }
        
        const roles = role.toString(); 
        const embed = new EmbedBuilder()
            .setTitle('ロールを付与する')
            .setTimestamp()
            .setFooter({ text:'Emubot | verify', iconURL:'https://thumb.ac-illust.com/d3/d3d0ea283aff27e1fc47c9ba6f5508fc_t.jpeg' })
            .setDescription(`ボタンを押して ${roles} を取得します。`)
            .setColor(role.color);

        await buttonPages(interaction, role, embed);
    },
};
