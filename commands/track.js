const { SlashCommandBuilder } = require('discord.js');
const { fetchSatellite } = require('../utils/satellite');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('satellite')
    .setDescription('Track a satellite above your location')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Name of the satellite (hubble, iss, starlink)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const satName = interaction.options.getString('name') || 'hubble';
    await interaction.deferReply();

    const data = await fetchSatellite(satName);
    if (!data) return interaction.editReply('Satellite not overhead currently.');

    const msg = `🛰️ **${data.name} is passing overhead**  
> 🛰️ Altitude: ${data.altitude} km  
> 🧭 Speed: ${data.speed} km/s  
> 🌍 Lat: ${data.latitude}°, Lon: ${data.longitude}°  
> _“${data.message}”_`;

    interaction.editReply(msg);
  }
};
