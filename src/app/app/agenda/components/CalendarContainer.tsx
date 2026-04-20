"use client";

import { useState, useEffect } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock,
  Briefcase,
  User as UserIcon,
  Bell,
  Edit2
} from "lucide-react";
import { EventModal } from "./EventModal";

export function CalendarContainer() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentMonth]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/agenda");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEvents(data);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const onDateClick = (day: Date) => setSelectedDate(day);

  const handleOpenModal = (event?: any) => {
    setEditingEvent(event || null);
    setIsModalOpen(true);
  };

  // Lógica do Grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  return (
    <div className="space-y-6">
      {/* Header do Calendário */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 capitalize">
              {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Hoje
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-slate-50 rounded-xl border border-slate-100 transition-colors"
          >
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Grid do Calendário */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {dayNames.map((name) => (
            <div key={name} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {name}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayEvents = events.filter(e => isSameDay(new Date(e.start_at), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isSelected = isSameDay(day, selectedDate);
            const today = isToday(day);

            return (
              <div 
                key={day.toString()} 
                onClick={() => onDateClick(day)}
                className={`min-h-[90px] p-2 border-r border-b border-slate-50 relative transition-all cursor-pointer hover:bg-blue-50/30 ${
                  !isCurrentMonth ? "opacity-30 bg-slate-50/30" : ""
                } ${isSelected ? "bg-blue-50/50" : ""}`}
              >
                <span className={`text-sm font-semibold ${
                  today ? "h-7 w-7 bg-blue-600 text-white rounded-full flex items-center justify-center -mt-1 -ml-1" : 
                  isSelected ? "text-blue-600" : "text-slate-700"
                }`}>
                  {format(day, "d")}
                </span>

                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div 
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenModal(event);
                      }}
                      className="text-[9px] px-1.5 py-0.5 rounded-md truncate font-medium text-white shadow-sm"
                      style={{ backgroundColor: event.color || "#3b82f6" }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[8px] text-slate-400 font-bold ml-1">
                      +{dayEvents.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lista de Eventos do Dia Selecionado */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-slate-900 font-bold flex items-center gap-2">
            Compromissos de {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={18} />
            Novo
          </button>
        </div>

        {events.filter(e => isSameDay(new Date(e.start_at), selectedDate)).length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
            <p className="text-slate-400 text-sm">Nenhum compromisso marcado para este dia.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {events.filter(e => isSameDay(new Date(e.start_at), selectedDate)).map((event) => (
              <div 
                key={event.id}
                onClick={() => handleOpenModal(event)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 transition-all group cursor-pointer flex items-center gap-4"
              >
                <div 
                  className="w-1.5 h-10 rounded-full" 
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock size={12} />
                      {format(new Date(event.start_at), "HH:mm")}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 capitalize">
                      {event.category === 'trabalho' ? <Briefcase size={12} /> : <UserIcon size={12} />}
                      {event.category}
                    </span>
                    {(event.remind_30d || event.remind_7d || event.remind_1d) && (
                      <span className="text-[10px] text-blue-500 font-medium flex items-center gap-1">
                        <Bell size={12} />
                        Lembretes ativos
                      </span>
                    )}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all text-slate-300 hover:text-blue-500 p-1">
                  <Edit2 size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <EventModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchEvents}
          event={editingEvent}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}
