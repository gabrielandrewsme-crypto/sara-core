"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function AtivarPage() {
  const router = useRouter();
  const { update } = useSession();
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/ativar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: key.trim() }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.error || "Chave inválida. Verifique e tente novamente.");
      setLoading(false);
      return;
    }

    // Refresh JWT so middleware sees is_active=true on the next request
    await update({ is_active: true });
    router.replace("/app/rotina");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <VesicaPiscis className="mx-auto mb-10" />

        <h1 className="text-xl font-medium tracking-tight text-slate-100 mb-2">
          Ative sua versão Core.
        </h1>
        <p className="text-sm text-slate-400 mb-10">
          Insira abaixo a chave de acesso fornecida.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            autoFocus
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="SARA-XXXXX-XXXX"
            aria-label="Chave de acesso"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-center tracking-widest text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/30 transition"
          />

          {error && (
            <p className="text-sm text-rose-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || key.trim().length === 0}
            className="w-full py-3 rounded-xl font-medium text-slate-950 bg-sky-300 hover:bg-sky-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? "Ativando..." : "Ativar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="mt-10 text-xs text-slate-500 hover:text-slate-300 transition"
        >
          Sair da conta
        </button>
      </div>
    </main>
  );
}

function VesicaPiscis({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 80"
      width="96"
      height="64"
      className={className}
      aria-hidden="true"
    >
      <circle cx="45" cy="40" r="30" fill="none" stroke="#7dd3fc" strokeWidth="1.25" />
      <circle cx="75" cy="40" r="30" fill="none" stroke="#7dd3fc" strokeWidth="1.25" />
    </svg>
  );
}
