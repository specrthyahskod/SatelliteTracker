// commands/disasterwatch.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const xml2js = require('xml2js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('disasterwatch')
    .setDescription('View recent global natural disasters'),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const res = await axios.get('https://www.gdacs.org/xml/rss.xml');
      const parsed = await xml2js.parseStringPromise(res.data);
      const items = parsed.rss.channel[0].item.slice(0, 3);

      const summaries = items.map(item => `🌍 **${item.title[0]}**\n> ${item.description[0].slice(0, 200)}...`).join('\n\n');

      await interaction.editReply(`🚨 **Global Disaster Alerts**\n${summaries}`);
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch disaster data.');
    }
  }
};
