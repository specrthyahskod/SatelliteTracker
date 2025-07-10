// commands/leave.js
const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Bot leaves the voice channel it is in'),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guildId);

    if (!connection) {
      return interaction.reply({
        content: '❌ I\'m not connected to any voice channel.',
        ephemeral: true
      });
    }

    // Respond quickly, before destroying the connection
    await interaction.reply('👋 Leaving the voice channel...');

    try {
      connection.destroy();
    } catch (err) {
      console.error('VC leave error:', err);
    }
  }
};
