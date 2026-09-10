"use client";

import { AppChrome } from "@/components/AppChrome";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";

export default function RosterPage() {
  const { jobs, workers } = useServit();
  const emergency = jobs.find((j) => j.id === "JOB-1041");
  const ready = workers.filter((w) => w.kyc === "verified" && w.available);
  return (
    <AppChrome title="Roster">
      <h1 className="text-2xl font-extrabold">30-minute emergency roster</h1>
      <p className="text-sm text-slate-600">Demand forecast next 4 hours: plumbing spike in Sector 21 (festival prep).</p>
      <Card className="mt-4">
        <Badge tone="red">EMERGENCY_ROSTER</Badge>
        <p className="mt-2 font-bold">{emergency?.id} · main line burst</p>
        <p className="text-sm">Escrow held. Ping verified plumbers inside 3 km.</p>
      </Card>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {ready.map((w) => (
          <Card key={w.id}>
            <p className="font-bold">{w.name}</p>
            <p className="text-sm">{w.distanceKm} km · {w.skills.join(", ")} · SLA 30 min</p>
          </Card>
        ))}
      </div>
    </AppChrome>
  );
}
