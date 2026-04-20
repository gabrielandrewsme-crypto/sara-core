"use client";

import { useState } from "react";
import { createTask } from "../actions";
import { Plus, Loader2 } from "lucide-react";

export function AddTaskForm() {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createTask(formData);
      const form = document.getElementById("add-task-form") as HTMLFormElement;
      form?.reset();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar tarefa");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form 
      id="add-task-form"
      action={handleSubmit}
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex gap-2 items-center"
    >
      <input
        type="text"
        name="title"
        placeholder="O que precisa ser feito?"
        required
        className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 font-medium outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-xl transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}
