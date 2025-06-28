const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const fetchStream = require('./fetchStream');

const yts = require('yt-search');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const { default: parseTrack } = await import('./trackParser.mjs'); // ✅ moved inside function
    const query = await parseTrack(input);
    const result = await yts(query);
    const video = result.videos[0];

    if (!video) {
      return interaction.followUp({ content: '❌ No video found.', ephemeral: true });
    }

    const stream = await fetchStream(video.url);
    const resource = createAudioResource(stream, { inputType: 'arbitrary' });
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

    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${video.title}](${video.url})`)
      .setColor('Green')
      .setThumbnail(video.thumbnail)
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.followUp({ embeds: [embed] });
  } catch (err) {
    console.error('❌ Play command failed:', err);
    await interaction.followUp({ content: '❌ Could not play the song.', ephemeral: true });
  }
};

