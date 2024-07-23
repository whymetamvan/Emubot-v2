const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('ユーザーの検索')
        .addUserOption(option => option.setName('user').setDescription('ユーザーIDかメンションを入力してください').setRequired(true)),

    async execute(interaction) {
        try {
            await interaction.deferReply();
            const user = interaction.options.getUser('user');
            const member = user ? await interaction.guild.members.fetch(user.id).catch(() => null) : null;
            const avatarURL = member?.displayAvatarURL({ size: 1024 }) || user.displayAvatarURL({ size: 1024 });

            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTitle('ユーザー情報')
                .setThumbnail(avatarURL)
                .setFooter({ text: 'Emubot | userinfo', iconURL: interaction.client.user.displayAvatarURL() })
                .addFields(
                    { name: 'ユーザー名', value: user.tag },
                    { name: 'ユーザーID', value: `\`\`\`\n${user.id}\n\`\`\`` },
                    { name: 'アカウント作成日', value: user.createdAt ? user.createdAt.toLocaleString('ja-JP') : '不明', inline: true },
                    { name: 'プロフィール', value: `<@${user.id}>`, inline: true },
                    { name: 'サーバー参加日', value: member ? member.joinedAt ? member.joinedAt.toLocaleString('ja-JP') : '不明' : '未参加' },
                    { name: 'AccountType', value: user.bot ? 'BOT 🤖' : 'USER <:user:1254362184272707676>', inline: true }
                );

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply('エラーが発生しました。コマンドを実行できませんでした。');
        }
    },
};
