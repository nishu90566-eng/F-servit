"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustTriangle } from "@/components/Money";
import { inr } from "@/lib/utils";

export function UpiSheet({
  amount,
  onPaid,
}: {
  amount: number;
  onPaid: () => void;
}) {
  const [phase, setPhase] = useState<"created" | "approved" | "held">("created");

  return (
    <div className="fixed inset-0 z-[5000] grid place-items-end bg-black/40 p-3 sm:place-items-center">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 sm:rounded-3xl">
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
        <p className="text-xs font-bold uppercase text-slate-500">Mock UPI collect</p>
        <h3 className="text-xl font-bold">Pay {inr(amount)} to servit@upi</h3>
        <div className="my-4 flex items-center gap-3 rounded-2xl bg-navy p-4 text-white">
          <Lock className="h-8 w-8 text-green-400" />
          <div>
            <p className="text-sm font-semibold">Escrow vault</p>
            <p className="text-xs text-slate-300">
              {phase === "created" && "Collect created"}
              {phase === "approved" && "User approved"}
              {phase === "held" && "PAYMENT_HELD — vault locked"}
            </p>
          </div>
        </div>
        <TrustTriangle />
        {phase === "created" ? (
          <Button className="mt-4 w-full" onClick={() => setPhase("approved")}>
            Approve on UPI
          </Button>
        ) : (
          <Button
            className="mt-4 w-full"
            onClick={() => {
              setPhase("held");
              onPaid();
            }}
          >
            Lock vault · PAYMENT_HELD
          </Button>
        )}
      </div>
    </div>
  );
}
