"use client";

import Link from "next/link";
import { AppChrome } from "@/components/AppChrome";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function ClientJobs() {
  const jobs = useServit((s) => s.jobs);
  return (
    <AppChrome title="Invoices">
      <div className="mx-auto max-w-md space-y-3">
        {jobs.map((job) => (
          <Link key={job.id} href={`/client/jobs/${job.id}`}>
            <Card>
              <div className="flex items-center justify-between">
                <b>{job.id}</b>
                <Badge tone={job.status === "COMPLETED" ? "green" : job.status === "DISPUTED" ? "red" : "orange"}>
                  {job.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600">
                {job.skill} · {inr(job.totalInr)}
              </p>
              {job.status === "COMPLETED" ? (
                <p className="mt-1 text-xs">Invoice: materials {inr(job.materialsInr)} · labour {inr(job.labourInr)} · fee Rs 50</p>
              ) : null}
            </Card>
          </Link>
        ))}
      </div>
    </AppChrome>
  );
}
