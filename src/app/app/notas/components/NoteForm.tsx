"use client";

import { useState } from "react";
import { saveNote } from "../actions";
import { Loader2, X, Check } from "lucide-react";

interface NoteFormProps {
  initialData?: { id: string; title: string; body: string } | null;
  onClose: () => void;
}

export function NoteForm({ initialData, onClose }: NoteFormProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    try {
      await saveNote(initialData?.id || null, title, body);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar nota");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-6">
      <div className="bg-amber-500 px-5 py-4 flex justify-between items-center text-white">
        <div>
          <h3 className="font-bold text-lg">
            {initialData ? "Editar Nota" : "Nova Nota"}
          </h3>
          <p className="text-amber-100 text-xs">Capture seus insights e ideias</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-amber-600 rounded-lg transition">
          <X size={20} />
        </button>
      </div>

      <form action={handleSubmit} className="p-5 space-y-4">
        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Título</label>
          <input
            type="text"
            name="title"
            placeholder="Dê um título para sua nota..."
            required
            defaultValue={initialData?.title}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 font-semibold"
          />
        </div>

        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Conteúdo</label>
          <textarea
            name="body"
            placeholder="Comece a escrever..."
            required
            rows={6}
            defaultValue={initialData?.body}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-slate-500 font-medium border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check size={20} />
                {initialData ? "Atualizar" : "Salvar Nota"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
