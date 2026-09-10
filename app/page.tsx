"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Handshake, Mic, Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";

const cards = [
  {
    icon: Mic,
    title: "Client — Voice/Video Intake and Trust.",
    body: "AI diagnosis identifies skills and SKUs. Live tracking, UPI escrow, and secure OTP confirmation.",
    href: "/client",
    role: "client" as const,
    cta: "Open Client demo",
  },
  {
    icon: Handshake,
    title: "Worker — Certified Cooperative Members.",
    body: "Geo-alerts (~3 km match). QR material handover, offline sync, and 100 percent fair wage retention.",
    href: "/worker",
    role: "worker" as const,
    cta: "Open Worker demo",
  },
  {
    icon: Building2,
    title: "Admin — Society Governance.",
    body: "Dashboard for KYC, fair-wage rules, roster forecasting, and digital dispute resolution.",
    href: "/admin",
    role: "admin" as const,
    cta: "Open Admin demo",
  },
];

const rows = [
  ["Ownership", "VC-Funded Extraction", "Society-Owned Infrastructure"],
  ["Fees", "20-30% Commission Take", "Flat Rs 50 Platform Fee"],
  ["Goal", "Profit Extraction", "Worker Welfare and Fair Wages"],
  ["Structure", "Independent Contractors", "Verified Cooperative Members"],
];

export default function Landing() {
  const loginAs = useServit((s) => s.loginAs);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="rounded-full bg-green-100 px-2 py-1 text-forest">SIH 2026 · SIH26089</span>
            <Link href="/login" className="text-navy">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-forest">
          Agriculture, FoodTech & Rural Development
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
          Cooperative-owned hyperlocal services and materials.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-600">
          Servit is not Urban Company. Workers are verified cooperative members. The society owns the rails.
          Labour sits in UPI escrow until OTP. Materials ride with the worker so one trip finishes the job.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {cards.map((c) => (
            <Button
              key={c.role}
              variant={c.role === "client" ? "default" : c.role === "worker" ? "navy" : "orange"}
              onClick={() => {
                loginAs(c.role);
                router.push(c.href);
              }}
            >
              {c.cta}
            </Button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <Card key={c.title}>
              <c.icon className="mb-3 h-8 w-8 text-forest" />
              <h2 className="font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{c.body}</p>
            </Card>
          ))}
        </div>

        <h2 className="mb-3 mt-12 text-2xl font-bold">Paradigm Shift</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Dimension</th>
                <th className="p-3">Traditional Aggregator App</th>
                <th className="p-3 text-forest">Servit Cooperative App</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-t">
                  {r.map((cell) => (
                    <td key={cell} className="p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          <Card>
            <h3 className="font-bold">Audience</h3>
            <p className="mt-2 text-sm text-slate-600">
              Idle Cooperative Workers, Households seeking verified help, Digital-forward Societies, NCCT
              Stakeholders.
            </p>
          </Card>
          <Card>
            <h3 className="font-bold">Impact</h3>
            <p className="mt-2 text-sm text-slate-600">
              Social: worker identity, digital grievance redress, emergency community rosters. Financial: 100
              percent fair wage retention, digital invoices unlock credit, society earns material margin.
              Environmental: materials + labour in one trip, repair-first consumption.
            </p>
          </Card>
          <Card>
            <Shield className="mb-2 h-6 w-6 text-navy" />
            <h3 className="font-bold">India Stack (mocked)</h3>
            <p className="mt-2 text-sm text-slate-600">
              Labels only: UPI, eKYC, OTP. Copy respects DPDP Act 2023. No live NPCI or Aadhaar calls.
            </p>
          </Card>
        </section>
      </main>
      <footer className="border-t px-4 py-8 text-center text-xs text-slate-500">
        Research: NCCT cooperative gig notes, MoHUA urban livelihoods, ILO decent work. Demo store is in-memory /
        localStorage so NestJS + PostgreSQL + Redis can replace it later.
      </footer>
    </div>
  );
}
