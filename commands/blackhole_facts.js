// commands/blackhole_facts.js
const { SlashCommandBuilder } = require('discord.js');

const facts = [
  "A black hole’s gravity is so strong, not even light escapes.",
  "Supermassive black holes exist at the centers of most galaxies.",
  "Black holes were first predicted by Einstein's general relativity.",
  "Time slows near the event horizon of a black hole.",
  "Black holes evaporate slowly through Hawking radiation."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('blackhole_facts')
    .setDescription('🕳️ Get a random black hole fact!'),
  async execute(interaction) {
    const random = facts[Math.floor(Math.random() * facts.length)];
    await interaction.reply(`🕳️ **Black Hole Fact:** ${random}`);
  }
};
