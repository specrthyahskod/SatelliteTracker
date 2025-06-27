const { SlashCommandBuilder } = require('discord.js');
const { play } = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play a song from query or music link')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or Spotify/Apple/Deezer link')
        .setRequired(true)
    ),
  async execute(interaction) {
    await play(interaction);
  }
};
