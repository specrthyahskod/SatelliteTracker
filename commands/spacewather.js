const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spaceweather')
    .setDescription('Get current KP index for geomagnetic activity'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
      const latest = res.data.pop();
      await interaction.editReply(`🌌 **KP Index**: ${latest.kp} — measured at ${new Date(latest.time_tag).toLocaleString()}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch space weather data.');
    }
  }
};
