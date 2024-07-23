const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

async function buttonPages(interaction, pages) {
    if (!interaction) throw new Error("interactionが提供されていません");
    if (!pages || !Array.isArray(pages)) throw new Error("ページの引数が無効です");

    await interaction.deferReply();

    if (pages.length === 1) {
        return await interaction.editReply({ embeds: pages, components: [], fetchReply: true });
    }

    let index = 0;
    const buttons = [
        new ButtonBuilder().setCustomId('prev').setEmoji('◀').setStyle(ButtonStyle.Primary).setDisabled(true),
        new ButtonBuilder().setCustomId('home').setLabel('最初に戻る').setStyle(ButtonStyle.Danger).setDisabled(true),
        new ButtonBuilder().setCustomId('next').setEmoji('▶').setStyle(ButtonStyle.Primary)
    ];

    const buttonRow = new ActionRowBuilder().addComponents(buttons);
    const currentPage = await interaction.editReply({ embeds: [pages[index]], components: [buttonRow], fetchReply: true });

    const collector = currentPage.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60 * 1000 });

    collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) return i.reply({ content: "今は使えません", ephemeral: true });
        await i.deferUpdate();

        if (i.customId === 'prev') index--;
        else if (i.customId === 'home') index = 0;
        else if (i.customId === 'next') index++;

        buttons[0].setDisabled(index === 0);
        buttons[1].setDisabled(index === 0);
        buttons[2].setDisabled(index === pages.length - 1);

        await currentPage.edit({ embeds: [pages[index]], components: [buttonRow] });
        collector.resetTimer();
    });

    collector.on('end', async (_, reason) => {
        if (reason !== 'messageDelete') {
            try {
                await currentPage.delete();
            } catch (error) {
                console.error('Error while deleting currentPage:', error);
            }
        }
    });

    return currentPage;
}

module.exports = buttonPages;
