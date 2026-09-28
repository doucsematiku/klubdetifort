"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const KLIC = "klubik-souhlas-mereni";
/** Vlastní událost, kterou se lišta znovu otevře (odkaz v patičce). */
export const OTEVRI_SOUHLAS = "klubik:otevri-souhlas";

type Volba = "ano" | "ne" | null;

/**
 * Souhlas s měřením návštěvnosti a reklamy.
 *
 * Bez souhlasu se do stránky nenačte vůbec nic od Googlu ani Meta — žádný
 * skript, žádná cookie. Teprve po kliknutí na „Souhlasím" se měření zapne.
 * Odvolat jde stejně snadno odkazem v patičce.
 */
export default function CookieConsent({
  gaId,
  awId,
  metaPixelId,
}: {
  gaId: string;
  awId: string;
  metaPixelId: string;
}) {
  const [volba, setVolba] = useState<Volba>(null);
  const [rozhodnuto, setRozhodnuto] = useState(true); // než přečteme uložené, lištu neblikáme

  useEffect(() => {
    const ulozene = localStorage.getItem(KLIC) as Volba;
    setVolba(ulozene ?? null);
    setRozhodnuto(ulozene === "ano" || ulozene === "ne");
    const znovu = () => setRozhodnuto(false);
    window.addEventListener(OTEVRI_SOUHLAS, znovu);
    return () => window.removeEventListener(OTEVRI_SOUHLAS, znovu);
  }, []);

  const nactiMereni = useCallback(() => {
    if (document.getElementById("gtag-src")) return;

    const gtagSrc = document.createElement("script");
    gtagSrc.id = "gtag-src";
    gtagSrc.async = true;
    gtagSrc.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(gtagSrc);

    const gtagInit = document.createElement("script");
    gtagInit.id = "gtag-init";
    gtagInit.textContent = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
      gtag('config', '${awId}');
    `;
    document.head.appendChild(gtagInit);

    const meta = document.createElement("script");
    meta.id = "meta-pixel-init";
    meta.textContent = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${metaPixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(meta);
  }, [gaId, awId, metaPixelId]);

  useEffect(() => {
    if (volba === "ano") nactiMereni();
  }, [volba, nactiMereni]);

  function rozhodni(v: Exclude<Volba, null>) {
    localStorage.setItem(KLIC, v);
    setVolba(v);
    setRozhodnuto(true);
    // odvolání souhlasu — ať se skripty nenačítají dál v téhle relaci
    if (v === "ne" && document.getElementById("gtag-src")) location.reload();
  }

  if (rozhodnuto) return null;

  return (
    <div
      role="dialog"
      aria-label="Souhlas s měřením návštěvnosti"
      className="fade-in fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-[1.75rem] bg-white/95 p-4 shadow-[0_-8px_40px_-12px_rgba(58,54,45,0.35)] ring-1 ring-dark/5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:p-5">
        <p className="text-[13px] leading-snug sm:text-sm sm:leading-relaxed text-dark/80">
          Abychom web mohli zlepšovat, rádi bychom měřili jeho návštěvnost
          nástroji Google a Meta. Bez vašeho souhlasu se nic takového
          nespustí — web funguje úplně stejně.{" "}
          <Link href="/ochrana-osobnich-udaju" className="font-semibold text-forest underline">
            Jak nakládáme s údaji
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => rozhodni("ne")}
            className="min-h-11 flex-1 rounded-full border-2 border-beige-dark px-5 py-2.5 text-sm font-semibold text-dark/80 transition hover:bg-beige sm:flex-none"
          >
            Odmítnout
          </button>
          <button
            onClick={() => rozhodni("ano")}
            className="min-h-11 flex-1 rounded-full bg-orange px-5 py-2.5 text-sm font-bold text-dark shadow-glow transition hover:bg-orange-hover sm:flex-none"
          >
            Souhlasím
          </button>
        </div>
      </div>
    </div>
  );
}

/** Odkaz do patičky — souhlas jde kdykoliv změnit nebo odvolat. */
export function ZmenitSouhlas({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OTEVRI_SOUHLAS))}
      className={className}
    >
      Nastavení souhlasu
    </button>
  );
}
