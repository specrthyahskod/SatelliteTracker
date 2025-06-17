const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('eclipseinfo')
    .setDescription('Get upcoming eclipse information'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await axios.get('https://eclipse.gsfc.nasa.gov/skycal/SKYCAL.txt?TYPE=All');
      const lines = res.data.split('\n')
        .filter(line => line.trim().length > 10 && /\d{4}/.test(line))
        .slice(0, 5);

      await interaction.editReply('🌑 **Upcoming Eclipses:**\n' + lines.join('\n'));
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Failed to fetch eclipse data.');
    }
  }
};
