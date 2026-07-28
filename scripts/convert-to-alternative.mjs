/**
 * Konvertuje rezervaci na alternativu: smaže event v Calendar,
 * smaže řádek z listu „Rezervace prohlídek", přidá řádek do
 * „Alternativy prohlídek".
 *
 * Spuštění:
 *   node scripts/convert-to-alternative.mjs <eventId> <email> "<poznamka>"
 *
 * Před tímto:
 *   - SB transfer (rezervace → alternativy) udělej zvlášť přes SQL
 *
 * Po tomto:
 *   - Posuň SLOT_REVISIONS v src/lib/prohlidky-slots.ts (v1 → v2)
 *   - Build + deploy
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

const [, , EVENT_ID, MATCH_EMAIL, POZNAMKA] = process.argv;
if (!EVENT_ID || !MATCH_EMAIL) {
  console.error('Použití: node scripts/convert-to-alternative.mjs <eventId> <email> "<poznamka>"');
  process.exit(1);
}
const REZERVACE_TAB = "Rezervace prohlídek";
const ALTERNATIVY_TAB = "Alternativy prohlídek";

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

// 1) Smazat Calendar event
console.log(`=== Calendar event ${EVENT_ID} ===`);
try {
  await calendar.events.delete({ calendarId, eventId: EVENT_ID, sendUpdates: "none" });
  console.log("✓ smazán");
} catch (err) {
  console.log("✗ chyba:", err.message);
}

// 2) Najít řádek v Rezervace prohlídek + extrahovat data
console.log(`\n=== Sheet ${REZERVACE_TAB} ===`);
const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
const rezSheet = (meta.data.sheets || []).find((s) => s.properties?.title === REZERVACE_TAB);
const altSheet = (meta.data.sheets || []).find((s) => s.properties?.title === ALTERNATIVY_TAB);
if (!rezSheet || !altSheet) {
  console.log("List nenalezen:", REZERVACE_TAB, "nebo", ALTERNATIVY_TAB);
  process.exit(1);
}

const rezData = await sheets.spreadsheets.values.get({
  spreadsheetId: sheetId,
  range: `${REZERVACE_TAB}!A:K`,
});
const rezValues = rezData.data.values || [];
const headers = rezValues[0] || [];
const emailColIdx = headers.findIndex((h) => h && h.toLowerCase().includes("mail"));

let row = null;
let rowIdx = -1;
for (let i = 1; i < rezValues.length; i++) {
  if ((rezValues[i][emailColIdx] || "").toLowerCase().trim() === MATCH_EMAIL.toLowerCase()) {
    row = rezValues[i];
    rowIdx = i;
    break;
  }
}

if (!row) {
  console.log("Řádek s emailem", MATCH_EMAIL, "nenalezen");
  process.exit(1);
}

console.log("Nalezen řádek", rowIdx + 1, ":", row.slice(0, 6).join(" | "));

// Layout Rezervace prohlídek:
// 0: Odesláno | 1: Den | 2: Čas od | 3: Čas do | 4: Rodič | 5: E-mail | 6: Telefon | 7: Děti (info) | 8: Počet dětí | 9: Slot ID | 10: Calendar event ID
const parentName = row[4] || "";
const email = row[5] || "";
const phone = row[6] || "";
const childrenInfo = row[7] || "";
const childrenCount = row[8] || "";

// 3) Smazat řádek z Rezervace prohlídek
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: sheetId,
  requestBody: {
    requests: [
      {
        deleteDimension: {
          range: {
            sheetId: rezSheet.properties.sheetId,
            dimension: "ROWS",
            startIndex: rowIdx,
            endIndex: rowIdx + 1,
          },
        },
      },
    ],
  },
});
console.log("✓ smazán řádek z Rezervace prohlídek");

// 4) Přidat řádek do Alternativy prohlídek
// Layout: Odesláno | Rodič | E-mail | Telefon | Děti (info) | Počet dětí | Návrh 1 datum/od/do | Návrh 2 datum/od/do | Návrh 3 datum/od/do | Návrh 4 | Návrh 5 | Poznámka
const altRow = [
  new Date().toISOString(),
  parentName,
  email,
  phone,
  childrenInfo,
  childrenCount,
  "", "", "", // Návrh 1
  "", "", "", // Návrh 2
  "", "", "", // Návrh 3
  "", "",     // Návrh 4 a 5
  POZNAMKA || "",
];

await sheets.spreadsheets.values.append({
  spreadsheetId: sheetId,
  range: `${ALTERNATIVY_TAB}!A:R`,
  valueInputOption: "RAW",
  insertDataOption: "INSERT_ROWS",
  requestBody: { values: [altRow] },
});
console.log("✓ přidán řádek do Alternativy prohlídek");

console.log("\n=== Hotovo. Nezapomeň posunout SLOT_REVISIONS + redeploy. ===");
