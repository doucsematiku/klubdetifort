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

const creds = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});
const calendar = google.calendar({ version: "v3", auth });
const calendarId = process.env.PROHLIDKY_CALENDAR_ID;

// Zkusíme různé varianty event ID
const variants = [
  "pf20260610t0945",
  "pf20260610a0945",
];

for (const id of variants) {
  console.log(`Test ID: "${id}" (length ${id.length})`);
  try {
    const res = await calendar.events.insert({
      calendarId,
      sendUpdates: "none",
      requestBody: {
        id,
        summary: `TEST ${id}`,
        start: { dateTime: "2026-07-01T10:00:00+02:00", timeZone: "Europe/Prague" },
        end: { dateTime: "2026-07-01T10:30:00+02:00", timeZone: "Europe/Prague" },
      },
    });
    console.log(`  OK created: ${res.data.id}`);
    // hned uklidíme
    await calendar.events.delete({ calendarId, eventId: id });
    console.log(`  (uklizeno)`);
  } catch (err) {
    console.log(`  CHYBA ${err.code}: ${err.message}`);
  }
  console.log();
}
