"use client";

import { useTransition, useRef, useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  Flame,
  Zap,
  BookOpen,
  Droplets,
  Heart,
  Dumbbell,
  ChevronDown,
  Edit2,
} from "lucide-react";
import { createRoutine, toggleRoutineCompletion, deleteRoutine, updateRoutine } from "../actions";

// ──────────────────────────────────────
// TIPOS
// ──────────────────────────────────────
type RoutineData = {
  id: string;
  title: string;
  time: string;
  days_of_week: number[];
  isCompletedToday: boolean;
  category: string;
};

// ──────────────────────────────────────
// CONSTANTES
// ──────────────────────────────────────
const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const CATEGORIES: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  saude: {
    label: "Saúde",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: <Heart size={16} />,
  },
  exercicio: {
    label: "Exercício",
    color: "text-orange-700",
    bg: "bg-orange-100",
    icon: <Dumbbell size={16} />,
  },
  aprendizado: {
    label: "Aprendizado",
    color: "text-violet-700",
    bg: "bg-violet-100",
    icon: <BookOpen size={16} />,
  },
  hidratacao: {
    label: "Hidratação",
    color: "text-sky-700",
    bg: "bg-sky-100",
    icon: <Droplets size={16} />,
  },
  foco: {
    label: "Foco",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <Zap size={16} />,
  },
  default: {
    label: "Geral",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: <Flame size={16} />,
  },
};

// ──────────────────────────────────────
// HEADER COM SAUDAÇÃO
// ──────────────────────────────────────
function GreetingHeader({ completed, total }: { completed: number; total: number }) {
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Bom dia ☀️" : hour < 18 ? "Boa tarde 🌤️" : "Boa noite 🌙";
  const todayLabel = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mb-6">
      <p className="text-slate-400 text-sm capitalize">{todayLabel}</p>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
        {greeting}
      </h1>

      {total > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1">
            <span>Progresso de hoje</span>
            <span className="font-semibold">
              {completed}/{total} hábitos
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          {progress === 100 && (
            <p className="text-emerald-600 text-xs font-semibold mt-1 text-center">
              🎉 Rotina completa! Incrível!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// FORMULÁRIO DE NOVO BLOCO
// ──────────────────────────────────────
function NewRoutineForm({
  onClose,
  isPending,
  formRef,
  initialData,
  onSubmit,
}: {
  onClose: () => void;
  isPending: boolean;
  formRef: React.RefObject<HTMLFormElement | null>;
  initialData?: any;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.days_of_week ?? [0, 1, 2, 3, 4, 5, 6]
  );
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category ?? "default");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const cat = CATEGORIES[selectedCategory];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4">
        <h3 className="font-bold text-white text-lg">{initialData?.id ? "Editar Bloco" : "Novo Bloco de Tempo"}</h3>
        <p className="text-blue-100 text-sm">{initialData?.id ? "Ajuste os detalhes da sua rotina" : "Crie um hábito para a sua rotina"}</p>
      </div>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="p-5 space-y-4"
      >
        {/* Título */}
        <input
          type="text"
          name="title"
          placeholder="Ex: Ler 10 páginas, Meditar, Beber água"
          required
              defaultValue={initialData?.title}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800 placeholder-slate-400"
            />
    
            {/* Horário + Duração */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-slate-500 font-medium mb-1 block">Horário</label>
                <input
                  type="time"
                  name="time"
                  required
                  defaultValue={initialData?.time}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800"
                />
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-medium mb-1 block">
              Duração (min)
            </label>
            <select
              name="duration"
              defaultValue={initialData?.duration ?? "30"}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-800"
            >
              {[5, 10, 15, 20, 30, 45, 60, 90, 120].map((v) => (
                <option key={v} value={v.toString()}>
                  {v} min
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label className="text-xs text-slate-500 font-medium mb-1 block">Categoria</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-slate-200 ${cat.bg} transition`}
            >
              <span className={`flex items-center gap-2 font-medium ${cat.color}`}>
                {cat.icon}
                {cat.label}
              </span>
              <ChevronDown size={16} className={cat.color} />
            </button>
            {showCategoryPicker && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                {Object.entries(CATEGORIES).map(([key, c]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(key);
                      setShowCategoryPicker(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition ${
                      selectedCategory === key ? "bg-slate-50 font-semibold" : ""
                    }`}
                  >
                    <span className={`${c.bg} ${c.color} p-1 rounded-lg`}>{c.icon}</span>
                    <span className="text-slate-700">{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <input type="hidden" name="category" value={selectedCategory} />
        </div>

        {/* Dias da semana */}
        <div>
          <label className="text-xs text-slate-500 font-medium mb-2 block">
            Repetir nos dias
          </label>
          <div className="flex gap-1.5">
            {DAYS.map((label, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => toggleDay(idx)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition
                  ${
                    selectedDays.includes(idx)
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-500"
                  }`}
              >
                {label.charAt(0)}
              </button>
            ))}
          </div>
          <input type="hidden" name="days_of_week" value={selectedDays.join(",")} />
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-slate-500 font-medium border border-slate-200 rounded-2xl hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending || selectedDays.length === 0}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isPending ? "Salvando..." : (initialData?.id ? "Salvar" : "Adicionar")}
          </button>
        </div>
      </form>
    </div>
  );
}

// ──────────────────────────────────────
// CARD DE BLOCO DE TEMPO
// ──────────────────────────────────────
function RoutineCard({
  routine,
  onToggle,
  onDelete,
  onEdit,
  isPending,
}: {
  routine: RoutineData;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isPending: boolean;
}) {
  const cat = CATEGORIES[routine.category] ?? CATEGORIES.default;
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={`relative flex items-center p-4 pr-5 rounded-3xl border transition-all duration-200 select-none
        ${
          routine.isCompletedToday
            ? "bg-blue-50 border-blue-200"
            : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-md"
        }
        ${isPending ? "opacity-60" : ""}`}
      id={`routine-${routine.id}`}
    >
      {/* Indicador de categoria */}
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center mr-4 ${cat.bg} ${cat.color}`}
      >
        {cat.icon}
      </div>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-base leading-tight truncate ${
            routine.isCompletedToday ? "text-blue-700 line-through" : "text-slate-800"
          }`}
        >
          {routine.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} />
            {routine.time}
          </span>
          <span className={`text-xs font-medium ${cat.color} ${cat.bg} px-2 py-0.5 rounded-full`}>
            {cat.label}
          </span>
        </div>
        {/* Dias */}
        <div className="flex gap-0.5 mt-2">
          {DAYS.map((d, i) => (
            <span
              key={i}
              className={`text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full
                ${
                  routine.days_of_week.includes(i)
                    ? "bg-blue-100 text-blue-600"
                    : "text-slate-300"
                }`}
            >
              {d.charAt(0)}
            </span>
          ))}
        </div>
      </div>

      {/* Checkbox de conclusão */}
      <button
        onClick={onToggle}
        className="ml-3 flex-shrink-0 transition-transform active:scale-90"
        aria-label="Marcar como concluído"
        id={`check-${routine.id}`}
      >
        {routine.isCompletedToday ? (
          <CheckCircle2 size={32} className="text-blue-500 drop-shadow-sm" />
        ) : (
          <Circle size={32} className="text-slate-300" />
        )}
      </button>

      {/* Edit */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="ml-2 text-slate-300 hover:text-blue-500 transition"
        aria-label="Editar bloco"
      >
        <Edit2 size={16} />
      </button>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowDelete(!showDelete);
        }}
        className="ml-2 text-slate-300 hover:text-red-400 transition"
        aria-label="Remover bloco"
      >
        <Trash2 size={16} />
      </button>

      {/* Confirm delete */}
      {showDelete && (
        <div className="absolute inset-0 bg-red-50 border border-red-200 rounded-3xl flex items-center justify-center gap-3 z-10">
          <p className="text-sm text-red-700 font-medium">Remover este hábito?</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              setShowDelete(false);
            }}
            className="bg-red-500 text-white text-sm px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition"
          >
            Sim
          </button>
          <button
            onClick={() => setShowDelete(false)}
            className="text-slate-500 text-sm px-3 py-2 rounded-xl hover:bg-slate-100 transition"
          >
            Não
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────
// MAIN CLIENT
// ──────────────────────────────────────
export function RoutineClient({ routines, searchParams }: { routines: RoutineData[]; searchParams?: any }) {
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  // Captura os dados iniciais da URL (se houver)
  const [initialDataFromUrl] = useState(() => {
    if (!searchParams) return null;
    
    const { title, time, duration, category, days_of_week } = searchParams;
    
    if (title || time) {
      return {
        title: title || "",
        time: time || "",
        duration: duration || "30",
        category: category || "default",
        days_of_week: days_of_week 
          ? days_of_week.split(",").map(Number).filter((n: any) => !isNaN(n))
          : [0, 1, 2, 3, 4, 5, 6]
      };
    }
    return null;
  });

  // Auto-abre o form se houver dados iniciais (após mount)
  useEffect(() => {
    if (initialDataFromUrl) {
      setShowForm(true);
    }
  }, [initialDataFromUrl]);

  const completed = routines.filter((r) => r.isCompletedToday).length;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      if (editingRoutine) {
        updateRoutine(editingRoutine.id, formData);
      } else {
        createRoutine(formData);
      }
      formRef.current?.reset();
      setShowForm(false);
      setEditingRoutine(null);
      // Limpa a URL para remover os params após salvar (opcional, mas evita re-abrir ao dar refresh)
      window.history.replaceState({}, "", window.location.pathname);
    });
  };

  const [editingRoutine, setEditingRoutine] = useState<RoutineData | null>(null);

  return (
    <div className="pb-32 space-y-5">
      <GreetingHeader completed={completed} total={routines.length} />

      {/* Botão Adicionar */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          id="add-routine-btn"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition shadow-md shadow-blue-600/20 active:scale-98"
        >
          <Plus size={20} />
          Novo Bloco de Tempo
        </button>
      )}

      {/* Formulário	*/}
      {(showForm || editingRoutine) && (
        <NewRoutineForm
          onClose={() => {
            setShowForm(false);
            setEditingRoutine(null);
          }}
          isPending={isPending}
          formRef={formRef}
          initialData={editingRoutine || initialDataFromUrl}
          onSubmit={handleSubmit}
        />
      )}

      {/* Empty state */}
      {routines.length === 0 && !showForm && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame size={36} className="text-blue-400" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg">Sua rotina está vazia</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
            Adicione seus hábitos e blocos de tempo para criar uma rotina poderosa.
          </p>
        </div>
      )}

      {/* Lista de blocos */}
      <div className="space-y-3">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            routine={routine}
            isPending={isPending}
            onToggle={() => {
              startTransition(() => {
                toggleRoutineCompletion(routine.id, !routine.isCompletedToday);
              });
            }}
            onDelete={() => {
              startTransition(() => {
                deleteRoutine(routine.id);
              });
            }}
            onEdit={() => {
              setEditingRoutine(routine);
              setShowForm(false);
            }}
          />
        ))}
      </div>
    </div>
  );
}
