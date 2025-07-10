const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('🎙️ Make the bot join your voice channel'),

  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: '❌ You must be in a voice channel first!',
        ephemeral: true
      });
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const embed = new EmbedBuilder()
        .setTitle('✅ Joined Voice Channel')
        .setDescription(`🎧 Connected to [${voiceChannel.name}](https://discord.com/channels/${interaction.guild.id}/${voiceChannel.id})`)
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (err) {
      console.error('❌ Join command failed:', err);
      await interaction.reply({
        content: '❌ Failed to join the voice channel.',
        ephemeral: true
      });
    }
  }
};
