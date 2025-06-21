const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exoplanets')
    .setDescription('🪐 Explore exoplanets on a 3D interactive map'),

  async execute(interaction) {
    const exoplanetMapURL = 'https://yourdomain.com/exoplanets'; // Replace with actual hosting URL

    await interaction.reply({
      content: `🛰️ Click to explore exoplanets in 3D:\n🔗 ${exoplanetMapURL}`,
      ephemeral: false
    });
  }
};
