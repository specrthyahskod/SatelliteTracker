const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Please join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const { parseTrack } = await import('../utils/trackParser.mjs');
    const query = await parseTrack(input);

    const yts = await import('yt-search');
    const res = await yts.default(query);
    const video = res.videos[0];

    if (!video) {
      return interaction.followUp({ content: '❌ No matching video found on YouTube.', ephemeral: true });
    }

    const info = await ytdl.getInfo(video.url);
    const stream = ytdl.downloadFromInfo(info, {
      filter: 'audioonly',
      quality: 'highestaudio',
      highWaterMark: 1 << 25,
    });

    const resource = createAudioResource(stream);
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

    player.on('error', (error) => {
      console.error('🔴 Audio Player Error:', error);
      connection.destroy();
    });

    await interaction.followUp({
      content: `🎶 Now playing: **${video.title}**\n🔗 ${video.url}`
    });

  } catch (err) {
    console.error('❌ Play command failed:', err);
    await interaction.followUp({ content: '❌ An error occurred while trying to play the track.', ephemeral: true });
  }
};
