const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modmail')
    .setDescription('Send a private issue to the moderators.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Your issue/message')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const issue = interaction.options.getString('message');

    const guild = interaction.guild;
    const category = guild.channels.cache.find(c => c.name === "ModMail" && c.type === ChannelType.GuildCategory);
    
    const channel = await guild.channels.create({
      name: `modmail-${user.username}`,
      type: ChannelType.GuildText,
      parent: category?.id || null,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: user.id,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        },
        {
          id: '1358540938615590972', // Staff Role ID
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
        }
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(`📩 New ModMail from ${user.tag}`)
      .setDescription(`**Issue:** ${issue}`)
      .setColor(0x3498db)
      .setTimestamp();

    const closeButton = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('close_modmail')
        .setLabel('🔒 Close')
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@&1358540938615590972>`,
      embeds: [embed],
      components: [closeButton]
    });

    await interaction.reply({ content: `✅ Your issue has been sent to the staff. A member of the support team will reach out to you shortly.`, ephemeral: true });
  }
};
