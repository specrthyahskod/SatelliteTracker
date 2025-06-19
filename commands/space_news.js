// commands/space_news.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('space_news')
    .setDescription('📰 Get the latest space-related news headlines'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const { data } = await axios.get(`https://api.spaceflightnewsapi.net/v4/articles/?limit=3`);
      const newsList = data.results.map(article =>
        `🗞️ **${article.title}**\n${article.url}`
      ).join('\n\n');
      await interaction.editReply(`📰 **Latest Space News:**\n\n${newsList}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch space news.');
    }
  }
};
