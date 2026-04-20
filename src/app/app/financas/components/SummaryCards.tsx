import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryProps {
  income: number;
  expense: number;
}

export function SummaryCards({ income, expense }: SummaryProps) {
  const balance = income - expense;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Saldo */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Wallet size={20} />
          </div>
          <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">Saldo Geral</span>
        </div>
        <p className={`text-3xl font-extrabold ${balance >= 0 ? "text-slate-900" : "text-red-600"}`}>
          {formatCurrency(balance)}
        </p>
      </div>

      {/* Receitas */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">Entradas</span>
        </div>
        <p className="text-3xl font-extrabold text-emerald-600">
          {formatCurrency(income)}
        </p>
      </div>

      {/* Despesas */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
            <TrendingDown size={20} />
          </div>
          <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">Saídas</span>
        </div>
        <p className="text-3xl font-extrabold text-red-600">
          {formatCurrency(expense)}
        </p>
      </div>
    </div>
  );
}
