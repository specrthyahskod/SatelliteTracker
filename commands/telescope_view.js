// commands/telescope_view.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('telescope_view')
    .setDescription('🔭 View the live starmap from Earth'),
  async execute(interaction) {
    await interaction.reply(
      '🔭 Live starmap view (adjust for your location):\nhttps://stellarium-web.org/'
    );
  }
};
