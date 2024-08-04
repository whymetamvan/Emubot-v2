const { SlashCommandBuilder } = require('discord.js');

const OWNER_ID = '1095869643106828289';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('ステータス設定')
    .addStringOption(option =>
      option.setName('state')
        .setDescription('ステータス設定')
        .setRequired(true)
        .addChoices(
          { name: 'Online', value: 'online' },
          { name: 'Idle', value: 'idle' },
          { name: 'Do Not Disturb', value: 'dnd' }
        )),

  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply('権限がありません');
    }

    const status = interaction.options.getString('state');
    interaction.client.user.setStatus(status);
    await interaction.reply(`${status.charAt(0).toUpperCase() + status.slice(1)}に設定しました`);
  },
};
