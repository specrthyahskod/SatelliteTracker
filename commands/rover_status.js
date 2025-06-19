// commands/rover_status.js
const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rover_status')
    .setDescription('🚗 Choose a Mars rover to get its latest photo!'),
  
  async execute(interaction) {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return await interaction.reply({ content: '❌ NASA_API_KEY is missing.', ephemeral: true });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_rover')
      .setPlaceholder('Choose a Mars rover')
      .addOptions([
        {
          label: 'Curiosity',
          description: 'Get the latest photo from Curiosity',
          value: 'curiosity',
        },
        {
          label: 'Opportunity',
          description: 'Get the latest photo from Opportunity (ended mission)',
          value: 'opportunity',
        },
        {
          label: 'Spirit',
          description: 'Get the latest photo from Spirit (ended mission)',
          value: 'spirit',
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ content: '🛰 Select a Mars rover:', components: [row], ephemeral: true });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
      max: 1,
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '❌ This menu is not for you.', ephemeral: true });
      }

      const selectedRover = i.values[0];
      try {
        const res = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/latest_photos`, {
          params: {
            api_key: apiKey
          }
        });

        const photo = res.data.latest_photos[0];
        if (!photo) {
          return await i.update({ content: `❌ No latest photos found for **${selectedRover}**.`, components: [] });
        }

        await i.update({
          content: `📸 **${photo.rover.name}** captured this on **${photo.earth_date}**\nCamera: ${photo.camera.full_name}`,
          files: [photo.img_src],
          components: []
        });

      } catch (err) {
        console.error('❌ Error fetching rover photo:', err);
        await i.update({ content: `❌ Error: ${err.response?.data?.error?.message || err.message}`, components: [] });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⌛ Time expired. Please try the command again.', components: [] });
      }
    });
  }
};
