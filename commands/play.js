// commands/play.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play a song from Spotify, YouTube, Apple Music or Deezer')
    .addStringOption(opt =>
      opt.setName('query')
        .setDescription('Song name or link')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    await interaction.reply(`🔍 Searching for **${query}**...`);
    await musicPlayer.play(interaction, query);
  }
};
