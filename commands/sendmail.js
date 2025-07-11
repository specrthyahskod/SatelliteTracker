// ✅ sendmail.js
const { Resend } = require('resend'); // ✅ CommonJS-compatible

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
  data: {
    name: 'sendmail',
    description: 'Send an email',
    options: [
      {
        name: 'to',
        type: 3,
        description: 'Recipient email address',
        required: true,
      },
      {
        name: 'subject',
        type: 3,
        description: 'Email subject',
        required: true,
      },
      {
        name: 'body',
        type: 3,
        description: 'Email body content',
        required: true,
      },
    ],
  },

  async execute(interaction) {
    const to = interaction.options.getString('to');
    const subject = interaction.options.getString('subject');
    const body = interaction.options.getString('body');

    if (!interaction.member.roles.cache.has('1392043566997573716')) {
      return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
    }

    try {
      const result = await resend.emails.send({
        from: 'yourname@yourdomain.com', // ✅ MUST be a verified sender domain
        to,
        subject,
        html: `<p>${body}</p>`,
      });

      console.log(result);
      await interaction.reply({ content: '✅ Email sent successfully!' });
    } catch (error) {
      console.error('Email send failed:', error);
      await interaction.reply({ content: '❌ Failed to send email.', ephemeral: true });
    }
  },
};
