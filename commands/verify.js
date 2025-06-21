const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { generateAndStoreOTP } = require('../utils/otpmanager');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('🔐 Begin secure verification')
    .addUserOption(option => option.setName('user').setDescription('Target user').setRequired(true)),

  async execute(interaction, client) {
    const targetUser = interaction.options.getUser('user');

    const modal = new ModalBuilder()
      .setCustomId(`verify_modal_${targetUser.id}`)
      .setTitle('Enter Account Password');

    const passwordInput = new TextInputBuilder()
      .setCustomId('account_password')
      .setLabel('Your account password')
      .setStyle(TextInputStyle.Short)
      .setMinLength(6)
      .setRequired(true)
      .setPlaceholder('Not stored, used for validation');

    const firstActionRow = new ActionRowBuilder().addComponents(passwordInput);
    modal.addComponents(firstActionRow);

    await interaction.showModal(modal);

    const filter = (modalInteraction) =>
      modalInteraction.customId === `verify_modal_${targetUser.id}` &&
      modalInteraction.user.id === targetUser.id;

    try {
      const submitted = await interaction.awaitModalSubmit({ filter, time: 60000 });
      await submitted.deferReply({ ephemeral: true });

      // Simulate check
      const password = submitted.fields.getTextInputValue('account_password');
      if (password.length < 6) return submitted.editReply('❌ Invalid password format.');

      const otp = generateAndStoreOTP(targetUser.id);
      await targetUser.send(`🔐 Your OTP is: **${otp}**. Use \`/userotp\` to complete verification.`);

      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
      logChannel.send(`🔐 \`${targetUser.tag}\` initiated verification.`);

      await submitted.editReply('📩 Check your DM for the OTP.');
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '❌ Timeout or error occurred.', ephemeral: true });
    }
  }
};
