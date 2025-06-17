// commands/eclipseinfo.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eclipseinfo')
    .setDescription('Get the next few eclipse events (source: timeanddate.com)'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await axios.get('https://www.timeanddate.com/scripts/cse/events.php?query=eclipse&country=1&json=1');
      const results = res.data?.results;

      if (!results || results.length === 0) {
        return interaction.editReply('❌ No upcoming eclipses found.');
      }

      const formatted = results.slice(0, 5).map(e => `🌘 **${e.title}** – ${e.date}`).join('\n');

      await interaction.editReply(`🌑 **Upcoming Eclipses**:\n${formatted}`);
    } catch (err) {
      console.error('❌ Eclipse fetch error:', err.message);
      await interaction.editReply('❌ Failed to fetch eclipse data.');
    }
  }
};
