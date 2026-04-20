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

export function NotificationRequest() {
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");

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
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
          ),
        });

        await fetch("/api/notifications/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        console.log("Notificações configuradas com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao ativar notificações:", error);
    }
  };

  if (permissionState === "granted" || permissionState === "denied") return null;

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
