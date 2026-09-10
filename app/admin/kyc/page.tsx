"use client";

import { AppChrome } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";

export default function KycPage() {
  const { workers, setKyc } = useServit();
  return (
    <AppChrome title="eKYC queue">
      <h1 className="mb-4 text-2xl font-extrabold">Member KYC</h1>
      <p className="mb-4 text-sm text-slate-600">Mock eKYC only. DPDP Act 2023: no Aadhaar number is stored in this demo.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {workers.map((w) => (
          <Card key={w.id}>
            <div className="flex justify-between">
              <div>
                <p className="font-bold">{w.name}</p>
                <p className="text-xs">{w.cooperativeId} · {w.skills.join(", ")}</p>
              </div>
              <Badge tone={w.kyc === "verified" ? "green" : w.kyc === "rejected" ? "red" : "orange"}>{w.kyc}</Badge>
            </div>
            {w.kyc === "pending" ? (
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => setKyc(w.id, "verified")}>
                  Approve
                </Button>
                <Button size="sm" variant="orange" onClick={() => setKyc(w.id, "rejected")}>
                  Reject
                </Button>
              </div>
            ) : null}
          </Card>
        ))}
      </div>
    </AppChrome>
  );
}
