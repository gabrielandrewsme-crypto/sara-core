"use client";

import { useState, useEffect } from "react";
import { X, Bell, Trash2, Calendar as CalendarIcon, Clock, Tag } from "lucide-react";
import { format } from "date-fns";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialDate?: Date;
  event?: any;
}

export function EventModal({ isOpen, onClose, onSuccess, initialDate, event }: EventModalProps) {
  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [startAt, setStartAt] = useState(
    event?.start_at ? format(new Date(event.start_at), "yyyy-MM-dd'T'HH:mm") : 
    initialDate ? format(initialDate, "yyyy-MM-dd'T'10:00") : ""
  );
  const [endAt, setEndAt] = useState(
    event?.end_at ? format(new Date(event.end_at), "yyyy-MM-dd'T'HH:mm") : 
    initialDate ? format(initialDate, "yyyy-MM-dd'T'11:00") : ""
  );
  const [category, setCategory] = useState(event?.category || "pessoal");
  const [color, setColor] = useState(event?.color || "#3b82f6");
  const [remind30d, setRemind30d] = useState(event?.remind_30d ?? true);
  const [remind7d, setRemind7d] = useState(event?.remind_7d ?? true);
  const [remind1d, setRemind1d] = useState(event?.remind_1d ?? true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colors = [
    { name: "Azul", value: "#3b82f6" },
    { name: "Rosa", value: "#ec4899" },
    { name: "Laranja", value: "#f97316" },
    { name: "Verde", value: "#10b981" },
    { name: "Roxo", value: "#8b5cf6" },
    { name: "Cinza", value: "#64748b" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      title,
      description,
      start_at: startAt,
      end_at: endAt,
      category,
      color,
      remind_30d: remind30d,
      remind_7d: remind7d,
      remind_1d: remind1d,
    };

    try {
      const url = event ? `/api/agenda/${event.id}` : "/api/agenda";
      const method = event ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;
    
    try {
      const res = await fetch(`/api/agenda/${event.id}`, { method: "DELETE" });
      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <header className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {event ? "Editar Compromisso" : "Novo Compromisso"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} className="text-slate-400" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Título */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <CalendarIcon size={16} /> Título
            </label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Consulta Médica, Reunião de Projeto..."
              className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} /> Início
              </label>
              <input 
                type="datetime-local"
                required
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Clock size={16} /> Término
              </label>
              <input 
                type="datetime-local"
                required
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Categoria e Cor */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Tag size={16} /> Categoria
              </label>
              <div className="flex bg-slate-50 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setCategory("pessoal")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${category === 'pessoal' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Pessoal
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("trabalho")}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${category === 'trabalho' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                >
                  Trabalho
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Cor Visual</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-6 h-6 rounded-full transition-transform ${color === c.value ? 'scale-125 ring-2 ring-offset-2 ring-slate-300' : ''}`}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lembretes Estratégicos */}
          <div className="bg-blue-50 rounded-[24px] p-5 space-y-4">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
              <Bell size={14} /> Lembretes Sara Core
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">30 dias antes (E-mail + Push)</span>
                <input 
                  type="checkbox" 
                  checked={remind30d} 
                  onChange={(e) => setRemind30d(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">1 semana antes (Push)</span>
                <input 
                  type="checkbox" 
                  checked={remind7d} 
                  onChange={(e) => setRemind7d(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">24 horas antes (Alerta Urgente)</span>
                <input 
                  type="checkbox" 
                  checked={remind1d} 
                  onChange={(e) => setRemind1d(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-blue-200 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Rodapé do Modal */}
          <div className="pt-4 flex items-center gap-3">
            {event && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
              >
                <Trash2 size={24} />
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xl shadow-slate-200 active:scale-[0.98]"
            >
              {isSubmitting ? "Salvando..." : event ? "Salvar Alterações" : "Agendar Compromisso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
