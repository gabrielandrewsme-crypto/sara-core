import Link from "next/link";
import { Lock } from "lucide-react";

export default function BlockedPage() {
  const checkoutUrl = process.env.NEXT_PUBLIC_CAKTO_CHECKOUT_URL || "#";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100">
          <Lock className="h-10 w-10 text-blue-600" />
        </div>
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900">Acesso Bloqueado</h2>
          <p className="mt-4 text-slate-600 text-lg">
            Sua conta ainda não possui acesso ativo ao Sara Core. Ative seu plano para organizar sua rotina agora mesmo.
          </p>
        </div>
        
        <div className="pt-6">
          <Link 
            href={checkoutUrl}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Adquirir Acesso por R$ 14,90
          </Link>
        </div>
        <div className="mt-4">
           <Link href="/login" className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Fazer login com outra conta
           </Link>
        </div>
      </div>
    </div>
  );
}
