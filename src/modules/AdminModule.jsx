import { Heart, PieChart, Shield } from "lucide-react";
import { CentralFund } from "../components/CentralFund";
import { JobStepper } from "../components/JobStepper";
import { Receipt } from "../components/Receipt";
import { FEES, inr, MERCHANT } from "../data/seed";
import { resetDemo, useStore } from "../store";

function pickupBadge(job) {
  if (!job) return { text: "—", cls: "bg-slate-200 text-slate-600" };
  if (job.merchantPaidAt) return { text: "Collected", cls: "bg-emerald-600 text-white" };
  if (job.status === "ACCEPTED") return { text: "Ready for Pickup", cls: "bg-sky-200 text-slate-800" };
  if (["PAYMENT_HELD", "OFFERED"].includes(job.status)) return { text: "Packing in Progress", cls: "bg-accent text-slate-900" };
  return { text: job.status.replaceAll("_", " "), cls: "bg-slate-200 text-slate-700" };
}

export function AdminModule() {
  const { job, workers } = useStore();
  const pickup = pickupBadge(job);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h4 className="mb-0 text-xl font-bold">SEWA-SETU Cooperative Admin</h4>
          <span className="text-sm text-slate-500">Governance & Live Operations Platform</span>
        </div>
        <button type="button" onClick={resetDemo} className="shrink-0 whitespace-nowrap rounded-md border border-forest px-3 py-1 text-sm font-medium text-forest">
          Reset Demo
        </button>
      </div>

      {job?.status === "EN_ROUTE" ? (
        <div className="mb-3 rounded-xl bg-forest px-4 py-3 text-sm font-semibold text-white">Worker on the way</div>
      ) : null}

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="sewa-card p-3">
          <span className="text-sm text-slate-500">Active Workers</span>
          <h3 className="mb-0 text-2xl font-bold text-forest">{workers.filter((w) => w.onDuty).length}</h3>
          <span className="text-sm text-emerald-600">100% Verified</span>
        </div>
        <div className="sewa-card p-3">
          <span className="text-sm text-slate-500">Partner Hardware Shops</span>
          <h3 className="mb-0 text-2xl font-bold text-forest">1</h3>
          <span className="text-sm text-slate-500">Local Coverage</span>
        </div>
        <div className="sewa-card p-3">
          <span className="text-sm text-slate-500">Jobs Today</span>
          <h3 className="mb-0 text-2xl font-bold text-emerald-600">{workers.reduce((s, w) => s + w.jobsToday, 0)}</h3>
          <span className="text-sm text-slate-500">Fair queue</span>
        </div>
        <div className="sewa-card p-3">
          <span className="text-sm text-slate-500">Coop Welfare Fund</span>
          <h3 className="mb-0 text-2xl font-bold text-navy">{job?.status === "COMPLETED" ? inr(job.welfareFee) : inr(0)}</h3>
          <span className="text-sm text-slate-500">Auto-contributed</span>
        </div>
      </div>

      <CentralFund job={job} />

      <div className="sewa-card mb-4 mt-4 p-3">
        <h6 className="mb-3 font-bold">Live Cooperative Service Pipeline</h6>
        <div className="overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-2 font-medium">Job ID</th>
                <th className="p-2 font-medium">Customer</th>
                <th className="p-2 font-medium">Service</th>
                <th className="p-2 font-medium">Assigned Worker</th>
                <th className="p-2 font-medium">Hardware Shop</th>
                <th className="p-2 font-medium">Material Pickup</th>
                <th className="p-2 font-medium">Status</th>
                <th className="p-2 font-medium">Client paid</th>
                <th className="p-2 font-medium">Merchant</th>
                <th className="p-2 font-medium">Worker</th>
                <th className="p-2 font-medium">Platform</th>
                <th className="p-2 font-medium">Welfare</th>
              </tr>
            </thead>
            <tbody>
              {job ? (
                <tr className="border-t border-slate-100 bg-amber-50/50">
                  <td className="p-2 font-bold">{job.id}</td>
                  <td className="p-2">{job.clientName}</td>
                  <td className="p-2">{job.category}</td>
                  <td className="p-2">{job.workerName || "—"}</td>
                  <td className="p-2">{MERCHANT.name}</td>
                  <td className="p-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${pickup.cls}`}>{pickup.text}</span>
                  </td>
                  <td className="p-2">
                    <span className={`rounded-full px-2 py-1 text-xs ${job.status === "COMPLETED" ? "bg-emerald-600 text-white" : "bg-accent text-slate-900"}`}>
                      {job.status.replaceAll("_", " ")}
                    </span>
                  </td>
                  <td className="p-2">{job.status === "INITIATED" ? inr(0) : inr(job.clientPaid)}</td>
                  <td className="p-2">{job.merchantPaidAt ? inr(job.materialTotal) : inr(0)}</td>
                  <td className="p-2">{job.workerPaidAt ? inr(job.workerPayout) : inr(0)}</td>
                  <td className="p-2">{job.status === "COMPLETED" ? inr(job.platformFee) : inr(0)}</td>
                  <td className="p-2">{job.status === "COMPLETED" ? inr(job.welfareFee) : inr(0)}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={12} className="p-6 text-center text-slate-400">
                    No live job yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-2">
        <div className="sewa-card h-full p-3">
          <h6 className="mb-2 font-bold">
            <PieChart className="mr-1 inline h-4 w-4 text-accent" /> Fair Job Distribution Model
          </h6>
          <p className="mb-2 text-sm text-slate-500">
            Fair dispatch = lowest jobsToday among on-duty workers. First job → Suresh Verma. Take-home {inr(FEES.workerPayout)} after cutoff.
          </p>
          <ul className="text-sm">
            {workers.map((worker) => (
              <li key={worker.id} className="flex items-center justify-between border-b border-slate-100 py-2">
                <span>
                  {worker.name} ({worker.skill})
                </span>
                <strong>{worker.jobsToday} jobs today</strong>
              </li>
            ))}
          </ul>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
            <Shield className="h-3.5 w-3.5" /> Wage Floor Protected
          </span>
        </div>
        <div className="sewa-card h-full p-3">
          <h6 className="mb-2 font-bold">
            <Heart className="mr-1 inline h-4 w-4 text-red-500" /> Cooperative Worker Welfare
          </h6>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Welfare cutoff (8% of labour):</span>
              <strong className="text-emerald-600">{inr(FEES.welfareFee)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Platform fee:</span>
              <strong>{inr(FEES.platformFee)}</strong>
            </div>
            <div className="flex justify-between">
              <span>Never aggregator commission:</span>
              <strong>0% of 20–30%</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="sewa-card mb-4 p-3">
        <p className="mb-3 text-sm font-semibold">Workflow monitor</p>
        <JobStepper job={job} />
      </div>

      {job?.status === "COMPLETED" ? <Receipt job={job} /> : null}
    </div>
  );
}
