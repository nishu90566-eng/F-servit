"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/card";
import { useServit } from "@/lib/store";
import type { Role } from "@/lib/types";

const demos: { role: Role; email: string; who: string }[] = [
  { role: "client", email: "client@servit.in", who: "Ravi Sharma · Sector 21 Faridabad" },
  { role: "worker", email: "worker@servit.in", who: "Kuldeep Singh · plumber C-4419" },
  { role: "admin", email: "admin@servit.in", who: "Secretary · Balaji Nagar Cooperative" },
];

export default function LoginPage() {
  const { login, loginAs } = useServit();
  const router = useRouter();
  const [email, setEmail] = useState("client@servit.in");
  const [password, setPassword] = useState("Servit@123");
  const [err, setErr] = useState<string | null>(null);

  const go = (role: Role) => {
    loginAs(role);
    router.push(role === "client" ? "/client" : role === "worker" ? "/worker" : "/admin");
  };

  return (
    <div className="mx-auto min-h-screen max-w-md px-4 py-10">
      <Logo />
      <h1 className="mt-6 text-3xl font-extrabold">Demo login</h1>
      <p className="mt-2 text-sm text-slate-600">Password for all accounts: Servit@123</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fail = login(email, password);
          if (fail) {
            setErr(fail);
            return;
          }
          const role = email.startsWith("worker") ? "worker" : email.startsWith("admin") ? "admin" : "client";
          go(role);
        }}
      >
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err ? <p className="text-sm text-red-600">{err}</p> : null}
        <Button className="w-full" type="submit">
          Sign in
        </Button>
      </form>
      <div className="mt-6 grid gap-3">
        {demos.map((d) => (
          <Card key={d.role} className="cursor-pointer" onClick={() => go(d.role)}>
            <p className="text-xs uppercase text-slate-500">{d.role}</p>
            <p className="font-bold">{d.email}</p>
            <p className="text-sm text-slate-600">{d.who}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
