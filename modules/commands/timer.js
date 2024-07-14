const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timer')
    .setDescription('指定した時間後に通知するタイマーを起動します。')
    .addIntegerOption(option =>
      option.setName('分')
        .setDescription('分を指定してください。')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('秒')
        .setDescription('秒を指定してください。')
        .setRequired(false)),
  async execute(interaction) {
    try {
      const minutes = interaction.options.getInteger('分');
      const seconds = interaction.options.getInteger('秒') || 0;
      const totalSeconds = (minutes * 60) + seconds;

      await interaction.reply(`タイマーを ${minutes} 分 ${seconds} 秒で起動します。`);

      setTimeout(() => {
        const embed = new EmbedBuilder()
          .setColor('#f8b4cb')
          .setTitle('時間になりました')
          .setTimestamp()
          .setFooter({ text:'Emubot | timer', iconURL:'https://cdn.icon-icons.com/icons2/2854/PNG/512/timer_time_performance_icon_181569.png' })
          .setDescription(`${minutes}分${seconds}秒が経過しました！`);

        interaction.channel.send({ content: `${interaction.user}`, embeds: [embed] });
      }, totalSeconds * 1000);
    } catch (error) {
      console.error('タイマー実行中にエラーが発生しました:', error);
      await interaction.reply('タイマーを起動できませんでした。エラーが発生しました。');
    }
  },
};
