import { fundBreakdown, inr } from "../data/seed";

const CELLS = [
  { key: "locked", label: "Locked" },
  { key: "merchant", label: "Merchant released" },
  { key: "worker", label: "Worker released" },
  { key: "cooperative", label: "Cooperative retained" },
];

export function CentralFund({ job, showVault = true }) {
  const fund = fundBreakdown(job);

  return (
    <section className="sewa-card p-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-forest">SEWA Central Fund</p>
          <p className="text-sm text-slate-500">Escrow vault · no aggregator cut</p>
        </div>
        {showVault ? <p className="text-2xl font-bold text-forest">{inr(fund.vault)}</p> : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {CELLS.map((cell) => (
          <div key={cell.key} className="rounded-xl bg-slate-50 px-3 py-2">
            <p className="text-[11px] text-slate-500">{cell.label}</p>
            <p className="font-semibold text-slate-900">{inr(fund[cell.key])}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
