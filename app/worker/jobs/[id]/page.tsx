"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { AppChrome } from "@/components/AppChrome";
import { JobMap } from "@/components/JobMap";
import { JobStepper, TrustTriangle } from "@/components/Money";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function WorkerJob() {
  const { id } = useParams<{ id: string }>();
  const { jobs, workers, acceptJob, scanQr, markArrived, addProof, locale, switchRole } = useServit();
  const job = jobs.find((j) => j.id === id);
  const me = workers.find((w) => w.id === "w1");
  const t = copy[locale];
  const router = useRouter();
  const [notes, setNotes] = useState("");

  if (!job || !me) return <AppChrome>Missing</AppChrome>;

  return (
    <AppChrome title={job.id}>
      <div className="mx-auto max-w-md space-y-4">
        <JobStepper status={job.status} />
        <div className="flex justify-between">
          <h1 className="text-xl font-extrabold">Kitchen tap leak</h1>
          <Badge>{job.status}</Badge>
        </div>
        <p className="text-sm">2.1 km · ~3 km match · take-home {inr(job.labourInr)}</p>
        {job.status === "PAYMENT_HELD" ? (
          <Button className="w-full" onClick={() => acceptJob(job.id, me.id)}>
            {t.accept}
          </Button>
        ) : null}
        {job.status === "EN_ROUTE" ? (
          <>
            <Card className="text-center">
              <p className="text-xs font-bold">Material QR · {job.qrMaterialCode}</p>
              <div className="mx-auto my-3 w-40">
                <QRCodeSVG value={job.qrMaterialCode || "SRV-MAT-1042"} size={160} />
              </div>
              <ul className="space-y-1 text-left text-sm">
                {job.skus.map((s) => (
                  <li key={s.id}>
                    <input type="checkbox" className="mr-2" defaultChecked={job.qrScanned} readOnly />
                    {s.name}
                  </li>
                ))}
              </ul>
              {!job.qrScanned ? (
                <Button className="mt-3 w-full" onClick={() => scanQr(job.id)}>
                  Scan QR at Counter A
                </Button>
              ) : (
                <p className="mt-2 text-sm font-semibold text-forest">QR scanned at Counter A — cartridge + tape</p>
              )}
            </Card>
            <JobMap job={job} worker={me} />
            {!job.arrived ? (
              <Button className="w-full" variant="navy" onClick={() => markArrived(job.id)}>
                I have arrived
              </Button>
            ) : (
              <Card>
                <p className="text-sm font-semibold">After photos (2 slots)</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {[0, 1].map((i) => (
                    <button
                      key={i}
                      className="rounded-xl border border-dashed p-6 text-xs"
                      onClick={() => addProof(job.id, `after-${i + 1}.jpg`, notes)}
                    >
                      {job.photos[i] ? job.photos[i] : "Upload proof"}
                    </button>
                  ))}
                </div>
                <textarea
                  className="mt-2 w-full rounded-xl border p-2 text-sm"
                  placeholder="Notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <p className="mt-3 text-sm font-semibold text-slate-600">Waiting for household OTP. Worker cannot release payment.</p>
                <TrustTriangle />
                <Button
                  className="mt-3 w-full"
                  variant="orange"
                  onClick={() => {
                    switchRole("client");
                    router.push(`/client/jobs/${job.id}`);
                  }}
                >
                  Switch to Client for OTP
                </Button>
              </Card>
            )}
          </>
        ) : null}
        {job.status === "COMPLETED" ? (
          <Card className="bg-green-50 font-semibold text-green-900">Rs 600 released to Kuldeep. 100% labour kept.</Card>
        ) : null}
      </div>
    </AppChrome>
  );
}
