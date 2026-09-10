"use client";

import dynamic from "next/dynamic";
import type { Job, WorkerProfile } from "@/lib/types";

const Map = dynamic(() => import("@/components/LiveMap"), { ssr: false });

export function JobMap({ job, worker }: { job: Job; worker?: WorkerProfile }) {
  return <Map job={job} worker={worker} />;
}
