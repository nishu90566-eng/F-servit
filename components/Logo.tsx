"use client";

import { Handshake, MapPin } from "lucide-react";
import Link from "next/link";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
      <span className={`relative grid h-8 w-8 place-items-center rounded-lg ${light ? "bg-white/15" : "bg-forest"}`}>
        <Handshake className="h-4 w-4 text-white" />
        <MapPin className="absolute -right-1 -top-1 h-3.5 w-3.5 text-urgency" />
      </span>
      <span className={light ? "text-white" : "text-navy"}>Servit</span>
    </Link>
  );
}
