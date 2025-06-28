const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');

const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const fetchStream = require('../utils/fetchStream');
const { default: parseTrack } = await import('../utils/trackParser.mjs');
const { default: yts } = await import('yt-search');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });

  await interaction.deferReply();

  try {
    const query = await parseTrack(input);
    const res = await yts(query);
    const video = res.videos[0];
    if (!video) return interaction.followUp({ content: '❌ No video found.', ephemeral: true });

    const stream = await fetchStream(video.url);
    const resource = createAudioResource(Readable.from(stream), {
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

    player.on(AudioPlayerStatus.Idle, () => connection.destroy());

    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${video.title}](${video.url})`)
      .setColor('#1DB954')
      .setThumbnail(video.thumbnail)
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.followUp({ embeds: [embed] });

  } catch (err) {
    console.error('❌ Play command failed:', err);
    await interaction.followUp({ content: '❌ Could not play the song.', ephemeral: true });
  }
};
