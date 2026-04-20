"use client";

import { useState } from "react";
import { addTransaction, updateTransaction } from "../actions";
import { Plus, Loader2, X, Save } from "lucide-react";
import { Transaction } from "@prisma/client";

export function TransactionForm({ 
  onClose, 
  initialData 
}: { 
  onClose: () => void;
  initialData?: Transaction;
}) {
  const [isPending, setIsPending] = useState(false);
  const [type, setType] = useState<"income" | "expense">((initialData?.type as any) || "expense");
  const [isRecurring, setIsRecurring] = useState((initialData as any)?.is_recurring || false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      if (initialData) {
        await updateTransaction(initialData.id, formData);
      } else {
        await addTransaction(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar transação");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden mb-8 animate-in zoom-in-95 duration-200">
      <div className={`px-5 py-4 flex justify-between items-center text-white transition-colors ${type === "income" ? "bg-emerald-600" : "bg-red-600"}`}>
        <div>
          <h3 className="font-bold text-lg">{initialData ? "Editar Transação" : "Nova Transação"}</h3>
          <p className={`${type === "income" ? "text-emerald-100" : "text-red-100"} text-xs uppercase font-bold tracking-widest`}>
            {type === "income" ? "Entrada" : "Saída"}
          </p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg transition">
          <X size={20} />
        </button>
      </div>

      <form action={handleSubmit} className="p-5 space-y-4">
        {/* Toggle Tipo */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${type === "expense" ? "bg-white text-red-600 shadow-sm" : "text-slate-500"}`}
          >
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-sm font-bold rounded-xl transition ${type === "income" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500"}`}
          >
            Receita
          </button>
          <input type="hidden" name="type" value={type} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Descrição</label>
            <input
              type="text"
              name="description"
              defaultValue={initialData?.description || ""}
              placeholder="Ex: Supermercado, Aluguel, Freelance..."
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Valor (R$)</label>
            <input
              type="number"
              name="amount"
              step="0.01"
              defaultValue={initialData?.amount || ""}
              placeholder="0,00"
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
            />
          </div>

          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Categoria</label>
            <select
              name="category"
              defaultValue={initialData?.category || "Alimentação"}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
              <option value="Educação">Educação</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Casa">Casa</option>
              <option value="Outros">Outros</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Data</label>
            <input
              type="date"
              name="date"
              required
              defaultValue={initialData ? new Date(initialData.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
            />
          </div>
        </div>

        {/* Recorrência e Grupo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
             <input 
               type="checkbox" 
               name="is_recurring" 
               id="is_recurring"
               value="true"
               checked={isRecurring}
               onChange={(e) => setIsRecurring(e.target.checked)}
               className="w-5 h-5 rounded-lg text-blue-600 focus:ring-blue-500 cursor-pointer"
             />
             <label htmlFor="is_recurring" className="text-sm font-semibold text-slate-700 cursor-pointer">Conta Recorrente?</label>
          </div>

          {isRecurring && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="text-xs text-slate-500 font-medium mb-1 block">Frequência</label>
              <select
                name="frequency"
                defaultValue={(initialData as any)?.frequency || "monthly"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
              >
                <option value="monthly">Mensal</option>
                <option value="weekly">Semanal</option>
                <option value="yearly">Anual</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-slate-500 font-medium mb-1 block">Grupo / Tabela (Opcional)</label>
            <input
              type="text"
              name="group_name"
              defaultValue={(initialData as any)?.group_name || ""}
              placeholder="Ex: Assinaturas, Contas Fixas..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-400 text-slate-800"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
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
            className={`flex-1 py-3 text-white font-bold rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2 ${type === "income" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                {initialData ? <Save size={20} /> : <Plus size={20} />}
                {initialData ? "Salvar Alterações" : "Registrar"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
