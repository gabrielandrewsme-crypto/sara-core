import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { CalendarContainer } from "./components/CalendarContainer";

export default async function AgendaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  return (
    <div className="p-4 pb-24 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sua Agenda</h1>
          <p className="text-slate-500 text-sm mt-1">Organize seus compromissos e rotinas</p>
        </div>
      </header>

      <CalendarContainer />
    </div>
  );
}
