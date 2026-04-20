import { Resend } from 'resend';

// Inicializa condicionalmente para não quebrar build se RESEND_API_KEY não estiver no .env do CI
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendWelcomeEmail(email: string, name: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is not defined. Skipping email send.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Sara Core <onboarding@resend.dev>', // No modo de teste/sandbox do Resend
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
      from: 'Sara Core <alertas@resend.dev>',
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

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

