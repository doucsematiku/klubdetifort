/**
 * Definice slotů pro prohlídky areálu Klub dětí Farma Fořt.
 *
 * Bloky 30 min + 15 min pauza mezi bloky. Časová zóna Europe/Prague (CEST v červnu = UTC+2).
 *
 * Termíny:
 *   - úterý  9.6.2026  14:00–17:00 → 4 sloty
 *   - středa 10.6.2026  9:00–11:00 → 3 sloty
 *   - čtvrtek 11.6.2026 14:00–17:00 → 4 sloty
 *   - pátek 12.6.2026  9:00–11:00 → 3 sloty
 *   = celkem 14 slotů
 *
 * Rezervace jsou otevřené do 7.6.2026 23:59 Europe/Prague.
 */

export const SLOT_LEN_MIN = 30;
export const BREAK_LEN_MIN = 15;
/** Minimální „lead time" — rezervaci lze udělat nejpozději tolik hodin před startem slotu. */
export const MIN_LEAD_HOURS = 24;
export const TZ = "Europe/Prague";

export interface WindowDef {
  /** YYYY-MM-DD */
  date: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  /** Český lidský label dne, pro UI */
  dayLabel: string;
}

export const WINDOWS: WindowDef[] = [
  { date: "2026-06-09", start: "14:00", end: "17:00", dayLabel: "úterý 9. června" },
  { date: "2026-06-10", start: "09:00", end: "11:00", dayLabel: "středa 10. června" },
  { date: "2026-06-11", start: "14:00", end: "17:00", dayLabel: "čtvrtek 11. června" },
  { date: "2026-06-12", start: "09:00", end: "11:00", dayLabel: "pátek 12. června" },
];

export interface Slot {
  /** unikátní ID = `${date}T${HH:MM}` */
  id: string;
  /** YYYY-MM-DD */
  date: string;
  /** "HH:MM" */
  start: string;
  /** "HH:MM" */
  end: string;
  /** ISO 8601 s offsetem +02:00 (CEST), pro Google Calendar dateTime */
  startISO: string;
  endISO: string;
  /** český label dne pro UI */
  dayLabel: string;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseHM(hm: string): { h: number; m: number } {
  const [h, m] = hm.split(":").map(Number);
  return { h, m };
}

function fmtHM(h: number, m: number): string {
  return `${pad(h)}:${pad(m)}`;
}

/** vrátí 06 nebo 07 podle data (v červnu vždy +02:00 CEST) */
function offsetForDate(_dateISO: string): string {
  // 9.–12. června 2026 je v Europe/Prague CEST = +02:00
  return "+02:00";
}

export function buildSlotsFromWindow(w: WindowDef): Slot[] {
  const slots: Slot[] = [];
  const { h: endH, m: endM } = parseHM(w.end);
  let { h: curH, m: curM } = parseHM(w.start);

  while (true) {
    // konec slotu
    const totalEndMinutes = curH * 60 + curM + SLOT_LEN_MIN;
    const slotEndH = Math.floor(totalEndMinutes / 60);
    const slotEndM = totalEndMinutes % 60;

    // slot musí skončit nejpozději v endH:endM
    if (slotEndH > endH || (slotEndH === endH && slotEndM > endM)) break;

    const start = fmtHM(curH, curM);
    const end = fmtHM(slotEndH, slotEndM);
    const offset = offsetForDate(w.date);

    slots.push({
      id: `${w.date}T${start}`,
      date: w.date,
      start,
      end,
      startISO: `${w.date}T${start}:00${offset}`,
      endISO: `${w.date}T${end}:00${offset}`,
      dayLabel: w.dayLabel,
    });

    // další start = konec + pauza
    const nextStartTotal = totalEndMinutes + BREAK_LEN_MIN;
    curH = Math.floor(nextStartTotal / 60);
    curM = nextStartTotal % 60;
  }

  return slots;
}

export function getAllSlots(): Slot[] {
  return WINDOWS.flatMap(buildSlotsFromWindow);
}

/** ID = `${date}T${HH:MM}` → vrátí slot z předdefinovaného setu, nebo null */
export function findSlotById(id: string): Slot | null {
  return getAllSlots().find((s) => s.id === id) ?? null;
}

/** deterministicky iCalUID pro Google Calendar (informativní, ne primární klíč) */
export function slotToICalUID(slot: Slot): string {
  return `prohlidka-fort-${slot.date}-${slot.start.replace(":", "")}@klubdetifort.cz`;
}

/**
 * Per-slot override revizí pro `slotToEventId`.
 *
 * Když admin musí uvolnit konkrétní slot (rezervace zrušena, rodič nedorazil
 * apod.), Google Calendar drží původní event ID v "graveyardu" — nelze
 * re-insertovat se stejným ID. Řešením je posunout revizi pro tento jeden slot
 * (např. v1 → v2). Ostatní sloty zůstávají s default revizí.
 *
 * Klíč: slot.id (formát `YYYY-MM-DDTHH:MM`)
 * Hodnota: aktuální revize (number). Pokud chybí, default 1.
 *
 * Po každém zrušení rezervace přidej / inkrementuj entry zde.
 */
const SLOT_REVISIONS: Record<string, number> = {
  // 2026-05-28: Josefina G. zrušila telefonicky — děti mladší než 1. třída,
  // domluveno na příští rok. Slot uvolněn pro jiné zájemce.
  "2026-06-10T09:00": 2,
  // 2026-05-28: Marek Žehra zrušil emailem — kolize s jinou schůzkou,
  // rezervoval si náhradní 11.6. 14:00. Slot uvolněn pro jiné zájemce.
  "2026-06-09T14:45": 2,
  // 2026-06-02: Jelena Lukášková zrušila telefonicky — přesunuto do
  // listu Alternativy prohlídek, ozve se s novým termínem. Slot uvolněn.
  "2026-06-11T15:30": 2,
};

/**
 * Deterministické event ID pro Google Calendar events.insert.
 * Event ID musí být base32hex: a-v + 0-9 + `-` `_`, délka 5–1024.
 *
 * Vrací např. `pf20260609t1400v1` (= production verze 1), nebo vyšší
 * revizi pokud slot byl admin-uvolněn (viz SLOT_REVISIONS).
 *
 * Concurrency atomic insert drží — všechny souběžné requesty generují stejné ID.
 */
export function slotToEventId(slot: Slot): string {
  const rev = SLOT_REVISIONS[slot.id] ?? 1;
  return `pf${slot.date.replace(/-/g, "")}t${slot.start.replace(":", "")}v${rev}`;
}

/** Vrací true pokud do startu slotu zbývá víc než MIN_LEAD_HOURS hodin. */
export function isSlotBookable(slot: Slot, now: Date = new Date()): boolean {
  const start = new Date(slot.startISO).getTime();
  const cutoff = now.getTime() + MIN_LEAD_HOURS * 3600_000;
  return cutoff < start;
}

/** Vrací true pokud existuje alespoň jeden slot, který je ještě bookable. */
export function isRegistrationOpen(now: Date = new Date()): boolean {
  return getAllSlots().some((s) => isSlotBookable(s, now));
}
