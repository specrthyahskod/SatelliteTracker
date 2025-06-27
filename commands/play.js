const { SlashCommandBuilder } = require('discord.js');
const { play } = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song from Spotify (preview only)')
    .addStringOption(opt => opt.setName('query').setDescription('Song name').setRequired(true)),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    await play(interaction, query);
  }
};
