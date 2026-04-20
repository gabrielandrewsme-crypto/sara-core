import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { endpoint, keys } = await req.json();

    if (!endpoint || !keys?.auth || !keys?.p256dh) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    // Upsert: se já existir o endpoint para este usuário, não cria duplicado
    await prisma.pushSubscription.create({
      data: {
        user_id: userId,
        endpoint,
        keys_auth: keys.auth,
        keys_p256dh: keys.p256dh,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao salvar subscription:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
