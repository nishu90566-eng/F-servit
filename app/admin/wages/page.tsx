"use client";

import { AppChrome } from "@/components/AppChrome";
import { Card } from "@/components/ui/card";
import { inr } from "@/lib/utils";

export default function WagesPage() {
  return (
    <AppChrome title="Fair wage">
      <h1 className="text-2xl font-extrabold">Fair-wage rules</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Labour to member</p>
          <p className="text-3xl font-extrabold text-forest">100%</p>
          <p className="text-sm">Released only after household OTP.</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Platform</p>
          <p className="text-3xl font-extrabold">{inr(50)}</p>
          <p className="text-sm">Flat. Never 20-30% commission.</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Materials</p>
          <p className="text-3xl font-extrabold">{inr(850)}</p>
          <p className="text-sm">Margin stays with the society, not a VC marketplace.</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Private app skim on Rs 600</p>
          <p className="text-3xl font-extrabold text-red-700">{inr(150)}</p>
          <p className="text-sm">Servit keeps that Rs 150 with Kuldeep.</p>
        </Card>
      </div>
    </AppChrome>
  );
}
