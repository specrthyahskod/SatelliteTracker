const { Resend } = require('@resend/node');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
  data: {
    name: 'sendemail',
    description: 'Send an email (Level 3-X role required)',
    options: [
      {
        name: 'to',
        type: 3, // STRING
        required: true,
        description: 'Recipient email address'
      },
      {
        name: 'subject',
        type: 3,
        required: true,
        description: 'Subject of the email'
      },
      {
        name: 'body',
        type: 3,
        required: true,
        description: 'Body of the email (text or HTML)'
      }
    ]
  },

  async execute(interaction) {
    const requiredRoleId = '1392043566997573716';

    // Permission check
    if (!interaction.member.roles.cache.has(requiredRoleId)) {
      return interaction.reply({
        content: '❌ You do not have permission to use this command.',
        ephemeral: true
      });
    }

    const to = interaction.options.getString('to');
    const subject = interaction.options.getString('subject');
    const text = interaction.options.getString('body');

    await interaction.deferReply({ ephemeral: true });

    try {
      await resend.emails.send({
        from: 'Bot Mailer <onboarding@resend.dev>', // or replace with your verified domain email
        to,
        subject,
        text
      });

      await interaction.editReply({
        content: '✅ Email sent successfully!'
      });
    } catch (error) {
      console.error('❌ Email send failed:', error);
      await interaction.editReply({
        content: `❌ Email failed: ${error?.message || 'Unknown error'}`,
      });
    }
  }
};
