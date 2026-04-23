import { Resend } from 'resend';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Inicializa condicionalmente para não quebrar build se RESEND_API_KEY não estiver no .env do CI
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Remetente padrão — pode ser sobrescrito via EMAIL_FROM no Vercel sem redeploy de código
const FROM = process.env.EMAIL_FROM || 'Sara Core <no-reply@saraortizai.com.br>';

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined. Skipping email send.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Bem-vindo(a) ao Sara Core!',
      html: `
        <div style="font-family: sans-serif; p-4;">
          <h2 style="color: #2563EB;">Olá, ${name}! 👋</h2>
          <p>Obrigado por adquirir o <strong>Sara Core</strong>.</p>
          <p>Seu acesso foi liberado com sucesso. Instale o nosso PWA na tela inicial do seu celular e tenha o controle da sua rotina na palma da mão.</p>
          <br />
          <p>Acesse aqui: <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Entrar no App</a></p>
          <br />
          <p>Até breve,<br/>Equipe Sara</p>
        </div>
      `
    });
    console.log(`Email de boas-vindas enviado para ${email}`);
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
  }
}

export async function sendEventReminderEmail(email: string, eventTitle: string, eventDate: Date, type: string) {
  if (!resend) return;

  const dateStr = format(eventDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
  let subject = `Lembrete: ${eventTitle}`;
  let message = `Você tem um compromisso chegando: <strong>${eventTitle}</strong> em ${dateStr}.`;

  if (type === '30d') {
    subject = `[30 dias] Lembrete de compromisso: ${eventTitle}`;
    message = `Faltam cerca de 1 mês para o seu compromisso <strong>${eventTitle}</strong> (${dateStr}). Estamos avisando com antecedência para você se planejar!`;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject,
      html: `
        <div style="font-family: sans-serif; color: #334155;">
          <h2 style="color: #2563EB;">Lembrete Sara Core</h2>
          <p>${message}</p>
          <br />
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/app/agenda" style="background: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 8px;">Ver na Agenda</a></p>
          <br />
          <p>Equipe Sara</p>
        </div>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar email de lembrete:', error);
  }
}

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined. Skipping password reset email.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: 'Redefinir sua senha — Sara Core',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0f172a; padding: 40px 20px; color: #e2e8f0;">
          <div style="max-width: 480px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 40px 32px;">
            <h1 style="font-family: Georgia, serif; color: #7dd3fc; margin: 0 0 16px; font-size: 28px; font-weight: 500;">Redefinir sua senha</h1>
            <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 12px;">Recebemos um pedido para redefinir a senha da sua conta Sara Core.</p>
            <p style="color: #cbd5e1; line-height: 1.6; margin: 0 0 28px;">Clique no botão abaixo para criar uma nova senha. O link expira em 1 hora.</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${resetUrl}" style="display: inline-block; background: #7dd3fc; color: #0f172a; text-decoration: none; padding: 14px 32px; border-radius: 999px; font-weight: 500;">Redefinir senha</a>
            </div>
            <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 28px 0 0;">Se não foi você, pode ignorar este email — sua senha atual continua válida.</p>
          </div>
          <p style="text-align: center; color: #475569; font-size: 11px; margin-top: 24px; letter-spacing: 0.2em; text-transform: uppercase;">Sara Core</p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error);
  }
}
