const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const ytSearch = require('yt-search');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('🔍 Search and preview YouTube results')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('What do you want to search?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    await interaction.deferReply();

    const result = await ytSearch(query);
    const videos = result.videos.slice(0, 5);

    if (!videos.length) {
      return interaction.editReply('❌ No results found for your query.');
    }

    const embed = new EmbedBuilder()
      .setTitle('🎬 YouTube Search Results')
      .setDescription(videos.map((v, i) => `**${i + 1}.** [${v.title}](${v.url}) - \`${v.timestamp}\``).join('\n'))
      .setColor('Red')
      .setFooter({ text: 'Click a button below to choose a video to play' });

    const buttons = new ActionRowBuilder()
      .addComponents(videos.map((v, i) =>
        new ButtonBuilder()
          .setCustomId(`search_select_${i}`)
          .setLabel(`${i + 1}`)
          .setStyle(ButtonStyle.Primary)
      ));

    await interaction.editReply({ embeds: [embed], components: [buttons] });

    const collector = interaction.channel.createMessageComponentCollector({
      time: 15000,
      max: 1,
      filter: i => i.user.id === interaction.user.id,
    });

    collector.on('collect', async i => {
      const index = parseInt(i.customId.split('_')[2]);
      const selected = videos[index];
      await i.update({
        content: `✅ Selected: [${selected.title}](${selected.url})`,
        embeds: [],
        components: [],
      });

      // Trigger /play command or your logic here
      const playCommand = interaction.client.commands.get('play');
      if (playCommand) {
        interaction.options.getString = () => selected.url; // monkey patch for reuse
        await playCommand.execute(interaction);
      }
    });

    collector.on('end', collected => {
      if (!collected.size) {
        interaction.editReply({ content: '⌛ Time expired. Please run `/search` again.', embeds: [], components: [] });
      }
    });
  },
};
