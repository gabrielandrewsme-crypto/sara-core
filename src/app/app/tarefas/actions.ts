"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  const title = formData.get("title") as string;
  if (!title) throw new Error("O título da tarefa é obrigatório");

  await prisma.task.create({
    data: {
      title,
      user_id: userId,
    },
  });

  revalidatePath("/app/tarefas");
}

export async function toggleTask(taskId: string, isDone: boolean) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  await prisma.task.update({
    where: { id: taskId, user_id: userId },
    data: { 
      is_done: isDone,
      done_at: isDone ? new Date() : null
    },
  });

  revalidatePath("/app/tarefas");
}

export async function deleteTask(taskId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  await prisma.task.delete({
    where: { id: taskId, user_id: userId },
  });

  revalidatePath("/app/tarefas");
}

export async function updateTask(taskId: string, title: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  await prisma.task.update({
    where: { id: taskId, user_id: userId },
    data: { title },
  });

  revalidatePath("/app/tarefas");
}
