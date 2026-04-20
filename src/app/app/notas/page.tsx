import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NoteList } from "./components/NoteList";
import { redirect } from "next/navigation";

export default async function NotasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    redirect("/login");
  }

  const notes = await prisma.note.findMany({
    where: { user_id: userId },
    orderBy: { updated_at: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Minhas Notas</h1>
        <p className="text-slate-500 mt-1">
          Guarde suas ideias, planos e conhecimentos em um só lugar.
        </p>
      </header>

      <NoteList initialNotes={notes} />
    </div>
  );
}
