import { Check, House, Package, Wrench } from "lucide-react";
import { TRACKER_STEPS, WORKFLOW_STEPS, trackerPhase } from "../data/seed";

const ICONS = [House, Check, Package, Wrench, Check];

export function JobStepper({ job, variant = "list" }) {
  if (variant === "track") {
    return (
      <div className="timeline-steps mb-1">
        {TRACKER_STEPS.map((step, index) => {
          const phase = trackerPhase(job, index);
          const Icon = ICONS[index];
          return (
            <div key={step.key} className="timeline-step">
              <div
                className={`mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-full ${
                  phase === "done"
                    ? "bg-emerald-500 text-white"
                    : phase === "active"
                      ? "bg-forest text-white"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className={phase === "active" ? "font-semibold text-forest" : "text-slate-500"}>{step.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <ol className="space-y-2">
      {WORKFLOW_STEPS.map((step, index) => {
        const current = job ? (job.status === "COMPLETED" ? 8 : job.status === "AWAITING_CODE" ? 7 : job.status === "INITIATED" ? 1 : job.status === "PAYMENT_HELD" ? 2 : job.status === "OFFERED" ? 2 : job.status === "ACCEPTED" ? 3 : job.status === "MATERIALS_COLLECTED" ? 4 : job.status === "EN_ROUTE" ? 5 : 1) : 0;
        const phase = !job ? "todo" : job.status === "COMPLETED" || index + 1 < current ? "done" : index + 1 === current ? "active" : "todo";
        return (
          <li key={step.n} className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                phase === "done"
                  ? "bg-emerald-500 text-white"
                  : phase === "active"
                    ? "bg-forest text-white"
                    : "bg-slate-200 text-slate-500"
              }`}
            >
              {step.n}
            </span>
            <p className={`text-sm font-medium ${phase === "active" ? "text-forest" : "text-slate-800"}`}>{step.label}</p>
          </li>
        );
      })}
    </ol>
  );
}
