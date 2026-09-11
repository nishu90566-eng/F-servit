import { CheckCircle2, ShieldCheck } from "lucide-react";
import { inr } from "../data/seed";
import { CentralFund } from "./CentralFund";

export function Receipt({ job }) {
  if (!job || job.status !== "COMPLETED") return null;

  return (
    <section className="space-y-3">
      <div className="rounded-xl bg-forest px-4 py-4 text-center text-white shadow-sm">
        <p className="flex items-center justify-center gap-2 text-lg font-bold tracking-wide">
          <CheckCircle2 className="h-6 w-6 text-accent" />
          SERVICE COMPLETED
        </p>
        <p className="mt-1 text-sm text-emerald-100">{job.id} · {job.category}</p>
      </div>

      <div className="sewa-card p-4">
        <p className="text-sm font-semibold text-slate-900">Settlement receipt</p>
        <p className="mt-1 text-xs text-slate-500">
          {job.clientName} · {job.clientAddress}
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Materials → merchant (step 4)</span>
            <span className="font-medium">{inr(job.materialTotal)}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Worker take-home (step 7, after cutoff)</span>
            <span className="font-medium">{inr(job.workerPayout)}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Platform fee (cooperative)</span>
            <span className="font-medium">{inr(job.platformFee)}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-slate-600">Welfare fund (8% of labour)</span>
            <span className="font-medium">{inr(job.welfareFee)}</span>
          </li>
          <li className="flex justify-between gap-3 border-t border-slate-100 pt-2 font-semibold">
            <span>Client paid into Central Fund</span>
            <span>{inr(job.clientPaid)}</span>
          </li>
        </ul>
        <p className="mt-3 flex items-center gap-1 text-xs leading-5 text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Payment held securely by SEWA-SETU Cooperative
        </p>
      </div>

      <CentralFund job={job} />
    </section>
  );
}
