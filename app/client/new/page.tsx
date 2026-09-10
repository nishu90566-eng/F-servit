"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera } from "lucide-react";
import { AppChrome } from "@/components/AppChrome";
import { QuoteSplit, TrustTriangle } from "@/components/Money";
import { VoiceMic } from "@/components/VoiceMic";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";

export default function NewJobPage() {
  const { diagnose, jobs, updateSkus } = useServit();
  const job = jobs.find((j) => j.id === "JOB-1042");
  const [ready, setReady] = useState(!!job && job.status !== "INITIATED");
  const [photo, setPhoto] = useState(false);

  return (
    <AppChrome title="Voice intake">
      <div className="mx-auto max-w-md space-y-4">
        <VoiceMic
          onTranscript={(text) => {
            diagnose("JOB-1042", text);
            setReady(true);
          }}
        />
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed p-3 text-sm">
          <Camera className="h-4 w-4" />
          {photo ? "Photo attached (mock)" : "Attach a short video or photo"}
          <input type="file" accept="image/*,video/*" className="hidden" onChange={() => setPhoto(true)} />
        </label>
        {ready && job ? (
          <Card>
            <Badge tone="green">AI diagnosis</Badge>
            <h2 className="mt-2 text-lg font-bold">Detected skill Plumbing</h2>
            <p className="text-sm text-slate-600">Urgency Medium · labour ~1.5 hours</p>
            <p className="mt-2 text-sm italic">“{job.voiceTranscript || "Kitchen tap is leaking since morning, water on the floor."}”</p>
            <ul className="mt-3 space-y-1 text-sm">
              {job.skus.map((s) => (
                <li key={s.id} className="flex justify-between">
                  <span>
                    {s.name} ×{s.qty}
                  </span>
                  <span>Rs {s.unitRate}</span>
                </li>
              ))}
            </ul>
            <button
              className="mt-2 text-xs font-semibold text-forest"
              onClick={() => updateSkus("JOB-1042", job.skus.filter((s) => s.id !== "washer-set"))}
            >
              Edit SKUs (remove washer)
            </button>
            <div className="mt-3">
              <QuoteSplit materials={job.materialsInr} labour={job.labourInr} />
            </div>
            <p className="mt-2 text-xs text-slate-500">House pin: Sector 21, Faridabad · Leaflet map on the live job.</p>
            <TrustTriangle />
            <Link href="/client/jobs/JOB-1042">
              <Button className="mt-3 w-full">Confirm quote · pay escrow</Button>
            </Link>
          </Card>
        ) : null}
      </div>
    </AppChrome>
  );
}
