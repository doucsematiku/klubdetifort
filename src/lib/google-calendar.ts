/**
 * Google Calendar klient pro rezervace prohlídek.
 *
 * Atomic insert: používá events.import s deterministickým iCalUID.
 * Pokud event s daným UID už v kalendáři existuje, Google vrátí 409 Conflict.
 * Žádná naše vlastní concurrency control — race condition řeší Google sám.
 */

import { google, type calendar_v3 } from "googleapis";
import type { Slot } from "./prohlidky-slots";
import { slotToEventId, TZ } from "./prohlidky-slots";

function getCalendarClient(): calendar_v3.Calendar | null {
  const credsB64 = process.env.GOOGLE_CREDENTIALS;
  if (!credsB64) return null;

  const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf-8"));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

export interface ReservationDetails {
  parentName: string;
  email: string;
  phone: string;
  childrenInfo: string;
  childrenCount: number;
}

/**
 * Vrátí množinu ID slotů, které jsou už obsazené.
 * Načítá pouze eventy v rozsahu všech předdefinovaných slotů.
 */
export async function getBookedSlotIds(
  rangeStartISO: string,
  rangeEndISO: string
): Promise<Set<string>> {
  const calendar = getCalendarClient();
  const calendarId = process.env.PROHLIDKY_CALENDAR_ID;
  if (!calendar || !calendarId) {
    console.error("getBookedSlotIds: missing config", {
      hasCalendar: !!calendar,
      hasCalendarId: !!calendarId,
    });
    return new Set();
  }

  try {
    const res = await calendar.events.list({
      calendarId,
      timeMin: rangeStartISO,
      timeMax: rangeEndISO,
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100,
      showDeleted: false,
    });

    const booked = new Set<string>();
    for (const ev of res.data.items || []) {
      // Cancelled eventy ignorovat — slot je v takovém případě uvolněný.
      // Atomic concurrency drží přes per-slot revize v `slotToEventId`:
      // admin musí po zrušení posunout revizi (v1 → v2) v SLOT_REVISIONS.
      if (ev.status === "cancelled") continue;
      // matchujeme podle dateTime začátku — odolnější než parsing iCalUID/id
      const startDateTime = ev.start?.dateTime;
      if (!startDateTime) continue;
      // např. "2026-06-09T14:00:00+02:00" → slotId "2026-06-09T14:00"
      const m = startDateTime.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):/);
      if (!m) continue;
      const slotId = `${m[1]}T${m[2]}:${m[3]}`;
      booked.add(slotId);
    }
    return booked;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("getBookedSlotIds error:", msg);
    return new Set();
  }
}

export interface InsertResult {
  ok: boolean;
  /** true pokud slot byl mezitím zarezervován jiným zájemcem (409 Conflict) */
  conflict: boolean;
  error?: string;
}

/**
 * Atomic insert rezervace. Vrací conflict=true při kolizi iCalUID (slot už obsazen).
 */
export async function insertReservation(
  slot: Slot,
  details: ReservationDetails
): Promise<InsertResult> {
  const calendar = getCalendarClient();
  const calendarId = process.env.PROHLIDKY_CALENDAR_ID;
  if (!calendar || !calendarId) {
    return { ok: false, conflict: false, error: "missing_config" };
  }

  const eventId = slotToEventId(slot);

  const summary = `Prohlídka — ${details.parentName} (${details.childrenCount} ${pluralChildren(
    details.childrenCount
  )})`;

  const description = [
    `Rezervace prohlídky areálu Klub dětí Farma Fořt.`,
    ``,
    `Rodič:    ${details.parentName}`,
    `Email:    ${details.email}`,
    `Telefon:  ${details.phone}`,
    `Děti:     ${details.childrenInfo}`,
    `Počet:    ${details.childrenCount}`,
    ``,
    `Termín:   ${slot.dayLabel}, ${slot.start}–${slot.end}`,
    ``,
    `(Záznam vytvořený rezervačním formulářem na klubdetifort.cz)`,
  ].join("\n");

  try {
    await calendar.events.insert({
      calendarId,
      sendUpdates: "none",
      requestBody: {
        id: eventId, // deterministicky → kolize vrátí 409
        summary,
        description,
        start: { dateTime: slot.startISO, timeZone: TZ },
        end: { dateTime: slot.endISO, timeZone: TZ },
        // attendees vynecháno: service account nemůže přidávat attendees
        // bez Workspace Domain-Wide Delegation. Kontaktní údaje rodiče
        // jsou v description (telefon, email). Confirmation email
        // se rodiči posílá zvlášť přes Resend.
        reminders: {
          useDefault: false,
          overrides: [{ method: "popup", minutes: 60 }],
        },
        status: "confirmed",
      },
    });

    return { ok: true, conflict: false };
  } catch (err) {
    const code =
      typeof err === "object" && err && "code" in err
        ? Number((err as { code: unknown }).code)
        : undefined;
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err && "message" in err
        ? String((err as { message: unknown }).message)
        : String(err);

    // 409 = duplicitní iCalUID = slot už obsazen
    if (code === 409 || /already exist|duplicate/i.test(msg)) {
      return { ok: false, conflict: true };
    }

    console.error("insertReservation error:", code, msg);
    return { ok: false, conflict: false, error: msg };
  }
}

function pluralChildren(n: number): string {
  if (n === 1) return "dítě";
  if (n >= 2 && n <= 4) return "děti";
  return "dětí";
}
