const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports.play = async (interaction) => {
  const input = interaction.options.getString('query');
  const voiceChannel = interaction.member.voice.channel;

  if (!voiceChannel) {
    return interaction.reply({ content: '❌ Join a voice channel first.', ephemeral: true });
  }

  await interaction.deferReply();

  try {
    const isValidUrl = input.startsWith('http://') || input.startsWith('https://');
    let videoUrl = input;
    let videoInfo = null;

    if (!isValidUrl || !ytdl.validateURL(input)) {
      // Search YouTube for the song
      const searchResult = await ytSearch(input);
      if (!searchResult.videos.length) {
        return interaction.followUp({ content: '❌ No video found.', ephemeral: true });
      }
      videoInfo = searchResult.videos[0];
      videoUrl = videoInfo.url;
    } else {
      const info = await ytdl.getInfo(input);
      videoInfo = {
        title: info.videoDetails.title,
        thumbnail: info.videoDetails.thumbnails[0].url,
        url: info.videoDetails.video_url
      };
    }

    const stream = ytdl(videoUrl, { filter: 'audioonly', highWaterMark: 1 << 25 });
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

    const embed = new EmbedBuilder()
      .setTitle('🎶 Now Playing')
      .setDescription(`[${videoInfo.title}](${videoInfo.url})`)
      .setColor('Blue')
      .setThumbnail(videoInfo.thumbnail)
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.followUp({ embeds: [embed] });

  } catch (err) {
    console.error('❌ Play command failed:', err);
    await interaction.followUp({ content: '❌ Could not play the song.', ephemeral: true });
  }
};
