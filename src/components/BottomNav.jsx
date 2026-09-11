import { Building2, House, Store, User, Wrench } from "lucide-react";
import { setRole, useStore } from "../store";

const TABS = [
  { id: "landing", label: "Overview", icon: House },
  { id: "client", label: "Customer", icon: User },
  { id: "worker", label: "Worker", icon: Wrench },
  { id: "merchant", label: "Merchant", icon: Store },
  { id: "admin", label: "Admin", icon: Building2 },
];

export function BottomNav() {
  const { role } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="mx-auto flex max-w-3xl justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = role === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setRole(tab.id)}
              className={`flex min-w-0 flex-1 flex-col items-center py-2 text-[11px] ${
                active ? "font-bold text-forest" : "text-slate-500"
              }`}
            >
              <Icon className="mb-0.5 h-5 w-5" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
