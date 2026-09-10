"use client";

import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { JobMap } from "@/components/JobMap";
import { QuoteSplit, TrustTriangle } from "@/components/Money";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

const tiles = [
  ["Time-to-accept", "Speed of response", "timeToAcceptMin", " min"] as const,
  ["OTP success rate", "Reliability of verification", "otpSuccessRate", "%"] as const,
  ["Hours/week", "Worker utilisation", "hoursPerWeek", " hrs"] as const,
  ["Worker take-home vs private app", "Fair-wage benchmark", "takeHomeVsPrivatePct", "% more"] as const,
  ["Repeat rate", "Catchment retention", "repeatRate", "%"] as const,
  ["Grievance resolution time", "Admin trust", "grievanceHours", " hrs"] as const,
];

export default function AdminHome() {
  const { kpis, jobs, workers } = useServit();
  const live = jobs.find((j) => j.id === "JOB-1042")!;
  const kuldeep = workers.find((w) => w.id === "w1");

  return (
    <AppChrome title="Society desk">
      <h1 className="text-2xl font-extrabold">Balaji Nagar Cooperative Society</h1>
      <p className="text-sm text-slate-500">Secretary · SIH26089 governance</p>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
        {tiles.map(([name, sub, key, suffix]) => (
          <Card key={name}>
            <p className="text-xs font-bold uppercase text-slate-500">{name}</p>
            <p className="text-2xl font-extrabold">
              {String(kpis[key as keyof typeof kpis])}
              {suffix}
            </p>
            <p className="text-xs text-slate-500">{sub}</p>
          </Card>
        ))}
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Live jobs map</h2>
          <JobMap job={live} worker={kuldeep} />
        </Card>
        <Card>
          <h2 className="font-bold">Rs 1500 job breakdown</h2>
          <QuoteSplit />
          <TrustTriangle />
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-xl bg-green-50 p-3">
              <p className="text-xs">Servit take-home</p>
              <p className="text-xl font-extrabold text-forest">{inr(600)}</p>
            </div>
            <div className="rounded-xl bg-red-50 p-3">
              <p className="text-xs">Private app 25% skim</p>
              <p className="text-xl font-extrabold text-red-700">{inr(450)}</p>
              <p className="text-[11px]">Would withhold Rs 150 from the same Rs 600 labour.</p>
            </div>
          </div>
        </Card>
      </div>
      <Card className="mt-4">
        <h2 className="mb-2 font-bold">Pipeline</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500">
                <th className="p-2">Job</th>
                <th className="p-2">Skill</th>
                <th className="p-2">Status</th>
                <th className="p-2">Escrow</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t">
                  <td className="p-2 font-semibold">{j.id}</td>
                  <td className="p-2">{j.skill}</td>
                  <td className="p-2">
                    <Badge tone={j.status === "COMPLETED" ? "green" : "orange"}>{j.status}</Badge>
                  </td>
                  <td className="p-2">{j.escrowStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <nav className="mt-4 grid grid-cols-2 gap-2 text-sm font-semibold md:grid-cols-5">
        {[
          ["/admin/kyc", "KYC queue"],
          ["/admin/roster", "Emergency roster"],
          ["/admin/wages", "Fair wages"],
          ["/admin/disputes", "Disputes"],
          ["/admin/materials", "Materials"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-xl border bg-white p-3 text-center">
            {label}
          </Link>
        ))}
      </nav>
    </AppChrome>
  );
}
