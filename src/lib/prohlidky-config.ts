/**
 * Sdílená konfigurace formuláře prohlídek (individuální model).
 *
 * MAX_DATE je nejzazší datum, do kterého lze navrhovat termíny prohlídky.
 * Používá se NA OBOU stranách (klientský date input `max` i server-side validace),
 * aby nemohlo dojít k driftu mezi tím, co UI povolí, a tím, co server přijme.
 *
 * Posun deadline = změna na jediném místě (+ případně copy „do konce srpna" v textech).
 */
export const MAX_DATE = "2026-08-31";
export const MAX_DATE_LABEL = "31. 8. 2026";
