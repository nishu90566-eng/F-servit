import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreHydrate } from "@/components/StoreHydrate";

export const metadata: Metadata = {
  title: "Servit — Cooperative Gig Services",
  description: "Society-owned hyperlocal services and materials for SIH 2026 PS SIH26089.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16A34A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon.svg" />
      </head>
      <body>
        <StoreHydrate>{children}</StoreHydrate>
      </body>
    </html>
  );
}
