"use client";

import { Transaction } from "@prisma/client";
import { deleteTransaction } from "../actions";
import { Trash2, ArrowUpRight, ArrowDownRight, Tag, Repeat, Layers, Edit2 } from "lucide-react";

interface ListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
}

export function TransactionList({ transactions, onEdit }: ListProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  async function handleDelete(id: string) {
    if (!confirm("Excluir este registro financeiro?")) return;
    try {
      await deleteTransaction(id);
    } catch (error) {
      alert("Erro ao excluir");
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
        <p className="text-slate-400 font-medium">Nenhuma movimentação registrada.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((t) => (
        <div
          key={t.id}
          className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-sm transition group"
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === "income" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
            {t.type === "income" ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 truncate">{t.description || t.category}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="flex items-center gap-1">
                <Tag size={10} />
                {t.category}
              </span>
              {(t as any).group_name && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    <Layers size={10} />
                    {(t as any).group_name}
                  </span>
                </>
              )}
              <span>•</span>
              {(t as any).is_recurring && (
                <span className="text-amber-600 bg-amber-50 p-0.5 rounded flex items-center gap-0.5" title={`Recorrente: ${(t as any).frequency}`}>
                  <Repeat size={10} />
                </span>
              )}
              <span>
                {new Date(t.date).toLocaleDateString("pt-BR")}
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <p className={`font-bold text-lg ${t.type === "income" ? "text-emerald-600" : "text-red-600"}`}>
              {t.type === "income" ? "+" : "-"} {formatCurrency(t.amount)}
            </p>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => onEdit(t)}
                className="text-slate-300 hover:text-blue-500 p-1"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-slate-300 hover:text-red-500 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
