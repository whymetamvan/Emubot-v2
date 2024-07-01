const { Events, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

async function buttonPages(interaction, role, embed) {
    const button = new ButtonBuilder()
        .setCustomId(`verify_${role.id}`)
        .setLabel('ロールを付与')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
}

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (!interaction.customId.startsWith('verify_')) return;

        const roleId = interaction.customId.split('_')[1];
        const role = interaction.guild.roles.cache.get(roleId);

        if (!role) {
            return interaction.reply({ content: 'ロールが見つかりません。', ephemeral: true });
        }

        try {
            if (interaction.member.roles.cache.has(roleId)) {
                await interaction.member.roles.remove(role);
                await interaction.reply({ content: `ロール ${role.name} を外しました。`, ephemeral: true });
            } else {
                await interaction.member.roles.add(role);
                await interaction.reply({ content: `ロール ${role.name} を付与しました。`, ephemeral: true });
            }
        } catch (error) {
            console.error('Error while handling button interaction:', error);
            await interaction.reply({ content: 'エラーが発生しました。もう一度お試しください。', ephemeral: true });
        }
    },
};

module.exports.buttonPages = buttonPages;
