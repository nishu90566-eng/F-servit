"use client";

import { useState } from "react";
import { AppChrome } from "@/components/AppChrome";
import { Button } from "@/components/ui/button";
import { Badge, Card, Input } from "@/components/ui/card";
import { useServit } from "@/lib/store";

export default function DisputesPage() {
  const { disputes, addDisputeMessage, resolveDispute } = useServit();
  const [text, setText] = useState("Second visit scheduled tomorrow 10am.");
  return (
    <AppChrome title="Grievance">
      <h1 className="text-2xl font-extrabold">Digital grievance</h1>
      {disputes.map((d) => (
        <Card key={d.id} className="mt-4">
          <div className="flex justify-between">
            <b>
              {d.id} · {d.jobId}
            </b>
            <Badge tone={d.status === "open" ? "red" : "green"}>{d.status}</Badge>
          </div>
          <p className="text-xs">From {d.from}</p>
          <p className="mt-2 text-sm">Evidence photos: {d.evidence.join(", ")}</p>
          <div className="mt-3 space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
            {d.thread.map((m) => (
              <p key={m.at}>
                <b>{m.author}:</b> {m.body}
              </p>
            ))}
          </div>
          {d.status === "open" ? (
            <div className="mt-3 flex gap-2">
              <Input value={text} onChange={(e) => setText(e.target.value)} />
              <Button onClick={() => addDisputeMessage(d.id, text)}>Send</Button>
              <Button variant="navy" onClick={() => resolveDispute(d.id, "Escrow refund path noted.")}>
                Close
              </Button>
            </div>
          ) : null}
        </Card>
      ))}
    </AppChrome>
  );
}
