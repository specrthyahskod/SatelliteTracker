const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require('discord.js');
const axios = require('axios');
const { generateAndStoreOTP } = require('../utils/otpmanager');
const { getStoredIP, setUserIP } = require('../utils/ipTracker');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('🔐 Begin secure verification')
    .addUserOption(option =>
      option.setName('user').setDescription('Target user').setRequired(true)
    ),

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
      .setPlaceholder('Used for identity check. Not stored.');

    const row = new ActionRowBuilder().addComponents(passwordInput);
    modal.addComponents(row);

    await interaction.showModal(modal);

    const filter = modalInteraction =>
      modalInteraction.customId === `verify_modal_${targetUser.id}` &&
      modalInteraction.user.id === targetUser.id;

    try {
      const submitted = await interaction.awaitModalSubmit({ filter, time: 60000 });
      await submitted.deferReply({ ephemeral: true });

      const password = submitted.fields.getTextInputValue('account_password');
      if (password.length < 6)
        return submitted.editReply('❌ Password format seems invalid.');

      // 🌐 Get public IP
      let userIP = 'Unknown';
      try {
        const ipRes = await axios.get('https://api.ipify.org?format=json');
        userIP = ipRes.data.ip;
      } catch (e) {
        console.warn('⚠️ Failed to fetch IP:', e);
      }

      // 🔐 IP Check
      const existingIP = getStoredIP(targetUser.id);
      if (existingIP && existingIP !== userIP) {
        return submitted.editReply({
          content: '🚫 Verification denied — new IP/device detected.\nContact a developer if this was expected.',
          ephemeral: true
        });
      }

      // ✅ Store if new
      if (!existingIP && userIP !== 'Unknown') setUserIP(targetUser.id, userIP);

      // 🧾 Generate OTP
      const otp = generateAndStoreOTP(targetUser.id);
      await targetUser.send({
        content: `🔐 Your OTP is: **${otp}**\nUse \`/userotp\` to complete verification.\n\n🔔 *Note: Developers may see your IP address during this process for security purposes.*`
      });

      // 📃 Log event
      const logChannel = await client.channels.fetch(process.env.LOG_CHANNEL_ID);
      logChannel.send({
        content: `🔐 **Verification started**\n👤 User: \`${targetUser.tag}\`\n🧠 User ID: \`${targetUser.id}\`\n🌍 IP: \`${userIP}\``
      });

      await submitted.editReply('📩 OTP sent via DM. Complete using `/userotp`.');
    } catch (err) {
      console.error('❌ Verification error:', err);
      await interaction.reply({
        content: '❌ Timeout or error occurred during verification.',
        ephemeral: true
      });
    }
  }
};
