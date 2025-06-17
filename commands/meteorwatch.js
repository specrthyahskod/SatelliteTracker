const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meteorwatch')
    .setDescription('Show major upcoming meteor showers'),
  async execute(interaction) {
    const showers = [
      { name: 'Perseids', peak: 'Aug 12–13, 2025' },
      { name: 'Geminids', peak: 'Dec 13–14, 2025' },
      { name: 'Orionids', peak: 'Oct 22–23, 2025' }
    ];
    const lines = showers.map(s => `• **${s.name}** — peaks ${s.peak}`);
    await interaction.reply(`🌠 **Meteor Showers in 2025–26:**\n${lines.join('\n')}`);
  }
};
