const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

let currentVolume = 5; // range: 0–10

function createVolumeBar(level) {
  const fullBlock = '🟩';
  const emptyBlock = '⬜';
  const blocks = 5;
  const filled = Math.round(level / 2);
  return fullBlock.repeat(filled) + emptyBlock.repeat(blocks - filled);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🔊 Show and adjust current volume'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎚️ Volume Control')
      .setDescription(`Current Volume: **${currentVolume * 10}%**\n${createVolumeBar(currentVolume)}`)
      .setColor(0x00aeff);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('volume_up')
        .setLabel('🔼 Up')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('volume_down')
        .setLabel('🔽 Down')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};
