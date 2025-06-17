// commands/uptime.js
const { SlashCommandBuilder } = require('discord.js');

let startTime = Date.now();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Shows how long the bot has been running'),

  async execute(interaction) {
    const now = Date.now();
    const diff = now - startTime;

    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);

    await interaction.reply(`🕒 The bot has been operating for **${hours}** hours and **${minutes}** minutes.`);
  }
};
