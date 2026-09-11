import { LogIn, LogOut, MapPin, RotateCcw, Wrench } from "lucide-react";
import { logout, resetDemo, setRole, useStore } from "../store";

export function Header() {
  const { job, session } = useStore();

  return (
    <header className="sticky top-0 z-30 bg-forest text-white shadow-sm">
      <div className="flex items-center justify-between px-3 py-2.5">
        <button type="button" onClick={() => setRole("landing")} className="flex items-center gap-2 font-bold">
          <Wrench className="h-6 w-6 text-accent" />
          SEWA-SETU
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden items-center rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-800 sm:inline-flex">
            <MapPin className="mr-1 h-3.5 w-3.5 text-red-500" />
            Sector 14
          </span>
          <span className="rounded-full bg-accent px-2 py-1 text-[11px] font-bold text-slate-900">SIH 2026 DEMO</span>
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium hover:bg-white/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              {session.name.split(" ")[0]}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRole("landing")}
              className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium hover:bg-white/20"
            >
              <LogIn className="h-3.5 w-3.5" />
              Login
            </button>
          )}
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1.5 text-xs font-medium hover:bg-white/20"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>
      {job ? (
        <p className="border-t border-white/10 px-3 py-1 text-[11px] text-emerald-100">
          {job.id} · {job.status.replaceAll("_", " ")}
          {job.workerName ? ` · ${job.workerName}` : ""}
        </p>
      ) : null}
    </header>
  );
}
