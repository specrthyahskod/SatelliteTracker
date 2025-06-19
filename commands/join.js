// commands/join.js
const { SlashCommandBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Bot joins your current voice channel'),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({ content: '❌ You must be in a voice channel first.', ephemeral: true });
    }

    try {
      joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator
      });

      return interaction.reply(`✅ Joined <#${voiceChannel.id}>`);
    } catch (error) {
      console.error('VC join error:', error);
      return interaction.reply({ content: '❌ Failed to join the voice channel.', ephemeral: true });
    }
  }
};
