"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import type { Role } from "@/lib/types";

const ROLES: { id: Role; label: string; href: string }[] = [
  { id: "client", label: "Client", href: "/client" },
  { id: "worker", label: "Worker", href: "/worker" },
  { id: "admin", label: "Admin", href: "/admin" },
];

export function AppChrome({ children, title }: { children: React.ReactNode; title?: string }) {
  const { session, locale, setLocale, switchRole, resetSeed, hydrated, loginAs } = useServit();
  const router = useRouter();
  const path = usePathname();
  const t = copy[locale];

  useEffect(() => {
    if (!hydrated) return;
    if (path.startsWith("/worker")) loginAs("worker");
    else if (path.startsWith("/admin")) loginAs("admin");
    else if (path.startsWith("/client")) loginAs("client");
  }, [hydrated, path, loginAs]);

  if (!hydrated) {
    return <div className="p-6 text-sm text-slate-500">Loading Servit…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-3 py-2">
          <Logo light />
          <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-green-300 sm:inline">
            SIH26089
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button
              className="rounded-lg bg-white/10 px-2 py-1 text-xs font-bold"
              onClick={() => setLocale(locale === "en" ? "hi" : "en")}
            >
              {locale === "en" ? "HI" : "EN"}
            </button>
            {ROLES.map((r) => (
              <button
                key={r.id}
                className={`rounded-lg px-2 py-1 text-xs font-semibold ${
                  session?.role === r.id ? "bg-forest" : "bg-white/10"
                }`}
                onClick={() => {
                  switchRole(r.id);
                  router.push(r.href);
                }}
              >
                {r.label}
              </button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-white/20 bg-transparent text-white hover:bg-white/10"
              onClick={() => {
                resetSeed();
                router.push("/client/new");
              }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>
        {title ? (
          <div className="border-t border-white/10 bg-navy/80 px-3 py-1 text-center text-xs text-slate-200">
            {title} · {t.escrow}
          </div>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-6xl px-3 py-4">{children}</main>
      {session && !path.startsWith("/admin") ? (
        <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] text-xs font-semibold text-slate-500">
          {ROLES.map((r) => (
            <Link
              key={r.id}
              href={r.href}
              onClick={() => switchRole(r.id)}
              className={`py-3 text-center ${path.startsWith("/" + r.id) ? "text-forest" : ""}`}
            >
              {r.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
