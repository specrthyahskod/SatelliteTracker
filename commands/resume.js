// commands/resume.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('▶️ Resume music playback'),
  async execute(interaction) {
    await musicPlayer.resume(interaction);
    await interaction.reply('▶️ Music resumed.');
  }
};
