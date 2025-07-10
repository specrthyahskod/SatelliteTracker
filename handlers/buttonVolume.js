const { EmbedBuilder } = require('discord.js');

let currentVolume = 5;

function createVolumeBar(level) {
  const fullBlock = '🟩';
  const emptyBlock = '⬜';
  const blocks = 5;
  const filled = Math.round(level / 2);
  return fullBlock.repeat(filled) + emptyBlock.repeat(blocks - filled);
}

module.exports = async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'volume_up') {
    currentVolume = Math.min(10, currentVolume + 1);
  } else if (interaction.customId === 'volume_down') {
    currentVolume = Math.max(0, currentVolume - 1);
  } else return;

  const embed = new EmbedBuilder()
    .setTitle('🎚️ Volume Control')
    .setDescription(`Current Volume: **${currentVolume * 10}%**\n${createVolumeBar(currentVolume)}`)
    .setColor(0x00aeff);

  await interaction.update({ embeds: [embed] });
};
