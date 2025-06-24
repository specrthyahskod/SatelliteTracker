// commands/cosmic_event.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cosmic_event')
    .setDescription('🌌 Track real-time cosmic events (GRBs, supernovae, etc.)'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://api.astronomyapi.com/api/v2/bodies/events'); // Replace with a real cosmic event feed
      const event = res.data.events?.[0];
      await interaction.editReply(
        event
          ? `🔭 **${event.name}**: ${event.description}`
          : '🚫 No cosmic events at the moment.'
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch cosmic events.');
    }
  }
};
