// commands/spacetime.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spacetime')
    .setDescription('🕒 Get the current time at the ISS and Moon reference time'),
  async execute(interaction) {
    const utc = new Date().toUTCString();
    const moonOffset = new Date(Date.now() + (1000 * 60 * 22.69)); // Simulate moon time offset
    const issTime = new Date().toISOString();

    await interaction.reply(
      `🌍 **Earth UTC:** ${utc}\n` +
      `🛰️ **ISS Time (approx):** ${issTime}\n` +
      `🌕 **Moon Ref Time:** ${moonOffset.toUTCString()}`
    );
  }
};
