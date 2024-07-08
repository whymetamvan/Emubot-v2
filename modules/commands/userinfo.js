const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('ユーザーの検索')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('ユーザーIDかメンションを入力してください')
                .setRequired(true)),
    async execute(interaction) {
        try {
            // ユーザーを取得、見つからなかったときの返答
            const user = interaction.options.getUser('user');

            if (!user) {
                return interaction.reply('ユーザーが見つかりませんでした。');
            }

            let member;
            try {
                member = await interaction.guild.members.fetch(user.id);
            } catch (error) {
                console.log('ユーザーはサーバーのメンバーではありません');
            }

            // アバターURLの取得
            const avatarURL = member ? member.displayAvatarURL({ size: 1024 }) : user.displayAvatarURL({ size: 1024 });

            // embedを送信
            const embed = new EmbedBuilder()
                .setColor('#f8b4cb')
                .setTimestamp()
                .setFooter({ text: 'Emubot | userinfo' })
                .setTitle('ユーザー情報')
                .setThumbnail(avatarURL)
                .addFields(
                    { name: 'ユーザー名', value: user.tag },
                    { name: 'ユーザーID', value: '```\n'+`${user.id}`+ '\n```' },
                    { name: 'アカウント作成日', value: user.createdAt ? `${user.createdAt.toLocaleString('ja-JP')}` : '不明', inline: true },
                    { name: 'プロフィール', value: `<@${user.id}>`, inline:true }
                );

            if (member) { // メンバーの場合
                embed.addFields(
                    { name: 'サーバー参加日', value: member.joinedAt ? `${member.joinedAt.toLocaleString('ja-JP')}` : '不明' }
                );
            } else { // メンバーではない場合
                embed.addFields(
                    { name: 'サーバー参加日', value: '未参加' }
                );
            }

            if (user.bot) { // botの場合
                embed.addFields(
                    { name: 'AccountType', value: 'BOT 🤖' }
                );
            } else { // botではない(ユーザー)の場合
                embed.addFields(
                    { name: 'AccountType', value: 'USER <:user:1254362184272707676>', inline: true }
                );
            }

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply('エラーが発生しました。コマンドを実行できませんでした。');
        }
    },
};
