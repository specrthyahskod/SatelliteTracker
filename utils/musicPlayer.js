const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const SpotifyWebApi = require('spotify-web-api-node');
const ytdl = require('ytdl-core');

const player = createAudioPlayer();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});

// Auth on startup
(async () => {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body['access_token']);
  } catch (error) {
    console.error('Spotify auth error:', error);
  }
})();

async function play(interaction, query) {
  const channel = interaction.member.voice.channel;
  if (!channel) return interaction.reply({ content: 'Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  try {
    const data = await spotifyApi.searchTracks(query);
    const track = data.body.tracks.items[0];
    if (!track) return interaction.followUp({ content: 'No track found on Spotify.', ephemeral: true });

    const previewUrl = track.preview_url;

    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    connection.subscribe(player);

    if (previewUrl) {
      const resource = createAudioResource(previewUrl);
      player.play(resource);
      player.once(AudioPlayerStatus.Idle, () => connection.destroy());

      return interaction.followUp(`🎵 Now playing 30s preview: **${track.name}** by **${track.artists[0].name}**`);
    } else {
      return interaction.followUp('⚠️ This track has no preview. You need Spotify Premium to play full tracks.');
    }
  } catch (err) {
    console.error('Play error:', err);
    return interaction.followUp('❌ Something went wrong.');
  }
}

module.exports = { play };
