import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import "./globals.css";

const GA_ID = "G-CPMW5HK86C";
const AW_ID = "AW-18058635917";
// Meta Pixel — sdílený s doucsematiku.cz (stejná cílovka: klienti / rodiče).
// Dataset: „Pixel firmy Doučování", Conversions API aktivní v Meta Events Manageru.
const META_PIXEL_ID = "5663334577022716";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Vzdělávací klub na BIO farmě Fořt | Individuální vzdělávání v Krkonoších",
  description:
    "Komunitní vzdělávací klub pro děti na individuálním vzdělávání. BIO farma Fořt u Vrchlabí — příroda, vzdělávání, komunita. Startujeme od září 2026.",
  keywords: [
    "individuální vzdělávání",
    "domácí škola",
    "domškoláci",
    "bio farma",
    "Krkonoše",
    "vzdělávací klub",
    "komunitní vzdělávání",
    "Fořt",
    "Vrchlabí",
    "Černý Důl",
  ],
  metadataBase: new URL("https://klubdetifort.cz"),
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Vzdělávací klub na BIO farmě Fořt",
    description:
      "Komunitní vzdělávací klub pro děti na individuálním vzdělávání. Startujeme září 2026.",
    locale: "cs_CZ",
    type: "website",
    url: "https://klubdetifort.cz",
    images: [
      {
        url: "/images/logo_fort.png",
        width: 800,
        height: 800,
        alt: "Vzdělávací klub Farma Fořt — logo",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "LPpW2qBwkAd86nZsJdsKC0X-6Wr8d88HV1K33ZRDGZg",
  },
  alternates: {
    canonical: "https://klubdetifort.cz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        {/* Měření návštěvnosti a reklamy se načte teprve po souhlasu návštěvníka. */}
        <CookieConsent gaId={GA_ID} awId={AW_ID} metaPixelId={META_PIXEL_ID} />
      </body>
    </html>
  );
}
