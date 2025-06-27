const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports.play = async (interaction) => {
  const linkOrQuery = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel)
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  const { parseTrack } = await import('./trackParser.mjs');
  const query = await parseTrack(linkOrQuery);

  const ytResult = await ytSearch(query);
  const video = ytResult.videos.length ? ytResult.videos[0] : null;

  if (!video)
    return interaction.followUp({ content: '❌ No matching video found.', ephemeral: true });

  const stream = ytdl(video.url, { filter: 'audioonly' });
  const resource = createAudioResource(stream);
  const player = createAudioPlayer();

  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  connection.subscribe(player);
  player.play(resource);

  player.on(AudioPlayerStatus.Idle, () => connection.destroy());

  await interaction.followUp({
    embeds: [{
      title: '🎶 Now Playing',
      description: `**[${video.title}](${video.url})**`,
      color: 0x1DB954,
      footer: { text: `Requested by ${interaction.user.tag}` },
      thumbnail: { url: video.thumbnail }
    }]
  });
};
