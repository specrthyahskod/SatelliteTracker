const { SlashCommandBuilder } = require('discord.js');
const { play } = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('🎵 Play a song')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Song name or YouTube URL')
        .setRequired(true)
    ),
  async execute(interaction) {
    await play(interaction);
  },
};
