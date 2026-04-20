"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare, Calendar, Clock, BookText, Wallet } from "lucide-react";

const navItems = [
  { href: "/app/rotina", label: "Rotina", icon: Clock },
  { href: "/app/agenda", label: "Agenda", icon: Calendar },
  { href: "/app/tarefas", label: "Tarefas", icon: CheckSquare },
  { href: "/app/notas", label: "Notas", icon: BookText },
  { href: "/app/financas", label: "Finanças", icon: Wallet },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50"
         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex justify-around items-end h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              id={`nav-${item.label.toLowerCase()}`}
              className="flex flex-col items-center justify-center flex-1 h-full pt-2 pb-1 gap-0.5 transition-colors"
            >
              <div
                className={`flex items-center justify-center w-10 h-7 rounded-2xl transition-all duration-200
                  ${isActive ? "bg-blue-100" : "bg-transparent"}`}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-blue-600" : "text-slate-400"}
                />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors
                  ${isActive ? "text-blue-600" : "text-slate-400"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
