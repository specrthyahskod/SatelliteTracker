// commands/queue.js
const { SlashCommandBuilder } = require('discord.js');
const musicPlayer = require('../utils/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('📜 View current song queue'),
  async execute(interaction) {
    const queue = await musicPlayer.getQueue(interaction);
    await interaction.reply({ content: queue, ephemeral: true });
  }
};
