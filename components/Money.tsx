import { inr } from "@/lib/utils";

export function QuoteSplit({
  materials = 850,
  labour = 600,
  fee = 50,
}: {
  materials?: number;
  labour?: number;
  fee?: number;
}) {
  const total = materials + labour + fee;
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm">
      <div className="flex justify-between">
        <span>Materials → society</span>
        <b>{inr(materials)}</b>
      </div>
      <div className="flex justify-between">
        <span>Worker escrow (100% labour)</span>
        <b className="text-forest">{inr(labour)}</b>
      </div>
      <div className="flex justify-between">
        <span>Flat platform fee</span>
        <b>{inr(fee)}</b>
      </div>
      <div className="flex h-3 overflow-hidden rounded-full">
        <div className="bg-navy" style={{ width: `${(materials / total) * 100}%` }} />
        <div className="bg-forest" style={{ width: `${(labour / total) * 100}%` }} />
        <div className="bg-urgency" style={{ width: `${(fee / total) * 100}%` }} />
      </div>
      <div className="flex justify-between border-t pt-2 text-base">
        <span>Total</span>
        <b>{inr(total)}</b>
      </div>
    </div>
  );
}

export function TrustTriangle() {
  return (
    <div className="rounded-2xl bg-green-50 p-4 text-center text-sm font-semibold text-green-900">
      Funds unlock to Worker only upon final OTP input.
    </div>
  );
}

export function JobStepper({ status }: { status: string }) {
  const steps = ["INITIATED", "DIAGNOSED", "PAYMENT_HELD", "EN_ROUTE", "COMPLETED"];
  const labels = ["Initiated", "Diagnosed", "Payment Held", "En Route", "Completed"];
  const idx = Math.max(0, steps.indexOf(status));
  return (
    <ol className="mb-4 flex justify-between gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
      {labels.map((label, i) => (
        <li key={label} className={`flex-1 text-center ${i <= idx ? "text-forest" : ""}`}>
          <span className={`mx-auto mb-1 block h-2 w-2 rounded-full ${i <= idx ? "bg-forest" : "bg-slate-200"}`} />
          {label}
        </li>
      ))}
    </ol>
  );
}
