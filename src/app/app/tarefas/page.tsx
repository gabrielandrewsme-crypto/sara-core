import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";
import { redirect } from "next/navigation";

export default async function TarefasPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  if (!userId) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: { user_id: userId },
    orderBy: [
      { is_done: "asc" },
      { created_at: "desc" }
    ],
  });

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Mural de Tarefas</h1>
        <p className="text-slate-500 mt-1">
          Organize seu dia e libere espaço na sua mente.
        </p>
      </header>

      <AddTaskForm />

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">
          Suas Tarefas
        </h2>
        <TaskList tasks={tasks} />
      </section>
    </div>
  );
}
