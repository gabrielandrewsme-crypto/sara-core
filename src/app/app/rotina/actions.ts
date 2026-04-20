"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createRoutine(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const duration = parseInt(formData.get("duration") as string) || 30;
  const category = (formData.get("category") as string) || "default";
  const daysStr = formData.get("days_of_week") as string;

  const days_of_week = daysStr
    ? daysStr.split(",").map((d) => parseInt(d.trim(), 10)).filter((d) => !isNaN(d))
    : [0, 1, 2, 3, 4, 5, 6];

  if (!title || !time) throw new Error("Título e horário são obrigatórios");

  await prisma.routine.create({
    data: {
      title,
      time,
      days_of_week,
      user_id: userId,
      duration_min: duration,
      category,
    },
  });

  revalidatePath("/app/rotina");
}

export async function deleteRoutine(routineId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Não autorizado");

  await prisma.routine.update({
    where: { id: routineId, user_id: userId },
    data: { is_active: false },
  });

  revalidatePath("/app/rotina");
}

export async function updateRoutine(routineId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) throw new Error("Não autorizado");

  const title = formData.get("title") as string;
  const time = formData.get("time") as string;
  const duration = parseInt(formData.get("duration") as string) || 30;
  const category = (formData.get("category") as string) || "default";
  const daysStr = formData.get("days_of_week") as string;

  const days_of_week = daysStr
    ? daysStr.split(",").map((d) => parseInt(d.trim(), 10)).filter((d) => !isNaN(d))
    : [0, 1, 2, 3, 4, 5, 6];

  await prisma.routine.update({
    where: { id: routineId, user_id: userId },
    data: {
      title,
      time,
      duration_min: duration,
      category,
      days_of_week,
    },
  });

  revalidatePath("/app/rotina");
}

export async function toggleRoutineCompletion(routineId: string, markAsCompleted: boolean) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (markAsCompleted) {
    await prisma.routineCompletion.create({
      data: { routine_id: routineId, user_id: userId },
    });
  } else {
    await prisma.routineCompletion.deleteMany({
      where: {
        routine_id: routineId,
        user_id: userId,
        completed_at: { gte: today },
      },
    });
  }

  revalidatePath("/app/rotina");
}
