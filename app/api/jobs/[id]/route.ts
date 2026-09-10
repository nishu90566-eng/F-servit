import { NextResponse } from "next/server";
import { JOBS } from "@/lib/seed";

let memory = structuredClone(JOBS);

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const job = memory.find((j) => j.id === params.id);
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const patch = await req.json();
  memory = memory.map((j) => (j.id === params.id ? { ...j, ...patch } : j));
  const job = memory.find((j) => j.id === params.id);
  return NextResponse.json(job);
}
