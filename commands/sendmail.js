// commands/sendmail.js
const { Resend } = require('@resend/node');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = {
  data: {
    name: 'sendemail',
    description: 'Send an email (Admin only)',
    options: [
      { name: 'to', type: 3, required: true, description: 'Recipient email' },
      { name: 'subject', type: 3, required: true, description: 'Email subject' },
      { name: 'body', type: 3, required: true, description: 'Email content' }
    ]
  },
  async execute(interaction) {
    const role = interaction.guild.roles.cache.get('1392043566997573716');
    if (!interaction.member.roles.cache.has(role.id)) {
      return interaction.reply({ content: '❌ You do not have permission.', ephemeral: true });
    }

    const to = interaction.options.getString('to');
    const subject = interaction.options.getString('subject');
    const text = interaction.options.getString('body');

    try {
      await resend.emails.send({
        from: 'Bot Mailer <onboarding@resend.dev>',
        to,
        subject,
        text
      });

      await interaction.reply({ content: '✅ Email sent successfully!', ephemeral: true });
    } catch (error) {
      console.error('❌ Email send failed:', error);
      await interaction.reply({ content: `❌ Email failed: ${error.message}`, ephemeral: true });
    }
  }
};
