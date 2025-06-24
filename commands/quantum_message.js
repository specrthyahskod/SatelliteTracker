// commands/quantum_message.js
const { SlashCommandBuilder } = require('discord.js');
const crypto = require('crypto');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quantum_message')
    .setDescription('💬 Send an encrypted message anonymously')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your secret message')
        .setRequired(true)),
  async execute(interaction) {
    const msg = interaction.options.getString('message');
    const encrypted = crypto.createHash('sha256').update(msg).digest('hex');
    await interaction.reply(`🧬 Quantum Hash Generated:\n\`${encrypted.slice(0, 16)}...\``);
  }
};
