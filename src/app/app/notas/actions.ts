"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveNote(id: string | null, title: string, body: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  if (!title || !body) throw new Error("Título e conteúdo são obrigatórios");

  if (id) {
    // Update
    await prisma.note.update({
      where: { id, user_id: userId },
      data: { title, body },
    });
  } else {
    // Create
    await prisma.note.create({
      data: {
        title,
        body,
        user_id: userId,
      },
    });
  }

  revalidatePath("/app/notas");
}

export async function deleteNote(noteId: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  await prisma.note.delete({
    where: { id: noteId, user_id: userId },
  });

  revalidatePath("/app/notas");
}
