// commands/aurora.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aurora')
    .setDescription('Check current aurora activity (Kp index)'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
      const latest = res.data[res.data.length - 1];
      const kp = latest.kp_index;

      let status = '🔍 Moderate';
      if (kp >= 7) status = '🌌 Strong — High chance of aurora at lower latitudes!';
      else if (kp >= 5) status = '✨ Visible in northern regions';
      else if (kp <= 2) status = '😴 Low activity';

      await interaction.editReply(`🌠 **Aurora Status**
> 📊 Kp-Index: ${kp}
> ⚡ Status: ${status}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch aurora data.');
    }
  }
};
