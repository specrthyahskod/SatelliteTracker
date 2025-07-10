// commands/exoplanets.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exoplanets')
    .setDescription('🪐 Explore exoplanets on a 3D interactive map'),

  async execute(interaction) {
    await interaction.reply({
      content: `🛰️ Click to explore exoplanets in 3D:\n🔗 https://helpful-donut-12f09e.netlify.app/exoplanets`,
      ephemeral: false
    });
  }
};
