const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lunarcrater')
    .setDescription('🌕 Explore lunar craters on a 3D interactive map'),
  
  async execute(interaction) {
    const craterMapURL = 'https://helpful-donut-12f09e.netlify.app/lunar'; // Replace with actual hosting URL

    await interaction.reply({
      content: `🌑 Click to explore lunar craters in 3D:\n🔗 ${craterMapURL}`,
      ephemeral: false
    });
  }
};
