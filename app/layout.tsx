import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://orbitvote.vercel.app"),
  title: "Orbit Creative Challenge 2026 | Creator Voting",
  description:
    "Vote for your favorite creator in the Orbit Creative Challenge 2026 and follow the live competition leaderboard.",
  alternates: {
    canonical: "https://orbitvote.vercel.app/",
  },
  keywords: [
    "Orbit Electronics",
    "Orbit Creative Challenge 2026",
    "Orbit Creative Challenge",
    "Creator Voting",
    "Ethiopian Creators",
    "Orbit Voting",
  ],
  openGraph: {
    title: "Orbit Creative Challenge 2026 | Creator Voting",
    description:
      "Vote for your favorite creator in the Orbit Creative Challenge 2026 and follow the live competition leaderboard.",
    url: "https://orbitvote.vercel.app/",
    siteName: "Orbit Creative Challenge 2026",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Orbit Creative Challenge 2026 - Creator Voting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit Creative Challenge 2026 | Creator Voting",
    description:
      "Vote for your favorite creator in the Orbit Creative Challenge 2026 and follow the live competition leaderboard.",
    images: ["/opengraph-image"],
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Orbit Creative Challenge 2026",
    description:
      "Vote for your favorite creator in the Orbit Creative Challenge 2026 and follow the live competition leaderboard.",
    url: "https://orbitvote.vercel.app/",
    organizer: {
      "@type": "Organization",
      name: "Orbit Electronics",
      url: "https://orbitvote.vercel.app/",
    },
    location: {
      "@type": "Place",
      name: "Addis Ababa, Ethiopia",
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-blue-600 selection:text-white">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
