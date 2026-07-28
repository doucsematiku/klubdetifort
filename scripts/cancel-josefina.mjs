/**
 * Zruší konkrétní rezervaci v Calendar + Sheet.
 * Slot uvolněn v SLOT_REVISIONS (v1 → v2).
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
  scopes: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});
const calendar = google.calendar({ version: "v3", auth });
const sheets = google.sheets({ version: "v4", auth });
const calendarId = process.env.PROHLIDKY_CALENDAR_ID;
const sheetId = process.env.GOOGLE_SHEET_ID;

const EVENT_ID = "pf20260610t0900v1";
const SHEET_TAB = "Rezervace prohlídek";
const MATCH_EMAIL = "josefinamik@icloud.com";

// 1) Smazat event
console.log("=== Calendar ===");
try {
  await calendar.events.delete({ calendarId, eventId: EVENT_ID, sendUpdates: "none" });
  console.log("✓ smazán:", EVENT_ID);
} catch (err) {
  console.log("✗ chyba:", err.message);
}

// 2) Smazat řádek ze Sheetu
console.log("\n=== Sheet ===");
const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
const sheet = (meta.data.sheets || []).find((s) => s.properties?.title === SHEET_TAB);
if (!sheet) {
  console.log("List nenalezen:", SHEET_TAB);
  process.exit(1);
}
const sheetIdNum = sheet.properties.sheetId;

const rows = await sheets.spreadsheets.values.get({
  spreadsheetId: sheetId,
  range: `${SHEET_TAB}!A:K`,
});
const values = rows.data.values || [];
const headers = values[0] || [];
const emailColIdx = headers.findIndex((h) => h && h.toLowerCase().includes("mail"));
console.log("Email sloupec idx:", emailColIdx);

let matchedRow = -1;
for (let i = 1; i < values.length; i++) {
  if ((values[i][emailColIdx] || "").toLowerCase().trim() === MATCH_EMAIL) {
    matchedRow = i;
    break;
  }
}

if (matchedRow === -1) {
  console.log("Řádek s emailem", MATCH_EMAIL, "nenalezen");
} else {
  console.log("Maže se řádek", matchedRow + 1, ":", values[matchedRow].slice(0, 6).join(" | "));
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetIdNum,
              dimension: "ROWS",
              startIndex: matchedRow,
              endIndex: matchedRow + 1,
            },
          },
        },
      ],
    },
  });
  console.log("✓ Sheet řádek smazán");
}

console.log("\n=== Hotovo ===");
console.log("Po deployi bude slot 2026-06-10 09:00 znovu volný (revize v2).");
