// commands/moonphase.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('moonphase')
    .setDescription('Get current moon phase, illumination, and age'),

  async execute(interaction) {
    await interaction.deferReply();
    try {
      const now = Math.floor(Date.now() / 1000);
      const res = await axios.get(`https://api.farmsense.net/v1/moonphases/?d=${now}`);
      const data = res.data[0];
      await interaction.editReply(
        `🌙 **Moon Phase:** ${data.Phase}
        \n💡 Illumination: ${(data.Illumination * 100).toFixed(1)}%
        \n📆 Age: ${data.Age.toFixed(1)} days`
      );
    } catch (err) {
      console.error('Moonphase API error:', err);
      await interaction.editReply('❌ Failed to fetch moon data.');
    }
  }
};
