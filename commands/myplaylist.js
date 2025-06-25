// commands/myplaylist.js
const { SlashCommandBuilder } = require('discord.js');
const generateGeminiPlaylist = require('../utils/gptPlaylist');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('myplaylist')
    .setDescription('🤖 Get your AI-generated playlist from last 14 days'),
  async execute(interaction) {
    await interaction.deferReply();
    const playlistEmbed = await generateGeminiPlaylist(interaction.user.id);
    await interaction.editReply({ content: '🎶 Your smart playlist:', embeds: [playlistEmbed] });
  }
};
