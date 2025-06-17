const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('⏱️ Shows how long the bot has been running'),

  async execute(interaction) {
    const totalSeconds = Math.floor(process.uptime());
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    await interaction.reply(`⏱️ The bot has been operating for **${hours}** hours and **${minutes}** mins.`);
  }
};
