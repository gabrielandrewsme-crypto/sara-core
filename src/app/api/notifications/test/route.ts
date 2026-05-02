import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import webpush from "web-push";

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:sara-core@exemplo.com",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "VAPID keys não configuradas no servidor" },
      { status: 500 }
    );
  }

  const subs = await prisma.pushSubscription.findMany({ where: { user_id: userId } });

  if (subs.length === 0) {
    return NextResponse.json(
      { error: "Nenhuma subscription registrada para este usuário" },
      { status: 404 }
    );
  }

  const payload = JSON.stringify({
    title: "Teste Sara Core",
    body: "Se você está vendo isto, as notificações funcionam!",
    icon: "/icons/icon-192x192.png",
    data: { url: "/app/agenda" },
  });

  const results = await Promise.all(
    subs.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { auth: sub.keys_auth, p256dh: sub.keys_p256dh },
          },
          payload
        );
        return { id: sub.id, ok: true };
      } catch (err: any) {
        const status = err?.statusCode;
        // Subscription expirada — remove do banco
        if (status === 404 || status === 410) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
          return { id: sub.id, ok: false, status, removed: true };
        }
        return { id: sub.id, ok: false, status, message: err?.body || err?.message };
      }
    })
  );

  return NextResponse.json({ total: subs.length, results });
}
