const { SlashCommandBuilder } = require('discord.js');
const { getSatelliteData } = require('../utils/satellite');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('satellitelocation')
    .setDescription('Get current satellite passing overhead'),

  async execute(interaction) {
    await interaction.deferReply();
    const result = await getSatelliteData();

    if (!result) return interaction.editReply('No satellites overhead now.');
    
    interaction.editReply(`🛰️ **${result.name} is passing overhead**  
> 🌍 Altitude: ${result.altitude} km  
> 🚀 Speed: ${result.speed} km/s  
> 📡 Lat: ${result.latitude}° | Lon: ${result.longitude}°  
> _“${result.message}”_`);
  }
};
