// commands/stop.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('🛑 Stop music and clear queue'),
  async execute(interaction) {
    await musicPlayer.stop(interaction);
    await interaction.reply('🛑 Music stopped and queue cleared.');
  }
};
