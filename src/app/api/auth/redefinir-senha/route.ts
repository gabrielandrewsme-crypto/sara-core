import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const token = (body.token ?? "").trim();
  const password = body.password ?? "";

  if (!token || !password) {
    return NextResponse.json({ error: "Token e nova senha são obrigatórios." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "A senha precisa ter pelo menos 8 caracteres." },
      { status: 400 },
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const row = await prisma.passwordResetToken.findUnique({
    where: { token_hash: tokenHash },
  });

  if (!row || row.used_at || row.expires_at < new Date()) {
    return NextResponse.json(
      { error: "Link inválido ou expirado. Peça um novo." },
      { status: 400 },
    );
  }

  const password_hash = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: row.user_id },
      data: { password_hash },
    }),
    prisma.passwordResetToken.update({
      where: { id: row.id },
      data: { used_at: new Date() },
    }),
    // Invalida quaisquer outros tokens pendentes do mesmo usuário
    prisma.passwordResetToken.updateMany({
      where: { user_id: row.user_id, used_at: null, id: { not: row.id } },
      data: { used_at: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
