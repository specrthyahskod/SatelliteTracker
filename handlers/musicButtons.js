module.exports = async function handleMusicButtons(interaction) {
  const { customId, guild, member } = interaction;

  if (!member.voice.channel) {
    return interaction.reply({ content: '❌ You must be in a voice channel.', ephemeral: true });
  }

  switch (customId) {
    case 'music_play':
      return interaction.reply({ content: '▶️ Playing music...', ephemeral: true });

    case 'music_pause':
      return interaction.reply({ content: '⏸️ Music paused.', ephemeral: true });

    case 'music_skip':
      return interaction.reply({ content: '⏭️ Skipping to next track.', ephemeral: true });

    case 'music_stop':
      return interaction.reply({ content: '⏹️ Music stopped.', ephemeral: true });

    default:
      return interaction.reply({ content: '❌ Unknown music control.', ephemeral: true });
  }
};
