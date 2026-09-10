"use client";

import { useEffect } from "react";
import { useServit } from "@/lib/store";

export function StoreHydrate({ children }: { children: React.ReactNode }) {
  const setHydrated = useServit((s) => s.setHydrated);

  useEffect(() => {
    void useServit.persist.rehydrate();
    setHydrated();
  }, [setHydrated]);

  return <>{children}</>;
}
