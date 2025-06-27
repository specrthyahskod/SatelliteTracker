const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  const { parseTrack } = await import('../utils/trackParser.mjs');
  const query = await parseTrack(input); // ✅ This line now works

  const yts = await import('yt-search');
  const res = await yts.default(query);
  const video = res.videos[0];
  if (!video) return interaction.followUp({ content: '❌ No video found.', ephemeral: true });

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

  await interaction.followUp({ content: `🎶 Now playing: **${video.title}**` });
};
