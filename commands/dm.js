const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('📩 Send a direct message to the user')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('The user ID to DM')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The message to send')
        .setRequired(true)),

  async execute(interaction) {
    const allowedRole = '1358540938615590972'; // Staff/mod role ID

    // Check if the user has the allowed role
    if (!interaction.member.roles.cache.has(allowedRole)) {
      return interaction.reply({
        content: '🚫 You are not allowed to use this command.',
        ephemeral: true
      });
    }

    const userId = interaction.options.getString('userid');
    const message = interaction.options.getString('message');

    try {
      const user = await interaction.client.users.fetch(userId);
      if (!user) {
        return interaction.reply({
          content: '❌ Could not find the user.',
          ephemeral: true
        });
      }

      await user.send(`📬 Message from **${interaction.user.tag}**:\n> ${message}`);
      await interaction.reply({
        content: `✅ Message sent to <@${user.id}>`,
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ DM Error:', err);
      await interaction.reply({
        content: '⚠️ Failed to send DM. The user may have DMs off or doesn’t exist.',
        ephemeral: true
      });
    }
  }
};
