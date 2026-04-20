"use client";

import { useState } from "react";
import { SummaryCards } from "./SummaryCards";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Transaction } from "@prisma/client";
import { Plus } from "lucide-react";

interface FinanceClientProps {
  transactions: Transaction[];
}

export function FinanceClient({ transactions }: FinanceClientProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Grupos únicos (Tabelas)
  const groups = Array.from(new Set(transactions.map((t) => (t as any).group_name).filter(Boolean)));

  const filteredTransactions = selectedGroup 
    ? transactions.filter((t) => (t as any).group_name === selectedGroup)
    : transactions;

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pb-32">
      <header className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Finanças</h1>
          <p className="text-slate-500 mt-1">Controle seu fluxo de caixa e economize mais.</p>
        </div>
        {!isAdding && !editingTransaction && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 active:scale-95"
          >
            <Plus size={20} />
            Novo Registro
          </button>
        )}
      </header>
      
      {/* Filtros de "Tabelas" (Grupos) */}
      {groups.length > 0 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedGroup(null)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border ${!selectedGroup ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
          >
            Tudo
          </button>
          {groups.map((group) => (
            <button
              key={group as string}
              onClick={() => setSelectedGroup(group as string)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap border ${selectedGroup === group ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"}`}
            >
              {group as string}
            </button>
          ))}
        </div>
      )}

      <SummaryCards income={income} expense={expense} />

      {(isAdding || editingTransaction) && (
        <TransactionForm 
          onClose={() => { setIsAdding(false); setEditingTransaction(null); }} 
          initialData={editingTransaction || undefined}
        />
      )}

      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 px-1">
          {selectedGroup ? `Movimentações em "${selectedGroup}"` : "Movimentações Recentes"}
        </h2>
        <TransactionList 
          transactions={filteredTransactions} 
          onEdit={(t) => {
            setEditingTransaction(t);
            setIsAdding(false);
          }}
        />
      </section>
    </div>
  );
}
