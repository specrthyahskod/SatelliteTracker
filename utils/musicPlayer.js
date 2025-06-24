const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const queue = new Map();

module.exports = {
  play(interaction, url) {
    const guildId = interaction.guild.id;
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) return interaction.reply('❌ You must be in a voice channel.');

    const serverQueue = queue.get(guildId);
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Idle, () => {
      connection.destroy();
      queue.delete(guildId);
    });

    queue.set(guildId, { connection, player });
    interaction.reply(`🎶 Now playing: ${url}`);
  },

  stop(interaction) {
    const serverQueue = queue.get(interaction.guild.id);
    if (serverQueue) {
      serverQueue.player.stop();
      serverQueue.connection.destroy();
      queue.delete(interaction.guild.id);
      interaction.reply('⏹️ Playback stopped.');
    } else {
      interaction.reply('🚫 No active playback.');
    }
  },

  setVolume(interaction, volume) {
    const serverQueue = queue.get(interaction.guild.id);
    if (serverQueue) {
      serverQueue.player.state.resource.volume.setVolume(volume);
      interaction.reply(`🔊 Volume set to ${volume * 100}%`);
    } else {
      interaction.reply('🚫 No active playback.');
    }
  }
};
