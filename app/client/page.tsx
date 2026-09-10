"use client";

import Link from "next/link";
import { Bell, Droplets, MapPin, Mic, Zap } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function ClientHome() {
  const { session, jobs, locale } = useServit();
  const live = jobs.find((j) => j.id === "JOB-1042");
  const t = copy[locale];

  return (
    <AppChrome title="Household">
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Namaste, {session?.name.split(" ")[0]}</h1>
            <p className="flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" /> Sector 21, Faridabad
            </p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full border">
            <Bell className="h-4 w-4" />
          </span>
        </div>
        <Card className="bg-forest text-white">
          <h2 className="text-xl font-bold">Something leaking at home?</h2>
          <p className="mt-1 text-sm text-green-50">Voice-first. Hindi or English. AI names the skill and SKUs.</p>
          <Link href="/client/new">
            <Button variant="orange" className="mt-4">
              <Mic className="h-4 w-4" /> {t.speak}
            </Button>
          </Link>
        </Card>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Droplets className="mx-auto text-forest" />
            <p className="mt-1 text-sm font-bold">Plumbing</p>
          </Card>
          <Card className="text-center">
            <Zap className="mx-auto text-urgency" />
            <p className="mt-1 text-sm font-bold">Electrical</p>
          </Card>
        </div>
        {live ? (
          <Card className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">JOB-1042</h3>
              <Badge tone="orange">{live.status}</Badge>
            </div>
            <p className="text-sm text-slate-600">Leaking kitchen tap · {inr(live.totalInr)}</p>
            <Link href={`/client/jobs/${live.id}`}>
              <Button className="mt-3 w-full" variant="outline">
                Open live job
              </Button>
            </Link>
          </Card>
        ) : null}
        <Link href="/client/jobs" className="mt-4 block text-center text-sm font-semibold text-forest">
          History and invoices
        </Link>
      </div>
    </AppChrome>
  );
}
