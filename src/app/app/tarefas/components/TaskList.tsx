"use client";

import { Task } from "@prisma/client";
import { toggleTask, deleteTask } from "../actions";
import { CheckCircle2, Circle, Trash2, Loader2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";
import { updateTask } from "../actions";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleToggle(taskId: string, isDone: boolean) {
    setLoadingId(taskId);
    try {
      await toggleTask(taskId, isDone);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(taskId: string) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    setLoadingId(taskId);
    try {
      await deleteTask(taskId);
    } finally {
      setLoadingId(null);
    }
  }

  async function handleUpdate(taskId: string) {
    if (!editTitle.trim()) return;
    setLoadingId(taskId);
    try {
      await updateTask(taskId, editTitle);
      setEditingId(null);
    } finally {
      setLoadingId(null);
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500">
        Nenhuma tarefa para hoje. Aproveite o seu tempo!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`group flex items-center gap-3 p-4 rounded-2xl border transition-all ${
            task.is_done
              ? "bg-slate-50 border-slate-100 opacity-60"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <button
            onClick={() => handleToggle(task.id, !task.is_done)}
            disabled={loadingId === task.id}
            className={`transition-colors ${
              task.is_done ? "text-green-500" : "text-slate-300 hover:text-blue-500"
            }`}
          >
            {loadingId === task.id ? (
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            ) : task.is_done ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          {editingId === task.id ? (
             <div className="flex-1 flex gap-2">
               <input
                 type="text"
                 value={editTitle}
                 onChange={(e) => setEditTitle(e.target.value)}
                 className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                 autoFocus
               />
               <button onClick={() => handleUpdate(task.id)} className="text-emerald-500">
                 <Check size={18} />
               </button>
               <button onClick={() => setEditingId(null)} className="text-slate-400">
                 <X size={18} />
               </button>
             </div>
          ) : (
            <span
              className={`flex-1 font-medium transition-all ${
                task.is_done ? "line-through text-slate-400" : "text-slate-700"
              }`}
            >
              {task.title}
            </span>
          )}

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => {
                setEditingId(task.id);
                setEditTitle(task.title);
              }}
              className="text-slate-300 hover:text-blue-500 p-2"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(task.id)}
              disabled={loadingId === task.id}
              className="text-slate-300 hover:text-red-500 p-2"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
