// commands/skip.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('⏭ Skip the current song'),
  async execute(interaction) {
    await musicPlayer.skip(interaction);
    await interaction.reply('⏭ Song skipped.');
  }
};
