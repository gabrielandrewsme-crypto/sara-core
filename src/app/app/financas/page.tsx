import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FinanceClient } from "./components/FinanceClient";
import { redirect } from "next/navigation";

export default async function FinancasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    redirect("/login");
  }

  const transactions = await prisma.transaction.findMany({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });

  return <FinanceClient transactions={transactions} />;
}
