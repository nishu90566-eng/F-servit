"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppChrome } from "@/components/AppChrome";
import { JobMap } from "@/components/JobMap";
import { JobStepper, QuoteSplit, TrustTriangle } from "@/components/Money";
import { UpiSheet } from "@/components/UpiSheet";
import { Button } from "@/components/ui/button";
import { Badge, Card, Input } from "@/components/ui/card";
import { copy } from "@/lib/i18n";
import { useServit } from "@/lib/store";
import { inr } from "@/lib/utils";

export default function ClientJobDetail() {
  const { id } = useParams<{ id: string }>();
  const { jobs, workers, holdPayment, verifyOtp, locale, switchRole } = useServit();
  const job = jobs.find((j) => j.id === id);
  const worker = workers.find((w) => w.id === job?.workerId);
  const [pay, setPay] = useState(false);
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const t = copy[locale];

  if (!job) return <AppChrome>Missing job</AppChrome>;

  return (
    <AppChrome title={job.id}>
      <div className="mx-auto max-w-md space-y-4">
        <JobStepper status={job.status} />
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Leaking kitchen tap</h1>
          <Badge tone="orange">{job.status}</Badge>
        </div>
        <p className="text-sm text-slate-600">{job.address}</p>
        <QuoteSplit materials={job.materialsInr} labour={job.labourInr} fee={job.platformFeeInr} />
        <TrustTriangle />
        {job.status === "DIAGNOSED" ? (
          <Button className="w-full" onClick={() => setPay(true)}>
            Pay {inr(job.totalInr)} mock UPI
          </Button>
        ) : null}
        {job.escrowStatus === "held" || job.escrowStatus === "released" ? (
          <Card className="bg-navy text-white">
            Vault {job.escrowStatus === "released" ? "released" : "locked"} between Client and Worker
          </Card>
        ) : null}
        <JobMap job={job} worker={worker} />
        {worker ? (
          <Card>
            <div className="flex gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-green-100 font-bold">{worker.photo}</div>
              <div>
                <p className="font-bold">{worker.name}</p>
                <p className="text-xs text-slate-500">
                  Cooperative ID {worker.cooperativeId} · ★ {worker.rating} · {worker.skills.join(", ")}
                </p>
                <p className="text-xs">Match radius ~3 km · {worker.distanceKm} km away</p>
              </div>
            </div>
            {job.qrScanned ? (
              <p className="mt-3 rounded-xl bg-green-50 p-2 text-sm font-semibold text-green-900">
                QR scanned at Counter A — cartridge + tape
              </p>
            ) : null}
          </Card>
        ) : job.status === "PAYMENT_HELD" ? (
          <Card>
            Geo-alert fired to certified plumbers inside 3 km. Switch to Worker to accept.
            <Button
              className="mt-2 w-full"
              variant="navy"
              onClick={() => {
                switchRole("worker");
                router.push("/worker");
              }}
            >
              Open Worker demo
            </Button>
          </Card>
        ) : null}
        {(job.arrived || job.photos.length > 0) && job.status !== "COMPLETED" ? (
          <Card>
            <p className="text-sm font-semibold">{t.otp}</p>
            <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="482917" />
            {msg ? <p className="mt-1 text-xs text-red-600">{msg}</p> : null}
            <Button
              className="mt-2 w-full"
              onClick={() => {
                const fail = verifyOtp(job.id, otp);
                setMsg(fail);
              }}
            >
              {t.otp}
            </Button>
          </Card>
        ) : null}
        {job.status === "COMPLETED" ? (
          <Card>
            <h3 className="font-bold">Invoice {job.id}</h3>
            <p>Rs 600 released to Kuldeep</p>
            <p className="text-sm text-slate-600">Rs 850 society materials · Rs 50 platform</p>
          </Card>
        ) : null}
      </div>
      {pay ? (
        <UpiSheet
          amount={job.totalInr}
          onPaid={() => {
            holdPayment(job.id);
            setPay(false);
          }}
        />
      ) : null}
    </AppChrome>
  );
}
