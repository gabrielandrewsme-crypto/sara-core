import Link from "next/link";
import { ArrowLeft, Smartphone, Share, PlusSquare, MoreVertical, Download } from "lucide-react";

export default function InstalarPWA() {
  return (
    <main className="min-h-screen bg-slate-50 pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="p-2 -ml-2 text-slate-600 hover:text-slate-900 transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="ml-2 font-bold text-lg text-slate-900">Como Instalar o App</h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="bg-blue-600 rounded-3xl p-8 mb-10 text-white shadow-xl shadow-blue-600/20">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Download size={28} />
            </div>
            <span className="font-bold text-xl">Web App (PWA)</span>
          </div>
          <p className="text-blue-50 leading-relaxed">
            O Sara Core funciona como um aplicativo real, mas sem precisar da App Store ou Play Store. 
            Ele ocupa quase nenhum espaço e funciona offline!
          </p>
        </div>

        {/* iOS Section */}
        <section className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Smartphone size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">iPhone (iOS)</h2>
          </div>

          <div className="space-y-6">
            <Step 
              number="1" 
              text="Abra este site no navegador Safari." 
            />
            <Step 
              number="2" 
              icon={<Share size={20} className="text-blue-500" />}
              text="Toque no botão 'Compartilhar' (o ícone do quadrado com uma seta para cima na barra de baixo)." 
            />
            <Step 
              number="3" 
              icon={<PlusSquare size={20} className="text-slate-700" />}
              text="Role a lista para baixo e toque em 'Adicionar à Tela de Início'." 
            />
            <Step 
              number="4" 
              text="Toque em 'Adicionar' no canto superior direito. O ícone aparecerá na sua tela inicial!" 
            />
          </div>
        </section>

        {/* Android Section */}
        <section>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <Smartphone size={18} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Android (Chrome)</h2>
          </div>

          <div className="space-y-6">
            <Step 
              number="1" 
              text="Abra este site no navegador Google Chrome." 
            />
            <Step 
              number="2" 
              icon={<MoreVertical size={20} className="text-slate-700" />}
              text="Toque nos três pontinhos no canto superior direito." 
            />
            <Step 
              number="3" 
              icon={<Download size={20} className="text-green-600" />}
              text="Toque em 'Instalar Aplicativo' ou 'Adicionar à tela inicial'." 
            />
            <Step 
              number="4" 
              text="Confirme a instalação e o app aparecerá na sua lista de aplicativos!" 
            />
          </div>
        </section>

        <div className="mt-12 p-6 bg-slate-100 rounded-2xl text-center">
          <p className="text-slate-600 text-sm italic">
            Dica: Depois de instalado, você não precisará mais digitar o endereço do site. 
            Basta tocar no ícone na sua tela inicial para uma experiência de tela cheia.
          </p>
        </div>
      </div>
    </main>
  );
}

function Step({ number, text, icon }: { number: string; text: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-sm">
        {number}
      </div>
      <div className="flex-grow pt-1">
        <p className="text-slate-700 leading-tight flex items-center flex-wrap gap-2">
          {text}
          {icon && <span className="inline-block p-1 bg-white border border-slate-100 rounded-md shadow-xs">{icon}</span>}
        </p>
      </div>
    </div>
  );
}
