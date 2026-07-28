"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Fires GA4 + Google Ads + Meta Pixel conversion when the prázdniny thank-you
 * page loads.
 * - GA4 event: "rezervace_letni_prazdniny" — mark as key event in GA4.
 * - Google Ads: "conversion" — value + currency for enhanced conversions.
 * - Meta Pixel: "Lead" — pro FB Ads optimalizaci na konverzní leads.
 */
export default function PrazdninyConversionEvent({ value }: { value?: number }) {
  useEffect(() => {
    const v = value ?? 0;

    if (typeof window.gtag === "function") {
      window.gtag("event", "rezervace_letni_prazdniny", {
        event_category: "rezervace",
        event_label: "klub_deti_fort_leto",
        value: v,
        currency: "CZK",
      });

      window.gtag("event", "conversion", {
        send_to: "AW-18058635917",
        value: v,
        currency: "CZK",
      });
    }

    // Meta Pixel — standard "Lead" event s hodnotou pro FB Ads optimalizaci.
    // fbq je injectovaný v layout.tsx (META_PIXEL_ID 5663334577022716).
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", {
        value: v,
        currency: "CZK",
        content_name: "Letní prázdniny — Klub dětí Fořt",
        content_category: "prazdninovy_program",
      });
    }
  }, [value]);

  return null;
}
