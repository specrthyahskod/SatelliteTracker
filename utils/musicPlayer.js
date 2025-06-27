const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');
const path = require('path');

module.exports.play = async (interaction) => {
  const query = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const result = await ytSearch(query);
    const video = result.videos[0];
    if (!video) {
      return interaction.editReply({ content: '❌ No video found for your query.', ephemeral: true });
    }

    const videoUrl = video.url;

    const streamInfo = await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      cookies: path.join(__dirname, '../youtube.com_cookies.txt'),
    });

    const bestFormat = streamInfo.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none');
    if (!bestFormat) {
      return interaction.editReply({ content: '❌ No valid audio format found.' });
    }

    const ffmpegStream = ffmpeg(bestFormat.url)
      .format('s16le')
      .audioFrequency(48000)
      .audioChannels(2)
      .audioCodec('pcm_s16le')
      .on('error', err => {
        console.error('❌ FFmpeg error:', err);
        interaction.followUp({ content: '❌ FFmpeg failed to process the stream.' });
      })
      .pipe();

    const resource = createAudioResource(Readable.from(ffmpegStream), {
      inputType: 'arbitrary',
    });

    const player = createAudioPlayer();
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(resource);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    await entersState(connection, VoiceConnectionStatus.Ready, 30_000);

    await interaction.editReply({
      content: `🎶 Now playing: **${video.title}**`,
    });

  } catch (err) {
    console.error('❌ Play command error:', err);
    await interaction.editReply({ content: '❌ Failed to play the track. YouTube might be blocking access or cookies are invalid.' });
  }
};
