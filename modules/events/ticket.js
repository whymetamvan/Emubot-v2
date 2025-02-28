const { Events, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isButton()) return;

    try {
      const mid = interaction.user.id;
      const guild = interaction.guild;
      const member = interaction.member;

      if (interaction.customId === 'create') {
        if (!member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
          return await interaction.reply({
            content: 'チケットを作成する権限がありません。',
            ephemeral: true,
          });
        }

        const existingChannel = guild.channels.cache.find(tic => tic.name === `チケット-${mid}`);
        if (existingChannel) {
          return await interaction.reply({
            content: `既に作成済です\nhttps://discord.com/channels/${guild.id}/${existingChannel.id}`,
            ephemeral: true,
          });
        }

        const channel = await guild.channels.create({
          name: `チケット-${mid}`,
          reason: `Created By : ${interaction.user.username}`,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.AttachFiles,
                PermissionsBitField.Flags.ReadMessageHistory
              ],
            },
            {
              id: interaction.client.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.EmbedLinks
              ],
            },
          ],
        });

        await interaction.reply({
          content: `作成しました\nhttps://discord.com/channels/${guild.id}/${channel.id}`,
          ephemeral: true,
        });

        const embed = new EmbedBuilder()
          .setColor('BLUE')
          .setDescription('チケットを作成しました。削除する場合は下のボタンを押してください');

        const del = new ButtonBuilder()
          .setCustomId('delete')
          .setStyle(ButtonStyle.Danger)
          .setLabel('削除');

        await channel.send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(del)],
        });
      } else if (interaction.customId === 'delete') {
        const channel = interaction.channel;
        const channelCreatorId = channel.name.split('-')[1]; 
        
        if (mid !== channelCreatorId && !member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
          return await interaction.reply({
            content: 'チケットを削除する権限がありません。',
            ephemeral: true,
          });
        }

        await channel.delete();
      }
    } catch (error) {
      console.error('ticketButton error', error);
      await interaction.reply({ content: 'エラーが発生しました。もう一度お試しください。', ephemeral: true });
    }
  },
};
