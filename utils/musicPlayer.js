const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytSearch = require('yt-search');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const { Readable } = require('stream');

module.exports.play = async (interaction) => {
  const query = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  const result = await ytSearch(query);
  const video = result.videos[0];
  if (!video) return interaction.followUp({ content: '❌ No video found.', ephemeral: true });

  const url = video.url;

  // Get best audio stream URL
  const streamInfo = await youtubedl(url, {
    dumpSingleJson: true,
    noWarnings: true,
    noCallHome: true,
    noCheckCertificate: true,
    preferFreeFormats: true,
    youtubeSkipDashManifest: true,
  });

  const audioUrl = streamInfo.url;

  const ffmpegStream = ffmpeg(audioUrl)
    .format('s16le')
    .audioFrequency(48000)
    .audioChannels(2)
    .audioCodec('pcm_s16le')
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

  await interaction.followUp({
    content: `🎶 Now playing: **${video.title}**`,
  });
};
