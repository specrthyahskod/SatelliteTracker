const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rover_status')
    .setDescription('🚗 Get latest image from a NASA Mars Rover')
    .addStringOption(option =>
      option.setName('rover')
        .setDescription('Choose a Mars rover')
        .setRequired(true)
        .addChoices(
          { name: 'Curiosity', value: 'curiosity' },
          { name: 'Perseverance', value: 'perseverance' },
          { name: 'Opportunity', value: 'opportunity' }
        )
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const rover = interaction.options.getString('rover');
    const apiKey = process.env.NASA_API_KEY;

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${apiKey}`;

    try {
      const res = await axios.get(url);
      const photo = res.data.latest_photos[0];

      if (!photo) {
        return interaction.editReply(`⚠️ No recent photos found for **${rover}**.`);
      }

      await interaction.editReply({
        content: `📸 Photo by **${photo.rover.name}** taken on **${photo.earth_date}** with camera **${photo.camera.full_name}**`,
        files: [photo.img_src]
      });
    } catch (err) {
      console.error('Rover status error:', err);
      await interaction.editReply('❌ Could not fetch rover data. Please try again later.');
    }
  }
};
