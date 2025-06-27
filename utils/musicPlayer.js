const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { google } = require('googleapis');

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

async function searchYouTube(query) {
  const res = await youtube.search.list({
    q: query,
    part: 'snippet',
    maxResults: 1,
    type: 'video',
  });

  const video = res.data.items[0];
  return `https://www.youtube.com/watch?v=${video.id.videoId}`;
}

module.exports.play = async (interaction) => {
  const linkOrQuery = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  const getTrackTitle = require('./trackParser');
  const query = await getTrackTitle(linkOrQuery);

  const videoUrl = await searchYouTube(query);
  const stream = ytdl(videoUrl, { filter: 'audioonly' });

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

  await interaction.followUp({ content: `🎶 Now playing: **${query}**` });
};
