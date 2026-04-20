"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string; // "income" | "expense"
  const category = formData.get("category") as string;
  const dateStr = formData.get("date") as string;
  const is_recurring = formData.get("is_recurring") === "true";
  const frequency = formData.get("frequency") as string || null;
  const group_name = formData.get("group_name") as string || null;

  if (!amount || !type || !category || !dateStr) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  await prisma.transaction.create({
    data: {
      description,
      amount,
      type,
      category,
      date: new Date(dateStr),
      user_id: userId,
      is_recurring,
      frequency,
      group_name,
    },
  });

  revalidatePath("/app/financas");
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  await prisma.transaction.delete({
    where: { id, user_id: userId },
  });

  revalidatePath("/app/financas");
}

export async function updateTransaction(id: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) throw new Error("Não autorizado");

  const description = formData.get("description") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const dateStr = formData.get("date") as string;
  const is_recurring = formData.get("is_recurring") === "true";
  const frequency = formData.get("frequency") as string || null;
  const group_name = formData.get("group_name") as string || null;

  await prisma.transaction.update({
    where: { id, user_id: userId },
    data: {
      description,
      amount,
      type,
      category,
      date: new Date(dateStr),
      is_recurring,
      frequency,
      group_name,
    },
  });

  revalidatePath("/app/financas");
}
