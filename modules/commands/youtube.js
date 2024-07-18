const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle,PermissionsBitField } = require('discord.js');
const { joinVoiceChannel, createAudioResource, StreamType,AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const player = require('../../lib/player'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-play')
        .setDescription('youtube動画をボイチャで再生')
        .addStringOption(option => 
            option.setName('url')
                .setDescription('再生したいURL')
                .setRequired(true)),
    async execute(interaction) {
        const url = interaction.options.getString('url');
        await interaction.deferReply();
        const channel = interaction.member.voice.channel;
        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Connect)) {
            return interaction.editReply({ content: 'ボイスチャンネルの接続権限がありません', ephemeral: true });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Speak)) {
            return interaction.editReply({ content: 'ボイスチャンネルの発言権限がありません', ephemeral: true });
        }

        if (!ytdl.validateURL(url)) {
            return interaction.editReply(`${url} は処理できません。`);
        }
        if (!channel) {
            return interaction.editReply({ content: 'ボイスチャンネルに接続してください', ephemeral: true });
        }

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        if (!connection) {
            throw new Error('ボイスチャンネルへの参加に失敗しました');
        }
        const stream = ytdl(url, {
            filter: format => format.audioCodec === 'opus' && format.container === 'webm',
            quality: 'highest',
            highWaterMark: 32 * 1024 * 1024,
        });

        const resource = createAudioResource(stream, {
            inputType: StreamType.WebmOpus
        });

        player.play(resource);
        connection.subscribe(player);

        const info = await ytdl.getInfo(url);
        const embed = new EmbedBuilder()
            .setTitle(info.videoDetails.title)
            .setURL(url)
            .setColor(0xf8b4cb)
            .setTimestamp()
            .setFooter({ text: 'Emubot | Youtube-play', iconURL:'https://www.alucare.fr/wp-content/uploads/2023/03/YouTube_social_white_squircle.svg_-400x400.png' })
            .setImage(info.videoDetails.thumbnails[0].url)
            .setDescription('この動画を再生中です <a:1195533336379138098:1253899546686263448>');

        const messageId = interaction.id;

        const playButton = new ButtonBuilder()
            .setCustomId(`youtube_play_${messageId}`)
            .setLabel('再生')
            .setStyle(ButtonStyle.Success);

        const pauseButton = new ButtonBuilder()
            .setCustomId(`youtube_pause_${messageId}`)
            .setLabel('一時停止')
            .setStyle(ButtonStyle.Danger);

        const loopButton = new ButtonBuilder()
            .setCustomId(`youtube_loop_${messageId}`)
            .setLabel('ループ')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(playButton, pauseButton, loopButton);

        await interaction.editReply({ embeds: [embed], components: [row] });
        player.on(AudioPlayerStatus.Idle, () => {
            if (!player.loop) {
                connection.destroy();
            }
        });
    }
};
