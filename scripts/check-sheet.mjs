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
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});
const sheets = google.sheets({ version: "v4", auth });

const meta = await sheets.spreadsheets.get({
  spreadsheetId: process.env.GOOGLE_SHEET_ID,
});
console.log("Listy v tabulce:");
for (const s of meta.data.sheets || []) {
  console.log("  -", s.properties.title);
}

for (const list of ["Rezervace prohlídek", "Alternativy prohlídek"]) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${list}!A1:Z10`,
    });
    console.log(`\n--- ${list} ---`);
    for (const row of res.data.values || []) {
      console.log("  ", row.join(" | "));
    }
  } catch (err) {
    console.log(`\n--- ${list}: ${err.message}`);
  }
}
