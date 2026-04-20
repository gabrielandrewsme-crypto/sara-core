import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webpush from "web-push";
import { sendEventReminderEmail } from "@/lib/email";

// Configuração do Web Push
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:sara-core@exemplo.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function GET(req: NextRequest) {
  // Proteção opcional via API Key no Header para ser chamado apenas pelo Vercel Cron
  // const authHeader = req.headers.get("Authorization");
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  // }

  const now = new Date();
  
  try {
    // 1. Buscar eventos que precisam de lembrete (30d, 7d, 1d)
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { remind_30d: true, notified_30d: false },
          { remind_7d: true, notified_7d: false },
          { remind_1d: true, notified_1d: false },
        ],
        start_at: {
          gt: now, // Eventos futuros
        }
      },
      include: {
        user: {
          include: {
            push_subs: true
          }
        }
      }
    });

    let notificationsSent = 0;

    for (const event of events) {
      const timeDiffMs = event.start_at.getTime() - now.getTime();
      const diffDays = timeDiffMs / (1000 * 60 * 60 * 24);

      let typeToUpdate = "";
      let notificationBody = "";

      // Prioridade reversa: 1d -> 7d -> 30d
      if (event.remind_1d && !event.notified_1d && diffDays <= 1) {
        typeToUpdate = "1d";
        notificationBody = `Compromisso amanhã: ${event.title}`;
      } else if (event.remind_7d && !event.notified_7d && diffDays <= 7) {
        typeToUpdate = "7d";
        notificationBody = `Faltam 7 dias para: ${event.title}`;
      } else if (event.remind_30d && !event.notified_30d && diffDays <= 30) {
        typeToUpdate = "30d";
        notificationBody = `Compromisso em 30 dias: ${event.title}`;
        
        // Enviar e-mail também para o lembrete de 30 dias (conforme pedido)
        if (event.user.email) {
            await sendEventReminderEmail(event.user.email, event.title, event.start_at, "30d");
        }
      }

      if (typeToUpdate) {
        // Enviar Push para todos os devices do usuário
        for (const sub of event.user.push_subs) {
          try {
            await webpush.sendNotification(
              {
                endpoint: sub.endpoint,
                keys: {
                  auth: sub.keys_auth,
                  p256dh: sub.keys_p256dh,
                },
              },
              JSON.stringify({
                title: "Lembrete Sara Core",
                body: notificationBody,
                icon: "/icon-192x192.png",
                data: { url: "/app/agenda" }
              })
            );
          } catch (err) {
            console.error("Falha ao enviar push para subscription:", sub.id, err);
          }
        }

        // Marcar como notificado
        await prisma.event.update({
          where: { id: event.id },
          data: {
            [`notified_${typeToUpdate}`]: true
          }
        });
        
        notificationsSent++;
      }
    }

    return NextResponse.json({ success: true, notificationsSent });
  } catch (error) {
    console.error("Erro no job de lembretes:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
