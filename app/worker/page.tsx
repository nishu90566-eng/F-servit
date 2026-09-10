"use client";

import Link from "next/link";
import { Wifi } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function WorkerHome() {
  const { workers, jobs, toggleAvailable, locale, session } = useServit();
  const me = workers.find((w) => w.id === "w1")!;
  const alert = jobs.find((j) => j.id === "JOB-1042");
  const t = copy[locale];

  return (
    <AppChrome title="Member">
      <div className="mx-auto max-w-md space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">{me.name}</h1>
            <p className="text-sm text-slate-500">Cooperative ID {me.cooperativeId} · KYC {me.kyc}</p>
          </div>
          <button
            className={`rounded-full px-3 py-1 text-xs font-bold ${me.available ? "bg-green-100 text-green-800" : "bg-slate-200"}`}
            onClick={() => toggleAvailable(me.id)}
          >
            {me.available ? "On duty" : "Off"}
          </button>
        </div>
        <Card className="flex items-center gap-2 bg-slate-100 text-sm">
          <Wifi className="h-4 w-4" /> Last synced 12s ago. Offline sync pending: 0.
        </Card>
        <Card>
          <p className="text-xs text-slate-500">Take-home this week</p>
          <p className="text-2xl font-extrabold text-forest">{inr(me.takeHomeThisWeek)}</p>
          <p className="text-xs">Never a 20-30% cut. Flat Rs 50 is society cloud, not your wage.</p>
        </Card>
        {alert && alert.status === "PAYMENT_HELD" ? (
          <Card className="border-forest">
            <Badge tone="orange">Geo-alert · ~3 km</Badge>
            <h2 className="mt-2 font-bold">JOB-1042 leaking kitchen tap</h2>
            <p className="text-sm">2.1 km away · Sector 21 Faridabad</p>
            <p className="mt-2 text-lg font-extrabold text-forest">Take-home {inr(600)}</p>
            <p className="text-xs text-slate-500">Household pays Rs 1500. You keep Rs 600 labour. Zero commission.</p>
            <Link href={`/worker/jobs/${alert.id}`}>
              <Button className="mt-3 w-full">{t.accept}</Button>
            </Link>
          </Card>
        ) : alert ? (
          <Link href={`/worker/jobs/${alert.id}`}>
            <Card>
              <b>JOB-1042</b> · {alert.status}
            </Card>
          </Link>
        ) : null}
        <p className="text-center text-xs text-slate-500">Logged in as {session?.name}</p>
      </div>
    </AppChrome>
  );
}
