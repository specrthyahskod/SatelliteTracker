const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('isslocation')
    .setDescription('Get current location of ISS overhead'),

  async execute(interaction) {
    await interaction.deferReply();

    const lat = parseFloat(process.env.LAT);
    const lon = parseFloat(process.env.LON);
    const alt = parseFloat(process.env.ALT || '271');
    const apiKey = process.env.N2YO_API_KEY;

    const url = `https://api.n2yo.com/rest/v1/satellite/positions/25544/${lat}/${lon}/${alt}/1&apiKey=${apiKey}`;

    try {
      const res = await axios.get(url);
      const pos = res.data.positions?.[0];
      if (!pos) return interaction.editReply('🚫 No satellite data found.');

      return interaction.editReply(`🛰️ **ISS is passing overhead**
> 🌍 Altitude: ${pos.sataltitude.toFixed(2)} km  
> 🚀 Speed: ${pos.satvelocity.toFixed(2)} km/s  
> 📡 Lat: ${pos.satlatitude.toFixed(2)}° | Lon: ${pos.satlongitude.toFixed(2)}°`);
    } catch (e) {
      console.error('Error fetching satellite data:', e);
      return interaction.editReply('❌ Could not retrieve satellite data.');
    }
  }
};
