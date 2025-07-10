const { SlashCommandBuilder } = require('discord.js');

// Exportable in-memory map of userID → coordinates
const userLocations = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlocation')
    .setDescription('Set your GPS location for satellite tracking')
    .addNumberOption(option =>
      option.setName('latitude')
        .setDescription('Your latitude (e.g., 22.5726)')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('longitude')
        .setDescription('Your longitude (e.g., 88.3639)')
        .setRequired(true)),

  async execute(interaction) {
    const latitude = interaction.options.getNumber('latitude');
    const longitude = interaction.options.getNumber('longitude');

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return interaction.reply({
        content: '❌ Please enter valid coordinates.\nLatitude must be between -90 and 90.\nLongitude must be between -180 and 180.',
        ephemeral: true
      });
    }

    userLocations.set(interaction.user.id, { lat: latitude, lon: longitude });

    return interaction.reply({
      content: `📍 Your location has been saved:\n**Latitude:** ${latitude}\n**Longitude:** ${longitude}`,
      ephemeral: true
    });
  },

  userLocations
};
