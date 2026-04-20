import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const data = await req.json();

  try {
    // Verificar se o evento pertence ao usuário
    const existing = await prisma.event.findFirst({
      where: { id, user_id: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        start_at: data.start_at ? new Date(data.start_at) : undefined,
        end_at: data.end_at ? new Date(data.end_at) : undefined,
        category: data.category,
        color: data.color,
        remind_30d: data.remind_30d,
        remind_7d: data.remind_7d,
        remind_1d: data.remind_1d,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json({ error: "Erro ao atualizar evento" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const existing = await prisma.event.findFirst({
      where: { id, user_id: userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar evento:", error);
    return NextResponse.json({ error: "Erro ao deletar evento" }, { status: 500 });
  }
}
