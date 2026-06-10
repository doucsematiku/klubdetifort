/**
 * Verifikace denní zálohy — kontrola, že v Drive je dnešní + včerejší set souborů.
 *
 * GET /api/backup/verify — volá Vercel cron (30 5 * * * UTC, hodinu po hlavní
 * záloze) nebo manuálně s `Authorization: Bearer $CRON_SECRET`.
 *
 * Pošle email report (Resend) na reditel@doucse.cz:
 *   OK    → zálohy za poslední 2 dny kompletní
 *   CHYBA → chybí některý ze souborů
 */
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DRIVE_FOLDER_ID =
  process.env.DRIVE_BACKUP_FOLDER_ID || "17e3A7wT2ZVZNQzEGuw0vUclhdiYMA6EG";
const REPORT_EMAIL_TO = process.env.BACKUP_REPORT_TO || "reditel@doucse.cz";
const REPORT_EMAIL_FROM = "noreply@klubdetifort.cz";
const FILENAME_PREFIX = "fort-klub-";
const MAX_BACKUPS = 90; // 30 dní × 3 typy — jen pro report text

// Kompletní set souborů, který má být za každý den přítomen.
const REQUIRED_FILES = [
  (d: string) => `fort-klub-backup-${d}.json`,
  (d: string) => `fort-klub-code-${d}.zip`,
  (d: string) => `fort-klub-README-${d}.txt`,
];

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

function isoDay(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const providedSecret = authHeader?.replace(/^Bearer\s+/, "");
  const expected = process.env.CRON_SECRET;
  if (!expected || providedSecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drive = getDriveClient();
    const res = await drive.files.list({
      q: `'${DRIVE_FOLDER_ID}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder' and name contains '${FILENAME_PREFIX}'`,
      fields: "files(id,name,size,createdTime)",
      orderBy: "createdTime desc",
      pageSize: 500,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
    });
    const files = res.data.files || [];
    const names = new Set(files.map((f) => f.name));

    const today = isoDay(0);
    const yesterday = isoDay(-1);

    const checkSet = (d: string) =>
      REQUIRED_FILES.map((fn) => fn(d)).map((n) => ({ name: n, present: names.has(n) }));

    const todayReport = checkSet(today);
    const yesterdayReport = checkSet(yesterday);

    const todayMissing = todayReport.filter((x) => !x.present);
    const yesterdayMissing = yesterdayReport.filter((x) => !x.present);

    const totalFiles = files.length;
    const totalBytes = files.reduce((acc, f) => acc + Number(f.size || 0), 0);

    const allOk = todayMissing.length === 0 && yesterdayMissing.length === 0;
    const status = allOk ? "OK" : "CHYBA";

    const subject = allOk
      ? `[OK] Kontrola záloh fort-klub — ${today}`
      : `[CHYBA] Kontrola záloh fort-klub — ${today}`;

    const text = `Status: ${status}

DNES (${today}): ${todayMissing.length === 0 ? "kompletní ✓" : `CHYBÍ ${todayMissing.length} ze ${REQUIRED_FILES.length}`}
${todayReport.map((x) => `  ${x.present ? "✓" : "✗"} ${x.name}`).join("\n")}

VČERA (${yesterday}): ${yesterdayMissing.length === 0 ? "kompletní ✓" : `CHYBÍ ${yesterdayMissing.length} ze ${REQUIRED_FILES.length}`}
${yesterdayReport.map((x) => `  ${x.present ? "✓" : "✗"} ${x.name}`).join("\n")}

CELKEM V DRIVE: ${totalFiles} souborů, ${(totalBytes / 1024 / 1024).toFixed(1)} MB
Rotace: max ${MAX_BACKUPS} souborů (30 dní × ${REQUIRED_FILES.length} typy).

Drive složka: https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}
`;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: `Klub Fořt backup verify <${REPORT_EMAIL_FROM}>`,
          to: [REPORT_EMAIL_TO],
          subject,
          text,
        });
      } catch (err) {
        console.error("[backup/verify] email send failed:", err);
      }
    } else {
      console.error("[backup/verify] RESEND_API_KEY missing — report email skipped");
    }

    return NextResponse.json({
      ok: allOk,
      status,
      today: { date: today, files: todayReport },
      yesterday: { date: yesterday, files: yesterdayReport },
      totalFiles,
      totalBytes,
    });
  } catch (err) {
    console.error("[backup/verify] fatal:", err);
    return NextResponse.json(
      { error: "verify_failed", detail: err instanceof Error ? err.message : "unknown" },
      { status: 500 }
    );
  }
}
