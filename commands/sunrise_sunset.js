// commands/sunrise_sunset.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sunrise_sunset')
    .setDescription('🌅 Get sunrise and sunset times for a location')
    .addNumberOption(option =>
      option.setName('latitude').setDescription('Latitude').setRequired(true))
    .addNumberOption(option =>
      option.setName('longitude').setDescription('Longitude').setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    const lat = interaction.options.getNumber('latitude');
    const lon = interaction.options.getNumber('longitude');

    const url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0`;

    try {
      const res = await axios.get(url);
      const data = res.data.results;

      const sunrise = new Date(data.sunrise).toLocaleTimeString();
      const sunset = new Date(data.sunset).toLocaleTimeString();

      await interaction.editReply(`🌅 **Sunrise & Sunset**
> 🌄 Sunrise: ${sunrise}
> 🌇 Sunset: ${sunset}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not retrieve sunrise/sunset data.');
    }
  }
};
