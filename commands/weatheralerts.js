// commands/weatheralerts.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weatheralerts')
    .setDescription('Get current severe weather alerts for coords')
    .addNumberOption(o => o.setName('latitude').setDescription('Latitude').setRequired(true))
    .addNumberOption(o => o.setName('longitude').setDescription('Longitude').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const lat = interaction.options.getNumber('latitude');
    const lon = interaction.options.getNumber('longitude');
    try {
      const res = await axios.get(`https://api.weatherbit.io/v2.0/alerts?lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_KEY}`);
      const alerts = res.data.alerts;
      if (!alerts || alerts.length === 0) {
        return interaction.editReply('✅ No active weather alerts for this location.');
      }

      const out = alerts.map(a =>
        `⚠️ **${a.event}** — ${a.description.substring(0, 100)}...`
      ).join('\n\n');

      await interaction.editReply(`**Severe Weather Alerts:**\n\n${out}`);
    } catch (err) {
      console.error('Weather Alerts error:', err);
      await interaction.editReply('❌ Failed to fetch alert data.');
    }
  }
};
