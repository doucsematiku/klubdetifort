import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
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

        {/* Meta Pixel — oficiální snippet, base PageView na všech stránkách.
         * Custom eventy (Lead, Purchase) se firnou per-page přes window.fbq. */}
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
