import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.RESEND_FROM || 'Sara Core <onboarding@resend.dev>';

export async function sendWelcomeEmail(email: string, appUrl: string) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Bem-vinda ao Sara Core!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Seu acesso ao Sara Core está ativo!</h2>
          <p>Obrigado por adquirir o Sara Core. Você já pode acessar o aplicativo e começar a se organizar com mais facilidade.</p>
          <p>Acesse o app e instale-o no seu celular (como um PWA) para ter notificações e a melhor experiência.</p>
          <a href="${appUrl}" style="display: inline-block; padding: 10px 20px; background-color: #2563EB; color: white; text-decoration: none; border-radius: 5px;">Acessar o App</a>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendReminderEmail(email: string, title: string, description: string) {
  try {
    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: `Lembrete: ${title}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Lembrete do Sara Core</h2>
          <h3>${title}</h3>
          <p>${description}</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Failed to send reminder email:', error);
  }
}
