"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/esqueci-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });

    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/icons/icon-192x192.png" width={64} height={64} alt="Sara Core" className="rounded-2xl" />
        </Link>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-slate-900">
          Recuperar acesso
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Digite o email da sua conta — mandamos um link para você criar uma nova senha.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 shadow sm:rounded-2xl sm:px-10">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 text-2xl">
                ✓
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Verifique seu email</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Se houver uma conta cadastrada com <strong>{email}</strong>, você receberá um link para
                redefinir sua senha em instantes. O link expira em 1 hora.
              </p>
              <p className="text-xs text-slate-500">
                Não apareceu? Verifique a caixa de spam e o email digitado.
              </p>
              <Link
                href="/login"
                className="inline-block mt-4 text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Voltar ao login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || email.trim().length === 0}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Enviar link de recuperação"}
              </button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800">
                  Voltar ao login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
