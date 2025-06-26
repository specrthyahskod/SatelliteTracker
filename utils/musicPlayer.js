const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

const queue = new Map();

module.exports.play = async (interaction) => {
  const query = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return await interaction.reply({ content: '❌ You need to be in a voice channel!', ephemeral: true });

  await interaction.deferReply(); // Prevents "AlreadyReplied" error

  // 🔍 Search YouTube for video
  const result = await ytSearch(query);
  const video = result.videos.length ? result.videos[0] : null;

  if (!video) return await interaction.followUp({ content: '❌ No video found for your query.', ephemeral: true });

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
    content: `🎶 Now playing: **${video.title}**`,
  });
};
