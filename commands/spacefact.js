const { SlashCommandBuilder } = require('discord.js');

const facts = [
  "A day on Venus is longer than a year on Venus.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Neutron stars can spin 600 times per second.",
  "There’s a planet made of diamonds called 55 Cancri e.",
  "Saturn could float in water because it’s so light."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('spacefact')
    .setDescription('Get a random space fact'),
  async execute(interaction) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    await interaction.reply(`🌌 **Space Fact:** ${fact}`);
  }
};