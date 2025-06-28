const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const yts = require('yt-search');
const ytdl = require('ytdl-core');
const { default: parseTrack } = await import('./trackParser.mjs');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const query = await parseTrack(input);
    const result = await yts(query);
    const video = result.videos[0];

    if (!video) {
      return interaction.followUp({ content: '❌ No matching video found on YouTube.', ephemeral: true });
    }

    // Block VEVO and long videos (optional)
    if (
      video.author.name.toLowerCase().includes('vevo') ||
      video.duration.seconds > 600
    ) {
      return interaction.followUp({
        content: '⚠️ This video is restricted or too long to play. Try another one.',
        ephemeral: true
      });
    }

    // Fetch stream
    let stream;
    try {
      stream = ytdl(video.url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
      });
    } catch (err) {
      console.error('❌ ytdl-core error:', err);
      return interaction.followUp({ content: '❌ Could not fetch stream. Try another track.', ephemeral: true });
    }

    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(resource);

    player.once(AudioPlayerStatus.Idle, () => {
      connection.destroy();
    });

    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${video.title}](${video.url})`)
      .setThumbnail(video.thumbnail)
      .setColor('Blurple')
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.followUp({ embeds: [embed] });
  } catch (err) {
    console.error('❌ Play command failed:', err);
    await interaction.followUp({ content: '❌ Could not play the song.', ephemeral: true });
  }
};
