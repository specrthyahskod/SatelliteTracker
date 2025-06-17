// commands/rocketlaunchalerts.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rocketlaunchalerts')
    .setDescription('🚀 Fetch upcoming space launches for the next 24 hours'),
  
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const now = new Date().toISOString();
      const tomorrow = new Date(Date.now() + 86400000).toISOString();

      const { data } = await axios.get(
        `https://ll.thespacedevs.com/2.2.0/launch/upcoming/?window_start__gte=${now}&window_start__lte=${tomorrow}`
      );

      if (!data.results.length) {
        return interaction.editReply('🛰 No launches scheduled in the next 24 hours.');
      }

      const msg = data.results.map(l =>
        `🚀 **${l.name}**\n• 🕒 ${new Date(l.window_start).toUTCString()}\n• 📍 ${l.pad?.location?.name || 'Unknown Location'}`
      ).join('\n\n');

      return interaction.editReply(`📣 **Upcoming Launches (Next 24h)**:\n\n${msg}`);
    } catch (e) {
      console.error('[🚀 Launch Alert Error]', e);
      return interaction.editReply('❌ Failed to fetch launch data. Please try again later.');
    }
  }
};
