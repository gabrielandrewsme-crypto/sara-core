import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  // Buscar eventos (por padrão, trazemos do ano passado até um ano no futuro)
  // Otimizável via query params se necessário no futuro
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  const oneYearAhead = new Date();
  oneYearAhead.setFullYear(now.getFullYear() + 1);

  try {
    const events = await prisma.event.findMany({
      where: {
        user_id: userId,
        start_at: {
          gte: oneYearAgo,
          lte: oneYearAhead,
        },
      },
      orderBy: {
        start_at: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Erro ao buscar agenda:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const data = await req.json();

  try {
    const event = await prisma.event.create({
      data: {
        user_id: userId,
        title: data.title,
        description: data.description,
        start_at: new Date(data.start_at),
        end_at: new Date(data.end_at),
        category: data.category || "pessoal",
        color: data.color || "#3b82f6",
        remind_30d: data.remind_30d ?? true,
        remind_7d: data.remind_7d ?? true,
        remind_1d: data.remind_1d ?? true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return NextResponse.json({ error: "Erro ao criar evento" }, { status: 500 });
  }
}
