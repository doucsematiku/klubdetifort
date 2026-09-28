/**
 * Sdílená konfigurace formuláře prohlídek (individuální model).
 *
 * maxDatumISO() je nejzazší datum, do kterého lze navrhovat termíny prohlídky.
 * Používá se NA OBOU stranách (klientský date input `max` i server-side validace),
 * aby nemohlo dojít k driftu mezi tím, co UI povolí, a tím, co server přijme.
 *
 * Od 27. 9. 2026 je okno posuvné (dnes + MAX_DNU_DOPREDU) — dřív tu bylo pevné
 * 31. 8. 2026 a po něm formulář tiše odmítal všechny návrhy. Počítá se vždy
 * „teď" (ne při buildu), jinak by statická stránka po čase zase vypršela.
 */
export const MAX_DNU_DOPREDU = 90;

/** YYYY-MM-DD (Europe/Prague) — dnes + MAX_DNU_DOPREDU */
export function maxDatumISO(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague" }).format(
    new Date(now.getTime() + MAX_DNU_DOPREDU * 86_400_000)
  );
}

/** „26. 12. 2026" — pro chybové hlášky */
export function maxDatumLabel(now: Date = new Date()): string {
  const [r, m, d] = maxDatumISO(now).split("-").map(Number);
  return `${d}. ${m}. ${r}`;
}
