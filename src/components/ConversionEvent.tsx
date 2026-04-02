"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires a GA4 conversion event when the thank-you page loads.
 * Event name: "formular_odeslani" — use this in GA4 to mark as conversion.
 */
export default function ConversionEvent() {
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "formular_odeslani", {
        event_category: "kontakt",
        event_label: "zajemce_rodic",
      });
    }
  }, []);

  return null;
}
