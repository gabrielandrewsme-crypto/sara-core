import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MASTER_ACCESS_KEY = process.env.MASTER_ACCESS_KEY || "SARA-ROOTS-2026";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: { key?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const provided = (body.key ?? "").trim();
  if (!provided) {
    return NextResponse.json({ error: "Informe a chave de acesso." }, { status: 400 });
  }

  if (provided !== MASTER_ACCESS_KEY) {
    return NextResponse.json({ error: "Chave inválida." }, { status: 403 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { is_active: true },
  });

  return NextResponse.json({ ok: true });
}
