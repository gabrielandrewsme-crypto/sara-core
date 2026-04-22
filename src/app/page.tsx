import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles, CalendarRange, ListChecks, NotebookText, Wallet, WifiOff } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="bg-slate-950 text-slate-100 min-h-screen">
      <Hero />
      <Manifesto />
      <Features />
      <Cta />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <Image
        src="/menino-landing.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Gradient overlay — darker on edges for legibility, transparent on center */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 via-transparent to-slate-950/60" />

      {/* Top bar */}
      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Image src="/icons/icon-192x192.png" width={28} height={28} alt="" className="rounded-lg" />
            <span className="text-xs tracking-[0.3em] uppercase text-slate-200">Sara Core</span>
          </div>
          <Link
            href="/login"
            className="text-xs tracking-[0.2em] uppercase text-slate-300 hover:text-white transition"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Editorial composition */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 pt-12 pb-28 sm:pt-24 sm:pb-40">
        {/* Vertical label (desktop only) */}
        <div className="hidden lg:block absolute left-10 top-1/2 -translate-y-1/2 rotate-180 [writing-mode:vertical-rl]">
          <span className="text-[10px] tracking-[0.5em] uppercase text-slate-400">
            Sistema de organização · desde 2026
          </span>
        </div>

        {/* Accent block + tagline */}
        <div className="flex items-center gap-0 mb-10 sm:mb-14">
          <span className="inline-block h-8 w-16 sm:h-10 sm:w-24 bg-sky-300" aria-hidden />
          <span className="ml-[-8px] bg-slate-950/80 backdrop-blur-sm px-3 py-1 text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-200">
            Para mentes que pensam demais
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-6xl sm:text-8xl md:text-[9rem] leading-[0.95] tracking-tight text-white">
          Sua mente,
          <br />
          <span className="italic font-light text-sky-200">em órbita.</span>
        </h1>
        <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-300 mt-6 sm:mt-8 max-w-xl">
          Seu tempo, <span className="italic text-sky-200">em ordem.</span>
        </p>

        {/* Quote + circle */}
        <div className="mt-14 sm:mt-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-10">
          <p className="font-serif italic text-lg sm:text-xl text-slate-200 max-w-sm leading-relaxed">
            &ldquo;A ordem não é rigidez. É o espaço onde o caos criativo enfim respira.&rdquo;
          </p>

          <Link
            href="/login"
            className="group relative flex items-center justify-center w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-sky-300/60 hover:border-sky-200 transition shrink-0 self-start sm:self-end"
            aria-label="Entre em Sara Core"
          >
            <div className="text-center">
              <ArrowUpRight className="mx-auto mb-2 text-sky-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" size={22} />
              <span className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-slate-100">
                Entre em<br />Sara Core
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Manifesto() {
  return (
    <section className="relative py-32 px-6 sm:px-10 border-t border-slate-900">
      <div className="max-w-3xl mx-auto">
        <span className="block text-[10px] tracking-[0.5em] uppercase text-sky-300 mb-6">
          Manifesto
        </span>
        <p className="font-serif text-3xl sm:text-4xl md:text-5xl leading-snug text-slate-100">
          O mundo inventou apps cheios de <em className="italic text-sky-200">notificações</em>,
          <em className="italic text-sky-200"> badges</em> e <em className="italic text-sky-200">dashboards</em>
          &nbsp;— e esqueceu que o objetivo era um só: <strong className="font-medium">liberar sua mente</strong>.
        </p>
        <p className="mt-8 text-slate-400 leading-relaxed max-w-xl">
          Sara Core é o oposto de tudo isso. Uma ferramenta silenciosa, feita pra quem tem TDAH,
          hiperfoco, ou simplesmente cansou do excesso. Rotina, agenda, notas e finanças —
          em um só lugar, sem ruído.
        </p>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: Sparkles, title: "Rotina visual", copy: "Blocos diários com horário, categoria e duração. Você vê o dia antes dele começar." },
    { icon: CalendarRange, title: "Agenda inteligente", copy: "Eventos com lembretes em 30 dias, 7 dias e 1 dia. Nada foge do radar." },
    { icon: ListChecks, title: "Mural de tarefas", copy: "Captura rápida, sem fricção. Pra não perder a ideia no momento em que ela aparece." },
    { icon: NotebookText, title: "Notas minimalistas", copy: "Sem tags, sem pastas, sem ritual. Escreve e pronto." },
    { icon: Wallet, title: "Finanças descomplicadas", copy: "Entradas, saídas e recorrências. Visual direto, sem planilha." },
    { icon: WifiOff, title: "Funciona offline", copy: "PWA instalável. Carrega rápido mesmo sem sinal." },
  ];

  return (
    <section className="relative py-28 px-6 sm:px-10 border-t border-slate-900 bg-slate-950">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 gap-6">
          <div>
            <span className="block text-[10px] tracking-[0.5em] uppercase text-sky-300 mb-4">
              O Que Vem Dentro
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-white">Tudo em um só cosmos.</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-900">
          {items.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="bg-slate-950 p-8 hover:bg-slate-900/60 transition">
              <Icon size={22} className="text-sky-300 mb-5" strokeWidth={1.5} />
              <h3 className="font-serif text-xl text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="relative py-32 px-6 sm:px-10 border-t border-slate-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-4xl sm:text-6xl text-white leading-tight mb-8">
          Está na hora de <em className="italic text-sky-200">aterrissar</em>.
        </h2>
        <p className="text-slate-400 mb-12 max-w-lg mx-auto">
          Instale o app na tela inicial. Use como se sempre tivesse estado lá.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login"
            className="group w-full sm:w-auto bg-sky-300 text-slate-950 font-medium px-10 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-sky-200 transition"
          >
            <span className="tracking-wide">Entrar na minha conta</span>
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </Link>
          <Link
            href="/instalar"
            className="w-full sm:w-auto border border-slate-700 text-slate-200 px-10 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-slate-900 transition"
          >
            Como Instalar (PWA)
          </Link>
        </div>
        <p className="mt-16 text-[10px] tracking-[0.4em] uppercase text-slate-600">
          Sara Core · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
