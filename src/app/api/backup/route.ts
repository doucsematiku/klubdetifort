/**
 * Denní kompletní disaster-recovery backup → Google Drive.
 *
 * Zálohujeme VŠE potřebné k obnově webu na jiné infrastruktuře:
 *   1. Supabase data — všechny tabulky jako JSON (kompletní řádky)
 *   2. Supabase schema — column names + odhad typů (rekonstrukce DDL)
 *   3. Zdrojový kód — git zipball main z GitHub repo
 *   4. README-DISASTER-RECOVERY — postup pro obnovu
 *
 * Supabase Storage NEZÁLOHUJEME — projekt nemá žádné buckety ani objekty
 * (ověřeno 2026-06-10). Pokud se Storage začne používat, DOPLŇ sem zálohu
 * bucketů (vzor: doucsematiku-web /api/backup).
 *
 * Rotace: MAX_BACKUPS souborů v Drive složce (30 dní × 3 typy souborů = 90).
 * Cron: 30 4 * * * UTC (vercel.json) + email report na reditel@doucse.cz.
 *
 * Auth: Authorization: Bearer $CRON_SECRET (Vercel Cron header dodá sám).
 *
 * INCIDENT 2026-05-24 (doucsematiku): buggy cleanup smazal 30 dní záloh.
 * Proto: vlastní top-level Drive složka, vlastní unikátní prefix souborů,
 * cleanup maže POUZE soubory s naším prefixem a NIKDY folders.
 */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";
import { Resend } from "resend";
import { sendHeartbeat } from "@/lib/heartbeat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const DRIVE_FOLDER_ID =
  process.env.DRIVE_BACKUP_FOLDER_ID || "17e3A7wT2ZVZNQzEGuw0vUclhdiYMA6EG";
const GITHUB_REPO = "doucsematiku/klubdetifort";
const MAX_BACKUPS = 90; // 30 dní × 3 soubory/den (backup.json, code.zip, README.txt)
const REPORT_EMAIL_TO = process.env.BACKUP_REPORT_TO || "reditel@doucse.cz";
const REPORT_EMAIL_FROM = "noreply@klubdetifort.cz";
const SUPABASE_PROJECT_REF = "azzjtgwlqthimtkolfgt";

// Prefix VŠECH souborů této zálohy. Cleanup maže jen soubory s tímto prefixem
// — nikdy nesdílet prefix ani Drive složku s jiným projektem!
const FILENAME_PREFIX = "fort-klub-";

// Supabase tabulky (azzjtgwlqthimtkolfgt). Při přidání nové tabulky DOPLŇ SEM,
// jinak se nezálohuje. Všechny tabulky mají bigint `id` PK (pagination order).
const TABLES = ["prohlidky_rezervace", "prohlidky_alternativy"];

// ENV proměnné — jmenovaný seznam (hodnoty NEUKLÁDÁME do záloh — bezpečnost).
// Checklist pro obnovu: tohle všechno doplnit z Vercel dashboardu / password manageru.
const ENV_MANIFEST = [
  "# SUPABASE",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "",
  "# RESEND (transakční e-maily)",
  "RESEND_API_KEY",
  "",
  "# FAKTUROID",
  "FAKTUROID_CLIENT_ID",
  "FAKTUROID_CLIENT_SECRET",
  "FAKTUROID_SLUG",
  "FAKTUROID_WEBHOOK_SECRET",
  "",
  "# GOOGLE (service account — Sheets + Calendar)",
  "GOOGLE_CREDENTIALS",
  "GOOGLE_SHEET_ID",
  "PROHLIDKY_CALENDAR_ID",
  "PRAZDNINY_SHEET_TAB",
  "",
  "# PRÁZDNINOVÝ PROGRAM",
  "PRAZDNINY_OFFLINE_RESERVATIONS",
  "",
  "# BACKUP (tento endpoint)",
  "DRIVE_CLIENT_ID",
  "DRIVE_CLIENT_SECRET",
  "DRIVE_REFRESH_TOKEN",
  "DRIVE_BACKUP_FOLDER_ID",
  "GITHUB_TOKEN",
  "CRON_SECRET",
];

type TableSchema = {
  columns: string[];
  columnTypes: Record<string, string>;
};

type BackupStats = {
  dbRows: number;
  dbSizeBytes: number;
  codeBytes: number;
  codeStatus: string;
  deletedOldBackups: number;
  elapsedSec: string;
  tables: Record<string, number>;
  errors: string[];
};

type EmailResult = { sent: boolean; error: string | null };

function getDriveClient() {
  const clientId = process.env.DRIVE_CLIENT_ID;
  const clientSecret = process.env.DRIVE_CLIENT_SECRET;
  const refreshToken = process.env.DRIVE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing DRIVE_CLIENT_ID / DRIVE_CLIENT_SECRET / DRIVE_REFRESH_TOKEN");
  }
  const oauth2 = new google.auth.OAuth2(clientId, clientSecret);
  oauth2.setCredentials({ refresh_token: refreshToken });
  return google.drive({ version: "v3", auth: oauth2 });
}

/** Stáhne všechny řádky tabulky přes PostgREST (pagination po 1000, order by id). */
async function fetchAllRows(
  table: string,
  errors: string[]
): Promise<Record<string, unknown>[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    errors.push(`table ${table}: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY`);
    return [];
  }

  const all: Record<string, unknown>[] = [];
  const PAGE = 1000;
  let offset = 0;
  while (true) {
    const res = await fetch(
      `${url}/rest/v1/${encodeURIComponent(table)}?select=*&order=id.asc&offset=${offset}&limit=${PAGE}`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      errors.push(`table ${table}: HTTP ${res.status} ${await res.text()}`);
      return all;
    }
    const data = (await res.json()) as Record<string, unknown>[];
    if (!Array.isArray(data) || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
    offset += PAGE;
  }
  return all;
}

/** Odhad schématu z prvního řádku (pro rekonstrukci DDL při obnově). */
function extractSchema(rows: Record<string, unknown>[]): TableSchema {
  if (!rows.length) return { columns: [], columnTypes: {} };
  const sample = rows[0];
  const columns = Object.keys(sample);
  const columnTypes: Record<string, string> = {};
  for (const col of columns) {
    const v = sample[col];
    if (v === null) columnTypes[col] = "nullable";
    else if (typeof v === "number") columnTypes[col] = Number.isInteger(v) ? "integer" : "numeric";
    else if (typeof v === "boolean") columnTypes[col] = "boolean";
    else if (Array.isArray(v)) columnTypes[col] = "array";
    else if (typeof v === "object") columnTypes[col] = "jsonb";
    else if (typeof v === "string") {
      columnTypes[col] = /^\d{4}-\d{2}-\d{2}T/.test(v) ? "timestamp" : "text";
    } else {
      columnTypes[col] = "unknown";
    }
  }
  return { columns, columnTypes };
}

/**
 * Rotace starých záloh. Defense-in-depth po incidentu 2026-05-24:
 *   1. Drive query filtruje mimeType != folder A name contains náš prefix
 *   2. JS safety net: znovu filtr na startsWith(prefix) + mimeType
 *   3. 404 při delete tolerujeme (race / manuální smazání)
 */
async function cleanupOldBackups(
  drive: ReturnType<typeof google.drive>,
  errors: string[]
): Promise<number> {
  const res = await drive.files.list({
    q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder' and name contains '${FILENAME_PREFIX}'`,
    fields: "files(id,name,createdTime,mimeType)",
    orderBy: "createdTime desc",
    pageSize: 500,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });
  const all = res.data.files || [];
  // JS safety net — nikdy folder, jen naše soubory
  const ours = all.filter(
    (f) =>
      f.mimeType !== "application/vnd.google-apps.folder" &&
      f.name?.startsWith(FILENAME_PREFIX)
  );
  if (ours.length <= MAX_BACKUPS) return 0;
  const toDelete = ours.slice(MAX_BACKUPS);
  let deleted = 0;
  for (const f of toDelete) {
    if (!f.id) continue;
    try {
      await drive.files.delete({ fileId: f.id, supportsAllDrives: true });
      deleted++;
    } catch (err) {
      // 404 = soubor mezitím už neexistuje (race condition / manuální smazání) — ignoruj
      const code =
        (err as { code?: number })?.code ??
        (err as { response?: { status?: number } })?.response?.status;
      if (code === 404) {
        console.warn(`[backup] cleanup skip 404: ${f.id} (${f.name})`);
        continue;
      }
      errors.push(`cleanup ${f.id} (${f.name}): ${err instanceof Error ? err.message : "unknown"}`);
    }
  }
  return deleted;
}

async function uploadToDrive(
  drive: ReturnType<typeof google.drive>,
  name: string,
  mimeType: string,
  buffer: Buffer
): Promise<void> {
  await drive.files.create({
    requestBody: { name, parents: [DRIVE_FOLDER_ID], mimeType },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id,name,size",
    supportsAllDrives: true,
  });
}

function buildDisasterRecoveryReadme(today: string, stats: BackupStats): string {
  const timestamp = new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" });
  return `================================================================================
  KLUBDETIFORT.CZ (fort-klub) — DISASTER RECOVERY GUIDE
  Záloha vytvořena: ${timestamp}
================================================================================

CO JE V TÉTO ZÁLOZE (den ${today}):
=====================================

  1. fort-klub-backup-${today}.json
     - Všechna data z tabulek Supabase (PostgREST export):
       ${TABLES.join(", ")}
     - + schéma každé tabulky (názvy sloupců + odhad typů)
     - + envManifest (jmenovaný seznam env proměnných)
     Statistika: ${stats.dbRows} řádků, ${(stats.dbSizeBytes / 1024).toFixed(1)} kB

  2. fort-klub-code-${today}.zip
     - Zdrojový kód z github.com/${GITHUB_REPO} (větev main)
     Statistika: ${(stats.codeBytes / 1024 / 1024).toFixed(1)} MB
     !!! POZOR: zip = stav GitHub větve main, NE nutně Vercel produkce.
     Pokud produkce běží z Vercel snapshotu s nepushnutými/untracked
     soubory, v tomto zipu CHYBÍ. Před spoléháním na obnovu kódu ověř,
     že origin/main odpovídá poslednímu produkčnímu deployi (vercel
     inspect <prod-url>, případně stáhni deployment source z Vercelu).

  3. fort-klub-README-${today}.txt
     - Tento soubor.

  POZN. Supabase Storage se NEZÁLOHUJE — projekt nemá žádné buckety ani
  objekty (storage.objects prázdné, ověřeno 2026-06-10). Pokud se Storage
  začne používat, rozšiř /api/backup o zálohu bucketů.


KRITICKÉ PŘÍSTUPY MIMO ZÁLOHU:
===============================

Tyto věci NEJSOU v záloze a musíš je obnovit ručně:

  * Vercel env vars (seznam je v .json záloze pod klíčem "envManifest").
    Hodnoty ve Vercel dashboardu (projekt fort-klub) / password manageru
    účtu doucsematiku@gmail.com.
  * Resend API key — resend.com, doména klubdetifort.cz (DNS verifikace).
  * Fakturoid OAuth credentials — app.fakturoid.cz → Nastavení → API.
  * Google service account (Sheets + Calendar) — GOOGLE_CREDENTIALS (base64 JSON).
  * Google OAuth (Drive backup) — DRIVE_CLIENT_ID/SECRET/REFRESH_TOKEN.
  * Doména klubdetifort.cz — DNS u registrátora.


SCÉNÁŘE OBNOVY:
================

A) "Vercel spadl / deployment smazán"
   1. Naklonuj GitHub repo: git clone https://github.com/${GITHUB_REPO}.git
      (nebo rozbal fort-klub-code-${today}.zip)
   2. Obnov .env.local podle envManifest (hodnoty z Vercel dashboardu)
   3. npm install && npm run build
   4. vercel --prod (nebo Railway/Render/Fly.io jako fallback hosting)
   5. Změň DNS A/CNAME záznam na nový hosting

B) "Supabase projekt smazán"
   1. Vytvoř nový Supabase projekt (náhrada za ${SUPABASE_PROJECT_REF})
   2. Pro každou tabulku z tables[*]: CREATE TABLE podle schema.columnTypes
      (id bigint generated by default as identity primary key, ostatní dle typů)
   3. INSERT dat: jsonb_populate_recordset s tables[*].rows
   4. Aktualizuj SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY ve Vercel env
   5. Zkontroluj RLS policies (service role je obchází, ale anon klient ne)

C) "Přístupy kompromitovány"
   1. Změň hesla: doucsematiku@gmail.com, reditel@doucse.cz
   2. Revokuj Supabase service role key → vygeneruj nový
   3. Rotuj Resend API key, Fakturoid credentials, Google OAuth tokeny
   4. Zruš Vercel API tokeny → vygeneruj nové
   5. Pokračuj scénářem A + B

KONTAKTY:
=========

  Vlastník: Ivan Jadrný (reditel@doucse.cz)
  GitHub org: doucsematiku (repo klubdetifort)
  Google Cloud / Drive: doucsematiku@gmail.com

================================================================================
`;
}

async function sendBackupReport(today: string, stats: BackupStats): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[backup] RESEND_API_KEY missing — report email skipped");
    return { sent: false, error: "RESEND_API_KEY missing" };
  }
  const success = stats.errors.length === 0;
  const subject = success
    ? `[OK] Záloha fort-klub — ${today}`
    : `[CHYBA] Záloha fort-klub — ${today} — ${stats.errors.length} chyb`;

  const tableRows = Object.entries(stats.tables)
    .map(([t, n]) => `  • ${t}: ${n} řádků`)
    .join("\n");
  const errList = stats.errors.length
    ? "\n\nCHYBY:\n" + stats.errors.map((e) => `  ✗ ${e}`).join("\n")
    : "";

  const text = `Záloha dokončena za ${stats.elapsedSec}s.

SUPABASE TABULKY (celkem ${stats.dbRows} řádků, ${(stats.dbSizeBytes / 1024).toFixed(1)} kB):
${tableRows || "  (žádné)"}

ZDROJOVÝ KÓD: ${stats.codeStatus} · ${(stats.codeBytes / 1024 / 1024).toFixed(1)} MB
(zip = stav GitHub main — pokud má produkce nepushnuté soubory, v zipu chybí!)

STORAGE: nezálohuje se (projekt nemá buckety — viz README v záloze).

ROTACE: ${stats.deletedOldBackups} starých záloh smazáno (limit ${MAX_BACKUPS}).

Drive složka: https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}${errList}
`;

  // Mail jen při chybě — OK stav hlídá Velín přes heartbeat (rozhodnutí Ivana 19. 7. 2026).
  await sendHeartbeat(
    "backup",
    success ? "ok" : "fail",
    success ? `${stats.dbRows} řádků DB` : stats.errors.join("; ").slice(0, 400),
  );
  if (success) {
    return { sent: false, error: null };
  }
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Klub Fořt backup <${REPORT_EMAIL_FROM}>`,
      to: [REPORT_EMAIL_TO],
      subject,
      text,
    });
    if (error) {
      console.error("[backup] report email failed:", error);
      return { sent: false, error: error.message };
    }
    return { sent: true, error: null };
  } catch (err) {
    console.error("[backup] report email failed:", err);
    return { sent: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export async function GET(req: NextRequest) {
  // Auth: cron secret header (Vercel Cron ho dodá automaticky z env)
  const authHeader = req.headers.get("authorization");
  const providedSecret = authHeader?.replace(/^Bearer\s+/, "");
  const expected = process.env.CRON_SECRET;
  if (!expected || providedSecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const today = new Date().toISOString().slice(0, 10);
  const errors: string[] = [];
  const stats: BackupStats = {
    dbRows: 0,
    dbSizeBytes: 0,
    codeBytes: 0,
    codeStatus: "skipped",
    deletedOldBackups: 0,
    elapsedSec: "0",
    tables: {},
    errors,
  };

  try {
    const drive = getDriveClient();

    // ─── 1. Tabulky + schema ──────────────────────────────────────────
    const allData: Record<string, { rows: Record<string, unknown>[]; schema: TableSchema }> = {};
    for (const t of TABLES) {
      const rows = await fetchAllRows(t, errors);
      allData[t] = { rows, schema: extractSchema(rows) };
      stats.tables[t] = rows.length;
      stats.dbRows += rows.length;
    }

    // ─── 2. DB JSON upload ───────────────────────────────────────────
    const dbPayload = {
      backupDate: today,
      backupTimestamp: new Date().toISOString(),
      supabaseProject: SUPABASE_PROJECT_REF,
      tables: allData,
      envManifest: ENV_MANIFEST,
    };
    const dbBuffer = Buffer.from(JSON.stringify(dbPayload), "utf8");
    stats.dbSizeBytes = dbBuffer.length;
    await uploadToDrive(drive, `fort-klub-backup-${today}.json`, "application/json", dbBuffer);

    // ─── 3. Kód z GitHub (zipball main) ───────────────────────────────
    try {
      const ghHeaders: Record<string, string> = {
        "User-Agent": "fort-klub-backup",
        Accept: "application/vnd.github+json",
      };
      if (process.env.GITHUB_TOKEN) ghHeaders.Authorization = `token ${process.env.GITHUB_TOKEN}`;
      const ghRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/zipball/main`, {
        headers: ghHeaders,
        redirect: "follow",
      });
      if (ghRes.ok) {
        const codeBuffer = Buffer.from(await ghRes.arrayBuffer());
        stats.codeBytes = codeBuffer.length;
        await uploadToDrive(drive, `fort-klub-code-${today}.zip`, "application/zip", codeBuffer);
        stats.codeStatus = "ok";
      } else {
        stats.codeStatus = `github_${ghRes.status}`;
        errors.push(`GitHub zipball failed: ${ghRes.status}`);
      }
    } catch (err) {
      stats.codeStatus = "error";
      errors.push(`GitHub zipball: ${err instanceof Error ? err.message : "unknown"}`);
    }

    // ─── 4. README-DISASTER-RECOVERY ─────────────────────────────────
    const readme = buildDisasterRecoveryReadme(today, stats);
    await uploadToDrive(
      drive,
      `fort-klub-README-${today}.txt`,
      "text/plain",
      Buffer.from(readme, "utf8")
    );

    // ─── 5. Rotace ───────────────────────────────────────────────────
    stats.deletedOldBackups = await cleanupOldBackups(drive, errors);

    stats.elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);

    // ─── 6. Email report ─────────────────────────────────────────────
    const email = await sendBackupReport(today, stats);

    return NextResponse.json({
      ok: errors.length === 0,
      date: today,
      stats,
      emailSent: email.sent,
      emailError: email.error,
      driveFolder: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
    });
  } catch (err) {
    errors.push(`fatal: ${err instanceof Error ? err.message : "unknown"}`);
    stats.elapsedSec = ((Date.now() - startedAt) / 1000).toFixed(1);
    const email = await sendBackupReport(today, stats);
    console.error("[backup] fatal:", err);
    return NextResponse.json(
      {
        error: "backup_failed",
        detail: err instanceof Error ? err.message : "unknown",
        stats,
        emailSent: email.sent,
        emailError: email.error,
      },
      { status: 500 }
    );
  }
}
