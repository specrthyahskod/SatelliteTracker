// commands/pause.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('⏸ Pause the music'),
  async execute(interaction) {
    await musicPlayer.pause(interaction);
    await interaction.reply('⏸ Music paused.');
  }
};
