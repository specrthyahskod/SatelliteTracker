// commands/snowfall.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('snowfall')
    .setDescription('Check current snowfall (if any) at a location')
    .addNumberOption(opt =>
      opt.setName('latitude').setDescription('Latitude').setRequired(true))
    .addNumberOption(opt =>
      opt.setName('longitude').setDescription('Longitude').setRequired(true)),

  async execute(interaction) {
    const lat = interaction.options.getNumber('latitude');
    const lon = interaction.options.getNumber('longitude');
    const apiKey = process.env.WEATHER_API_KEY;

    await interaction.deferReply();

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );

      const snow = res.data.snow?.['1h'] || res.data.snow?.['3h'] || 0;
      const condition = res.data.weather?.[0]?.description || 'Unknown';

      if (snow === 0) {
        return interaction.editReply(`❄️ No snowfall is currently recorded at (${lat}, ${lon}).\n🌥️ Condition: ${condition}`);
      }

      return interaction.editReply(
        `❄️ Snowfall detected at (${lat}, ${lon}):\n> 🌨️ **${snow} mm** in the past hour\n> ☁️ Weather: ${condition}`
      );
    } catch (err) {
      console.error(err);
      return interaction.editReply('❌ Failed to fetch snowfall data.');
    }
  }
};
