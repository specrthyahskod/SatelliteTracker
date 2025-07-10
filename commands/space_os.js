// commands/space_os.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('space_os')
    .setDescription('🧠 Open StellarLink’s interactive OS panel'),
  async execute(interaction) {
    await interaction.reply('🖥️ Access the StellarLink OS: https://yourdomain.com/space-os');
  }
};
