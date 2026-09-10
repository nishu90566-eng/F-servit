import { NextResponse } from "next/server";
import { USERS } from "@/lib/seed";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) return NextResponse.json({ error: "invalid" }, { status: 401 });
  return NextResponse.json({ id: user.id, role: user.role, name: user.name });
}
