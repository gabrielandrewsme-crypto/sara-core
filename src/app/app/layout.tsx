import { BottomNav } from "@/components/BottomNav";
import { NotificationRequest } from "@/components/NotificationRequest"; // component to request push perms

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen pb-16">
      <NotificationRequest />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
