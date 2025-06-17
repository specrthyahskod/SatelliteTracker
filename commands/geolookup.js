// commands/geo_lookup.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('geo_lookup')
    .setDescription('🌐 Get location name from coordinates')
    .addNumberOption(option =>
      option.setName('latitude')
        .setDescription('Latitude (e.g., 22.5726)')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('longitude')
        .setDescription('Longitude (e.g., 88.3639)')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });

    const lat = interaction.options.getNumber('latitude');
    const lon = interaction.options.getNumber('longitude');
    const apiKey = process.env.OPENCAGE_KEY;

    if (!apiKey) {
      return interaction.editReply('❌ OpenCage API key is missing in `.env`.');
    }

    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}&language=en&pretty=1&no_annotations=1`;

    try {
      const res = await axios.get(url);

      if (!res.data.results.length) {
        return interaction.editReply('❌ No matching location found for these coordinates.');
      }

      const result = res.data.results[0];
      const components = result.components;
      const formatted = result.formatted;

      await interaction.editReply({
        content: `📍 **Location Details:**\n**Name**: ${formatted}\n**Country**: ${components.country || 'N/A'}\n**Region**: ${components.state || components.region || 'N/A'}`
      });

    } catch (err) {
      console.error('[Geo Lookup Error]:', err);
      await interaction.editReply('❌ Error retrieving location. Please try again.');
    }
  }
};
