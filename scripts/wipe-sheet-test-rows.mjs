/**
 * Vymaže data z listů "Rezervace prohlídek" a "Alternativy prohlídek"
 * (ponechá hlavičky). Použij jen pro vyčištění test rows před produkcí.
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

const creds = JSON.parse(
  Buffer.from(process.env.GOOGLE_CREDENTIALS, "base64").toString("utf-8")
);
const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });
const sheetId = process.env.GOOGLE_SHEET_ID;

for (const list of ["Rezervace prohlídek", "Alternativy prohlídek"]) {
  try {
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${list}!A2:Z`,
    });
    console.log("Vyčištěno:", list);
  } catch (err) {
    console.log("Skip:", list, "—", err.message);
  }
}
