// commands/satellite_wiki.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('satellite_wiki')
    .setDescription('📡 Get a satellite summary from Wikipedia')
    .addStringOption(opt =>
      opt.setName('name')
        .setDescription('Name of the satellite')
        .setRequired(true)
    ),
  async execute(interaction) {
    const name = interaction.options.getString('name');
    await interaction.deferReply();
    try {
      const res = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`);
      if (res.data.extract) {
        await interaction.editReply(`🛰️ **${res.data.title}**\n${res.data.extract}\n${res.data.content_urls.desktop.page}`);
      } else {
        await interaction.editReply(`❌ No summary found for "${name}"`);
      }
    } catch {
      await interaction.editReply('❌ Error fetching summary.');
    }
  }
};
