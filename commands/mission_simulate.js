// commands/mission_simulate.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mission_simulate')
    .setDescription('🛰️ Simulate a space mission')
    .addStringOption(option =>
      option.setName('mission')
        .setDescription('Choose your mission')
        .setRequired(true)
        .addChoices(
          { name: 'Moon Landing', value: 'moon' },
          { name: 'Mars Rover', value: 'mars' },
          { name: 'ISS Docking', value: 'iss' }
        )),
  async execute(interaction) {
    const mission = interaction.options.getString('mission');
    await interaction.reply(`🚀 Simulating **${mission.toUpperCase()}** mission...`);
    // Simulated delay
    setTimeout(() => {
      interaction.followUp(`✅ Mission complete: ${mission} simulation success.`);
    }, 3000);
  }
};
