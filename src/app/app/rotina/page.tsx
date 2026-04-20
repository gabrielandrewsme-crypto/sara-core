import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RoutineClient } from "./components/RoutineClient";

export default async function RotinaPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  
  if (!userId) return null;

  // Busca as rotinas do banco de dados do usuário logado
  const rawRoutines = await prisma.routine.findMany({
    where: { 
      user_id: userId,
      is_active: true
    },
    orderBy: { time: "asc" }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Busca as conclusões de hoje
  const completions = await prisma.routineCompletion.findMany({
    where: {
      user_id: userId,
      completed_at: {
        gte: today, // de hoje em diante
      }
    }
  });

  const completedIds = new Set(completions.map(c => c.routine_id));

  const routinesData = rawRoutines.map(r => ({
    id: r.id,
    title: r.title,
    time: r.time,
    days_of_week: r.days_of_week,
    isCompletedToday: completedIds.has(r.id),
    category: r.category ?? "default",
  }));

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <RoutineClient routines={routinesData} searchParams={searchParams} />
    </div>
  );
}
