const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  EmbedBuilder
} = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rover_status')
    .setDescription('🚀 Choose a Mars rover to see its latest images'),

  async execute(interaction) {
    const apiKey = process.env.NASA_API_KEY;
    if (!apiKey) {
      return await interaction.reply({ content: '❌ NASA_API_KEY missing in .env.', ephemeral: true });
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_rover')
      .setPlaceholder('🛰 Select a Mars Rover')
      .addOptions([
        { label: 'Curiosity', value: 'curiosity', description: 'Active' },
        { label: 'Opportunity', value: 'opportunity', description: 'Last active in 2018' },
        { label: 'Spirit', value: 'spirit', description: 'Last active in 2010' }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({
      content: '🌌 Select a Mars rover to fetch its latest images:',
      components: [row],
      ephemeral: true
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 15000,
      max: 1
    });

    collector.on('collect', async i => {
      if (i.user.id !== interaction.user.id) {
        return i.reply({ content: '🚫 This selection is not for you.', ephemeral: true });
      }

      const selectedRover = i.values[0];

      try {
        const res = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedRover}/latest_photos`, {
          params: { api_key: apiKey }
        });

        const photos = res.data.latest_photos;
        if (!photos || photos.length === 0) {
          return await i.update({ content: `❌ No photos found for **${selectedRover}**.`, components: [] });
        }

        const embeds = photos.slice(0, 3).map(photo =>
          new EmbedBuilder()
            .setTitle(`${photo.rover.name} Rover – ${photo.camera.full_name}`)
            .setDescription(`📅 Earth Date: **${photo.earth_date}**`)
            .setImage(photo.img_src)
            .setFooter({ text: `Sol: ${photo.sol} | Status: ${photo.rover.status}` })
            .setColor(0xff7733)
        );

        await i.update({
          content: `📸 Here are the latest photos from **${selectedRover.toUpperCase()}**:`,
          embeds,
          components: []
        });

      } catch (err) {
        console.error(err);
        await i.update({
          content: `❌ Failed to fetch rover images.\n\`\`\`${err.response?.data?.error?.message || err.message}\`\`\``,
          components: []
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        interaction.editReply({ content: '⌛ Timeout! Run `/rover_status` again.', components: [] });
      }
    });
  }
};
