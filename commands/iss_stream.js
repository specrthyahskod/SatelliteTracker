// commands/iss_stream.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('iss_stream')
    .setDescription('📺 Watch the live video stream from the ISS'),
  async execute(interaction) {
    await interaction.reply(
      '📺 **Watch the International Space Station LIVE:**\nhttps://www.youtube.com/watch?v=86YLFOog4GM'
    );
  }
};
