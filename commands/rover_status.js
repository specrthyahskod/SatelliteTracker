// commands/rover_status.js
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rover_status')
    .setDescription('🚗 Get latest image/status from NASA Mars Rovers'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const res = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=DEMO_KEY`);
      const photo = res.data.latest_photos[0];
      await interaction.editReply({
        content: `📸 Photo by ${photo.rover.name} on ${photo.earth_date}`,
        files: [photo.img_src]
      });
    } catch (err) {
      console.error(err);
      await interaction.editReply('❌ Could not fetch rover data.');
    }
  }
};
