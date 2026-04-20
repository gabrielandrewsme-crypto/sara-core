import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL || "#";

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/icons/icon-192x192.png" width={32} height={32} alt="Sara Core Logo" className="rounded-xl" />
            <span className="font-bold text-xl tracking-tight text-slate-900">Sara Core</span>
          </div>
          <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Sua mente organizada,<br/>sem esforço.
          </h1>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
            O aplicativo desenhado para funcionar com você, não contra você. <br/>Perfeito para TDAH e mentes criativas que precisam de clareza.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href={checkoutUrl}
              className="w-full sm:w-auto bg-blue-600 text-white font-medium px-8 py-4 rounded-full flex items-center justify-center space-x-2 hover:bg-blue-700 transition shadow-lg shadow-blue-600/30 text-lg"
            >
              <span>Adquirir por R$ 14,90</span>
              <ArrowRight size={20} />
            </Link>
            <Link 
              href="/instalar"
              className="w-full sm:w-auto bg-white text-slate-700 font-medium px-8 py-4 rounded-full flex items-center justify-center space-x-2 border border-slate-200 hover:bg-slate-50 transition text-lg"
            >
              Como Instala (PWA)
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Tudo que você precisa em um app</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['Rotina Visual Diária', 'Integração Google Calendar', 'Mural Rápido de Tarefas', 'Notas Minimalistas', 'Controle Financeiro Descomplicado', 'Acesso super rápido Offline'].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <CheckCircle2 size={32} className="text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg text-slate-800 mb-2">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
