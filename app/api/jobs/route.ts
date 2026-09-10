import { NextResponse } from "next/server";
import { JOBS } from "@/lib/seed";

let memory = structuredClone(JOBS);

export async function GET() {
  return NextResponse.json(memory);
}

export async function POST(req: Request) {
  const body = await req.json();
  memory = [body, ...memory.filter((j) => j.id !== body.id)];
  return NextResponse.json(body);
}
