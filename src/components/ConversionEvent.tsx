"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires GA4 + Google Ads conversion events when the thank-you page loads.
 * GA4 event: "formular_odeslani" — mark as key event in GA4.
 * Google Ads: "conversion" with send_to AW-18058635917 — import in Google Ads.
 */
export default function ConversionEvent() {
  useEffect(() => {
    if (typeof window.gtag === "function") {
      // GA4 conversion event
      window.gtag("event", "formular_odeslani", {
        event_category: "kontakt",
        event_label: "zajemce_rodic",
      });
      // Google Ads conversion (configure conversion label in Google Ads)
      window.gtag("event", "conversion", {
        send_to: "AW-18058635917",
      });
    }
  }, []);

  return null;
}
