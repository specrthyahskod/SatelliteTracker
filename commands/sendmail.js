// commands/sendemail.js

const { SlashCommandBuilder } = require('discord.js');
const nodemailer = require('nodemailer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sendemail')
    .setDescription('📤 Send a secure email (Admin Level 3-X only)')
    .addStringOption(opt =>
      opt.setName('to')
        .setDescription('Recipient email address')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('subject')
        .setDescription('Email subject')
        .setRequired(true))
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Email message content')
        .setRequired(true)),

  async execute(interaction) {
    const authorizedRoleId = '1392043566997573716';

    // 🔒 Role verification
    const hasClearance = interaction.member.roles.cache.has(authorizedRoleId);
    if (!hasClearance) {
      return interaction.reply({
        content: '🚫 You do not have **Level 3-X clearance** to send emails.',
        ephemeral: true
      });
    }

    const to = interaction.options.getString('to');
    const subject = interaction.options.getString('subject');
    const message = interaction.options.getString('message');

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Satellite Bot" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: message
    };

    try {
      await transporter.sendMail(mailOptions);
      await interaction.reply({
        content: `📧 Email successfully sent to **${to}**.`,
        ephemeral: true
      });
    } catch (err) {
      console.error('❌ Email send failed:', err);
      await interaction.reply({
        content: '❌ Failed to send email. Please check the SMTP configuration or logs.',
        ephemeral: true
      });
    }
  }
};
