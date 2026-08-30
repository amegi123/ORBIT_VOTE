import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastContext";

export const metadata: Metadata = {
  title: "Orbit Electronics — TikToker Voting 2026",
  description: "Official Orbit Electronics TikToker of the Year 2026 Awards. Cast your verified vote once every 24 hours.",
  keywords: ["Orbit Electronics", "TikToker Voting", "Ethiopian Creators", "TikTok Awards", "Blue"],
  openGraph: {
    title: "Orbit Electronics — TikToker of the Year 2026",
    description: "Help your favorite TikTok creator reach #1. Verified 24-hour voting platform.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
