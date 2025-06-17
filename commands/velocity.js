// commands/velocity.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const satelliteMap = {
  iss: 25544,
  hubble: 20580,
  noaa20: 43013,
  landsat9: 49260
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('velocity')
    .setDescription('Get real-time speed of a satellite')
    .addStringOption(opt =>
      opt.setName('satellite')
        .setDescription('Satellite name or NORAD ID (e.g., iss or 25544)')
        .setRequired(true)
    ),

  async execute(interaction) {
    const input = interaction.options.getString('satellite').toLowerCase();
    const id = isNaN(input) ? satelliteMap[input] : parseInt(input);

    if (!id || isNaN(id)) {
      return interaction.reply({
        content: '❌ Invalid satellite name or NORAD ID.',
        ephemeral: true
      });
    }

    const lat = parseFloat(process.env.LAT);
    const lon = parseFloat(process.env.LON);
    const alt = parseFloat(process.env.ALT || '271');
    const apiKey = process.env.N2YO_API_KEY;
    const url = `https://api.n2yo.com/rest/v1/satellite/positions/${id}/${lat}/${lon}/${alt}/1&apiKey=${apiKey}`;

    await interaction.deferReply();

    try {
      const res = await axios.get(url);
      const pos = res.data.positions?.[0];

      if (!pos) {
        return interaction.editReply(`❌ No position data available for satellite ID \`${id}\`.`);
      }

      const speed = pos.satvelocity.toFixed(2);
      const altitude = pos.sataltitude.toFixed(2);

      return interaction.editReply(
        `🛰️ **Satellite Velocity**\n` +
        `• 📡 NORAD ID: \`${id}\`\n` +
        `• 🚀 Speed: **${speed} km/s**\n` +
        `• 🪂 Altitude: **${altitude} km**`
      );
    } catch (err) {
      console.error('Velocity error:', err.message);
      return interaction.editReply('❌ Failed to fetch satellite velocity.');
    }
  }
};
