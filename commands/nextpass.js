const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const { userLocations } = require('./setlocation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nextpass')
    .setDescription('Get the next ISS pass for your location'),

  async execute(interaction) {
    await interaction.deferReply();

    const userId = interaction.user.id;
    const coords = userLocations.get(userId);

    if (!coords) {
      return interaction.editReply('❌ You haven’t set your location. Use `/setlocation` first.');
    }

    const apiKey = process.env.N2YO_API_KEY;
    const { lat, lon } = coords;

    const url = `https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/${lat}/${lon}/0/1/10&apiKey=${apiKey}`;

    try {
      const res = await axios.get(url);
      const pass = res.data.passes[0];
      if (!pass) return interaction.editReply('🛰️ No upcoming ISS passes found for your location.');

      const riseTime = new Date(pass.startUTC * 1000).toLocaleString();
      const setTime = new Date(pass.endUTC * 1000).toLocaleString();
      const duration = pass.endUTC - pass.startUTC;

      return interaction.editReply(`🛰️ **Next ISS Pass**
> 📍 Location: ${lat}°, ${lon}°
> ⬆️ Rise Time: ${riseTime}
> ⬇️ Set Time: ${setTime}
> ⏱️ Duration: ${duration} seconds`);
    } catch (e) {
      console.error('Error fetching ISS pass:', e);
      return interaction.editReply('❌ Failed to fetch the next pass.');
    }
  }
};
