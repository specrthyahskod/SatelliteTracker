const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    // ✅ Import here (inside async function)
    const { default: parseTrack } = await import('./trackParser.mjs');
    const query = await parseTrack(input);
    const result = await yts(query);
    const video = result.videos[0];

    if (!video) {
      return interaction.followUp({ content: '❌ No matching video found on YouTube.', ephemeral: true });
    }

    if (
      video.author.name.toLowerCase().includes('vevo') ||
      video.duration.seconds > 600
    ) {
      return interaction.followUp({
        content: '⚠️ This video is restricted or too long to play. Try another one.',
        ephemeral: true
      });
    }

    const stream = ytdl(video.url, {
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
