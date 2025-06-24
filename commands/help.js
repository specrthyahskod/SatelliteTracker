// commands/help.js
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('📖 View all StellarLink bot commands and features'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🚀 StellarLink Bot Command Guide')
      .setDescription(
        "Explore powerful space utilities, simulations, and tools. Below are all available commands:\n\n" +
        "✨ Use `/command` format to execute each.\n🔒 Secure actions may require verification."
      )
      .setColor('#00aaff')
      .setFooter({ text: 'Built by StellarLink • Powered by cosmic data' })
      .setTimestamp();

    for (const [name, command] of interaction.client.commands) {
      if (command?.data?.description) {
        embed.addFields({
          name: `/${command.data.name}`,
          value: command.data.description,
          inline: false
        });
      }
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
