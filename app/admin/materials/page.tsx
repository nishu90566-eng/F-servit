"use client";

import { AppChrome } from "@/components/AppChrome";
import { Badge, Card } from "@/components/ui/card";
import { useServit } from "@/lib/store";

export default function MaterialsPage() {
  const { materials, toggleClientCollect } = useServit();
  return (
    <AppChrome title="SKU stock">
      <h1 className="text-2xl font-extrabold">Materials counters</h1>
      <p className="text-sm text-slate-600">Multi-counter fallback. If Counter A is dry, Counter B fills the kit.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {materials.map((m) => (
          <Card key={m.skuId}>
            <div className="flex justify-between">
              <b>{m.name}</b>
              <button className="text-xs font-semibold text-forest" onClick={() => toggleClientCollect(m.skuId)}>
                {m.clientCollect ? "Client-collect ON" : "Worker pickup"}
              </button>
            </div>
            {m.counters.map((c) => (
              <p key={c.id} className="text-sm">
                {c.name}: {c.qty}
                {c.qty < 5 ? <Badge tone="orange" className="ml-2">fallback</Badge> : null}
              </p>
            ))}
          </Card>
        ))}
      </div>
    </AppChrome>
  );
}
