import { Resend } from 'resend';
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const data = new SlashCommandBuilder()
  .setName('sendmail')
  .setDescription('📧 Send an email (Level 3-X only)')
  .addStringOption(option =>
    option.setName('to')
      .setDescription('Recipient email address')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('subject')
      .setDescription('Email subject')
      .setRequired(true)
  )
  .addStringOption(option =>
    option.setName('body')
      .setDescription('Email body')
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction) {
  const allowedRoleId = '1392043566997573716'; // Admin (Level 3-X)

  const memberRoles = interaction.member.roles.cache;
  if (!memberRoles.has(allowedRoleId)) {
    return interaction.reply({
      content: '❌ You do not have permission to use this command.',
      ephemeral: true,
    });
  }

  const to = interaction.options.getString('to');
  const subject = interaction.options.getString('subject');
  const body = interaction.options.getString('body');

  await interaction.deferReply({ ephemeral: true });

  try {
    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to,
      subject,
      html: `<p>${body}</p>`,
    });

    await interaction.followUp({
      content: `✅ Email sent to **${to}** successfully.`,
    });
  } catch (error) {
    console.error('❌ Email send failed:', error);
    await interaction.followUp({
      content: '❌ Email sending failed. Please check the logs and try again.',
    });
  }
}
