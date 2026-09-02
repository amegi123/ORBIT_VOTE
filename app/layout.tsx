import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://orbitvote.vercel.app"),
  title: "Orbit Creative Challenge Vote | Orbit Electronics",
  description: "Official Orbit Electronics Creative Challenge 2026. Cast your verified vote once every 24 hours and help your favorite creator win.",
  keywords: ["Orbit Electronics", "Orbit Creative Challenge", "Orbit Creative Challenge Vote", "Ethiopian Creators", "Creative Challenge Vote", "Orbit Voting"],
  openGraph: {
    title: "Orbit Creative Challenge Vote",
    description: "Official Orbit Electronics Creative Challenge 2026. Cast your verified vote once every 24 hours.",
    url: "https://orbitvote.vercel.app",
    siteName: "Orbit Creative Challenge Vote",
    images: [
      {
        url: "/orbit-electronics-logo.png",
        width: 800,
        height: 400,
        alt: "Orbit Creative Challenge Vote",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Creative Challenge Vote",
    description: "Official Orbit Electronics Creative Challenge 2026. Cast your verified vote once every 24 hours.",
    images: ["/orbit-electronics-logo.png"],
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
