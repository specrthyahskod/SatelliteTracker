const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Get current weather of any place by coordinates')
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

      const weather = res.data;
      const temp = weather.main.temp;
      const condition = weather.weather[0].description;
      const humidity = weather.main.humidity;
      const wind = weather.wind.speed;

      await interaction.editReply(
        `🌍 **Weather for (${lat}, ${lon})**\n` +
        `🌡️ Temp: ${temp}°C\n` +
        `🌬️ Wind: ${wind} m/s\n` +
        `💧 Humidity: ${humidity}%\n` +
        `☁️ Condition: ${condition}`
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Failed to fetch weather data.');
    }
  }
};
