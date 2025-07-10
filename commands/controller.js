const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('controller')
    .setDescription('🎵 Show music controller with play/pause/skip/stop buttons'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎵 Music Controller')
      .setDescription('Use the buttons below to control the music playback.')
      .setColor('Random');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('music_play')
        .setLabel('▶️ Play')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('music_pause')
        .setLabel('⏸️ Pause')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('music_skip')
        .setLabel('⏭️ Skip')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('music_stop')
        .setLabel('⏹️ Stop')
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
