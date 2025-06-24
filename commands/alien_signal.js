// commands/alien_signal.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alien_signal')
    .setDescription('📡 Decode mysterious alien signals'),
  async execute(interaction) {
    const fakeSignal = '101101001100... ⏳ Decoding in progress...';
    await interaction.reply(`🛸 Received transmission:\n\`\`\`\n${fakeSignal}\n\`\`\``);
    setTimeout(() => {
      interaction.followUp('📨 Message decoded: "**We are not alone.**"');
    }, 4000);
  }
};
