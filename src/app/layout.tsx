import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_ID = "G-CPMW5HK86C";
const AW_ID = "AW-18058635917";

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
      { url: "/favicon.ico", sizes: "32x32" },
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
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
            gtag('config', '${AW_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
