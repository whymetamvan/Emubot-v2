const { sendErrorEmbed } = require('./error');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`${interaction.commandName} がないよ`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error('Interaction error:', error);
            await sendErrorEmbed('Interaction Error', error); // エラーの詳細をログチャンネルに送信
            await interaction.reply({ content: 'コマンドの実行中にエラーが発生しました。', ephemeral: true });
        }
    },
};
