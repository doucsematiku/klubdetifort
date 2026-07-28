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

const res = await calendar.events.list({
  calendarId,
  timeMin: "2026-06-09T00:00:00+02:00",
  timeMax: "2026-06-12T23:59:59+02:00",
  singleEvents: true,
  showDeleted: true,
  maxResults: 250,
});

console.log("Eventů v kalendáři:", res.data.items?.length || 0);
for (const ev of res.data.items || []) {
  console.log(
    `[${ev.status}] ${ev.start?.dateTime} | iCalUID: ${ev.iCalUID} | summary: ${ev.summary}`
  );
}
