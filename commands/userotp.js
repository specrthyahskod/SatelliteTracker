const { SlashCommandBuilder } = require('discord.js');
const { verifyOTP } = require('../utils/otpmanager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userotp')
    .setDescription('🔑 Submit your OTP to complete verification')
    .addStringOption(opt => opt.setName('code').setDescription('The 6-digit OTP').setRequired(true)),

  async execute(interaction, client) {
    const otp = interaction.options.getString('code');
    const result = verifyOTP(interaction.user.id, otp);

    const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);

    if (result) {
      await interaction.reply('✅ Verification successful!');
      logChannel.send(`✅ \`${interaction.user.tag}\` verified successfully.`);
    } else {
      await interaction.reply({ content: '❌ Invalid OTP.', ephemeral: true });
      logChannel.send(`⚠️ \`${interaction.user.tag}\` failed OTP verification.`);
    }
  }
};
