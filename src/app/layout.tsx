import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    title: "Vzdělávací klub na BIO farmě Fořt",
    description:
      "Komunitní vzdělávací klub pro děti na individuálním vzdělávání. Startujeme září 2026.",
    locale: "cs_CZ",
    type: "website",
    url: "https://klubdetifort.cz",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
