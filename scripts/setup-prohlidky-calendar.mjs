/**
 * Jednorázový setup skript:
 *  1) vytvoří dedikovaný Google Calendar "Prohlídky Klub Fořt" pod service accountem
 *  2) nasdílí ho s reditel@doucse.cz s právem writer (zobrazí se mu v Calendar UI)
 *  3) vypíše PROHLIDKY_CALENDAR_ID který se přidá do .env.local / Vercel env
 *
 * Spuštění:  node scripts/setup-prohlidky-calendar.mjs
 *
 * Vyžaduje:  v GCP projektu (tutor-lms-project-410609) zapnuté Google Calendar API.
 *            Pokud není, skript vrátí 403 s URL kde se to zapne.
 */

import { google } from "googleapis";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env.local");

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("Chybí .env.local v", envPath);
    process.exit(1);
  }
  const raw = readFileSync(envPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}

loadEnv();

const credsB64 = process.env.GOOGLE_CREDENTIALS;
if (!credsB64) {
  console.error("Chybí GOOGLE_CREDENTIALS v .env.local");
  process.exit(1);
}
const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf-8"));

const SHARE_WITH = "reditel@doucse.cz";
const CAL_SUMMARY = "Prohlídky Klub Fořt";
const CAL_DESCRIPTION =
  "Rezervace prohlídek areálu Klubu dětí Farma Fořt (klubdetifort.cz). Eventy zakládá rezervační systém automaticky.";
const CAL_TIMEZONE = "Europe/Prague";

const auth = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

async function main() {
  console.log("Service account:", creds.client_email);
  console.log("GCP project:", creds.project_id);
  console.log();

  // 1) Vyhledat zda už neexistuje kalendář s tímto summary
  console.log("Hledám existující kalendář…");
  const list = await calendar.calendarList.list({ maxResults: 250 });
  let existing = (list.data.items || []).find((c) => c.summary === CAL_SUMMARY);

  if (existing && existing.id) {
    console.log("Kalendář už existuje:", existing.id);
  } else {
    console.log("Vytvářím nový kalendář…");
    const created = await calendar.calendars.insert({
      requestBody: {
        summary: CAL_SUMMARY,
        description: CAL_DESCRIPTION,
        timeZone: CAL_TIMEZONE,
      },
    });
    existing = created.data;
    console.log("Vytvořeno. Calendar ID:", existing.id);
  }

  const calendarId = existing.id;

  // 2) Sdílet s reditel@doucse.cz
  console.log(`Nastavuji sdílení s ${SHARE_WITH} (writer)…`);
  try {
    await calendar.acl.insert({
      calendarId,
      requestBody: {
        scope: { type: "user", value: SHARE_WITH },
        role: "writer",
      },
    });
    console.log("Sdílení OK.");
  } catch (err) {
    const msg = err?.errors?.[0]?.message || err?.message || String(err);
    if (msg.includes("already") || msg.includes("Duplicate")) {
      console.log("Sdílení už existuje, OK.");
    } else {
      console.warn("Sdílení selhalo (lze zkusit znovu):", msg);
    }
  }

  console.log();
  console.log("============================================");
  console.log("PROHLIDKY_CALENDAR_ID =", calendarId);
  console.log("============================================");
  console.log();
  console.log("Přidat do .env.local i do Vercel env:");
  console.log(`PROHLIDKY_CALENDAR_ID=${calendarId}`);
}

main().catch((err) => {
  console.error("CHYBA:", err?.errors || err?.message || err);
  if (err?.code === 403 && String(err?.message).includes("disabled")) {
    console.error("\nZapni Calendar API:");
    console.error(
      `  https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=${creds.project_id}`
    );
  }
  process.exit(1);
});
