const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('チケットを作成します'),

  async execute(interaction) {
    try {
      await interaction.deferReply();
      const create = new ButtonBuilder()
        .setCustomId('create')
        .setStyle(ButtonStyle.Primary)
        .setLabel('チケットを作成する');

      const embed1 = new EmbedBuilder()
        .setColor('#f8b4cb')
        .setTimestamp()
        .setFooter({ text:'Emubot | ticket', iconURL: interaction.client.user.displayAvatarURL() })
        .setDescription('チケットを作成するには下のボタンを押してください');

      await interaction.editReply({
        embeds: [embed1],
        components: [new ActionRowBuilder().addComponents(create)],
      });
    } catch (error) {
      console.error('ticket error', error);
      await interaction.editReply('エラーが発生しました。もう一度お試しください。');
    }
  },
};
