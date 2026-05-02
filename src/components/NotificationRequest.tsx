"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeAndSave() {
  const registration = await navigator.serviceWorker.ready;

  // Reaproveita ou cria a subscription
  let subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
      ),
    });
  }

  const res = await fetch("/api/notifications/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });

  return res.ok;
}

export function NotificationRequest() {
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) return;

    try {
      const permission = await Notification.requestPermission();
      setPermissionState(permission);

      if (permission === "granted") {
        await subscribeAndSave();
      }
    } catch (error) {
      console.error("Erro ao ativar notificações:", error);
    }
  };

  const sendTest = async () => {
    setBusy(true);
    setTestStatus(null);
    try {
      // Garante que existe subscription registrada antes de testar
      await subscribeAndSave();

      const res = await fetch("/api/notifications/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setTestStatus(`Erro: ${data.error || res.status}`);
      } else {
        const ok = data.results.filter((r: any) => r.ok).length;
        const fail = data.total - ok;
        setTestStatus(
          fail === 0
            ? `Push enviado para ${ok} dispositivo(s). Aguarde alguns segundos.`
            : `Enviado para ${ok}, falhou em ${fail}. Veja o console.`
        );
        if (fail > 0) console.warn("Falhas no push de teste:", data.results);
      }
    } catch (err) {
      setTestStatus(`Erro: ${(err as Error).message}`);
    } finally {
      setBusy(false);
    }
  };

  if (permissionState === "denied") return null;

  if (permissionState === "granted") {
    return (
      <div className="bg-emerald-50 border-b border-emerald-100 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Bell size={16} className="text-emerald-600 flex-shrink-0" />
            <p className="text-xs text-emerald-800 truncate">
              {testStatus ?? "Notificações ativadas"}
            </p>
          </div>
          <button
            onClick={sendTest}
            disabled={busy}
            className="text-xs font-medium px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 rounded-full hover:bg-emerald-100 transition disabled:opacity-50 flex-shrink-0"
          >
            {busy ? "Testando..." : "Testar"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border-b border-blue-100 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Bell size={20} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-800">Ativar Notificações</p>
            <p className="text-xs text-slate-600">Para lembretes importantes!</p>
          </div>
        </div>
        <button
          onClick={requestPermission}
          className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-blue-700 transition"
        >
          Permitir
        </button>
      </div>
    </div>
  );
}
