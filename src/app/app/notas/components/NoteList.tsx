"use client";

import { Note } from "@prisma/client";
import { useState } from "react";
import { NoteForm } from "./NoteForm";
import { deleteNote } from "../actions";
import { Plus, Trash2, Edit3, Calendar, FileText } from "lucide-react";

interface NoteListProps {
  initialNotes: Note[];
}

export function NoteList({ initialNotes }: NoteListProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
    try {
      await deleteNote(id);
    } catch (error) {
      alert("Erro ao excluir nota");
    }
  }

  return (
    <div className="pb-24">
      {/* Botão Adicionar */}
      {!isAdding && !editingNote && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full flex items-center justify-center gap-2 py-4 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition shadow-lg shadow-amber-500/20 mb-8 active:scale-95"
        >
          <Plus size={24} />
          Nova Nota / Insight
        </button>
      )}

      {/* Formulário (Adição ou Edição) */}
      {(isAdding || editingNote) && (
        <NoteForm
          initialData={editingNote}
          onClose={() => {
            setIsAdding(false);
            setEditingNote(null);
          }}
        />
      )}

      {/* Grid de Notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {initialNotes.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-20 px-6 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FileText className="text-slate-300" size={32} />
            </div>
            <h3 className="font-bold text-slate-700 text-lg">Seu mural está limpo</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              Clique em "+ Nova Nota" para começar a organizar seus pensamentos.
            </p>
          </div>
        )}

        {initialNotes.map((note) => (
          <div
            key={note.id}
            className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-amber-600 transition truncate pr-4">
                {note.title}
              </h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => setEditingNote(note)}
                  className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed flex-1 line-clamp-4 whitespace-pre-wrap mb-4">
              {note.body}
            </p>

            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-auto pt-4 border-t border-slate-50">
              <Calendar size={12} />
              {new Date(note.updated_at).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
