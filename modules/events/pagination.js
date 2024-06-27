const { ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

async function buttonPages(interaction, pages) {
    try {
        if (!interaction) throw new Error("interactionが提供されていません");
        if (!pages) throw new Error("ページの引数の未記入エラー");
        if (!Array.isArray(pages)) throw new Error("ページが配列でないエラー");

        await interaction.deferReply();

        if (pages.length === 1) {
            const page = await interaction.editReply({
                embeds: pages,
                components: [],
                fetchReply: true,
            });
            return page;
        }

        const prev = new ButtonBuilder()
            .setCustomId("prev")
            .setEmoji("◀")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true);

        const home = new ButtonBuilder()
            .setCustomId("home")
            .setLabel("最初に戻る")
            .setStyle(ButtonStyle.Danger)
            .setDisabled(true);

        const next = new ButtonBuilder()
            .setCustomId("next")
            .setEmoji("▶")
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder().addComponents(prev, home, next);
        let index = 0;

        const currentPage = await interaction.editReply({
            embeds: [pages[index]],
            components: [buttonRow],
            fetchReply: true,
        });

        const collector = currentPage.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60 * 1000,
        });

        collector.on("collect", async (i) => {
            try {
                if (i.user.id !== interaction.user.id) {
                    return i.reply({
                        content: "今は使えません",
                        ephemeral: true,
                    });
                }

                await i.deferUpdate();

                if (i.customId === "prev" && index > 0) {
                    index--;
                } else if (i.customId === "home") {
                    index = 0;
                } else if (i.customId === "next" && index < pages.length - 1) {
                    index++;
                }

                prev.setDisabled(index === 0);
                home.setDisabled(index === 0);
                next.setDisabled(index === pages.length - 1);

                await currentPage.edit({
                    embeds: [pages[index]],
                    components: [buttonRow],
                });

                collector.resetTimer();
            } catch (error) {
                console.error('Error while handling button interaction:', error);
                await i.followUp({ content: 'エラーが発生しました。もう一度お試しください。', ephemeral: true });
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason !== 'messageDelete') {
                const disabledRow = new ActionRowBuilder().addComponents(
                    prev.setDisabled(true),
                    home.setDisabled(true),
                    next.setDisabled(true),
                );
                try {
                    await currentPage.edit({
                        components: [disabledRow],
                    });
                } catch (error) {
                    console.error('Error while disabling buttons:', error);
                }
            }
        });

        return currentPage;
    } catch (error) {
        console.error('Error in buttonPages function:', error);
        await interaction.reply({ content: 'エラーが発生しました。もう一度お試しください。', ephemeral: true });
    }
}

module.exports = buttonPages;
