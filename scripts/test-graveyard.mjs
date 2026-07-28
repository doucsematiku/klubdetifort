/**
 * Test: zda Google Calendar dovolí znovu vložit event se stejným ID jako cancelled event.
 */
import { google } from "googleapis";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const creds = JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8"));
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });
const calendarId = process.env.PROHLIDKY_CALENDAR_ID;

// Pokus o re-insert s ID, které je v graveyardu (cancelled)
const id = "pf20260611t1530"; // cancelled — Test Alice

console.log(`Pokus o insert se stejným ID jako cancelled event: ${id}`);
try {
  const res = await calendar.events.insert({
    calendarId,
    requestBody: {
      id,
      summary: "TEST graveyard re-insert",
      start: { dateTime: "2026-06-11T15:30:00+02:00", timeZone: "Europe/Prague" },
      end: { dateTime: "2026-06-11T16:00:00+02:00", timeZone: "Europe/Prague" },
    },
  });
  console.log("ÚSPĚCH — graveyard NENÍ problém! Event ID:", res.data.id);
  // Uklidit po testu
  await calendar.events.delete({ calendarId, eventId: id });
  console.log("(uklizeno)");
} catch (err) {
  console.log("CHYBA:", err?.code, err?.message?.slice(0, 100));
  console.log("Graveyard ID problém potvrzen — musíme změnit pattern.");
}
