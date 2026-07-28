// Google Sheets helpers pro list „prázdninový program".
// Sloupce: A=jméno rodiče, B=jméno dítěte, C=den akce, D=telefon,
//          E=email, F=poznámka, G=uhrazeno?, H=url faktury, I=moje poznámka

import { google, type sheets_v4 } from "googleapis";

const SHEET_TAB = process.env.PRAZDNINY_SHEET_TAB || "prázdninový program";

// Dny prázdninového programu — startujeme úterý 14.7.2026.
// Hodnoty jsou v ISO formátu YYYY-MM-DD (pro formulář i pro porovnání v Sheetu).
export const PRAZDNINY_DAYS = [
  { iso: "2026-07-14", label: "Úterý 14. 7.", theme: "Dřevo" },
  { iso: "2026-07-15", label: "Středa 15. 7.", theme: "Voda" },
  { iso: "2026-07-16", label: "Čtvrtek 16. 7.", theme: "Oheň" },
  { iso: "2026-07-17", label: "Pátek 17. 7.", theme: "Země / Kámen" },
] as const;

export type PrazdninyDay = (typeof PRAZDNINY_DAYS)[number];
export type PrazdninyDayIso = PrazdninyDay["iso"];

export const MAX_KIDS_PER_DAY = 10;
export const PRICE_PER_DAY_KC = 600;

function getSheetsClient(): sheets_v4.Sheets | null {
  const credsB64 = process.env.GOOGLE_CREDENTIALS;
  if (!credsB64) return null;

  try {
    const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf-8"));
    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    return google.sheets({ version: "v4", auth });
  } catch (e) {
    console.error("[sheets-prazdniny] cred parse failed:", e);
    return null;
  }
}

function getSheetId(): string | null {
  return process.env.GOOGLE_SHEET_ID ?? null;
}

// Offline rezervace (telefon / osobní domluva) — admin si je drží v env var jako
// JSON `{"2026-07-14":2,"2026-07-15":2,"2026-07-16":4,"2026-07-17":4}`.
// Nezapisujeme je do Sheetu, jen je přičteme k webovému počtu při výpočtu kapacity.
function getOfflineCounts(): Record<PrazdninyDayIso, number> {
  const empty: Record<string, number> = {};
  for (const d of PRAZDNINY_DAYS) empty[d.iso] = 0;

  const raw = process.env.PRAZDNINY_OFFLINE_RESERVATIONS;
  if (!raw) return empty as Record<PrazdninyDayIso, number>;

  // Strip BOM (﻿) — PowerShell `echo | vercel env add` občas přidá BOM,
  // ten by jinak rozbil JSON.parse.
  const cleaned = raw.replace(/^﻿/, "").trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    const out: Record<string, number> = {};
    for (const d of PRAZDNINY_DAYS) {
      const v = Number(parsed[d.iso]);
      out[d.iso] = Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
    }
    return out as Record<PrazdninyDayIso, number>;
  } catch (e) {
    console.warn("[sheets-prazdniny] invalid PRAZDNINY_OFFLINE_RESERVATIONS JSON:", e);
    return empty as Record<PrazdninyDayIso, number>;
  }
}

// Spočítá kolik dětí už je přihlášeno pro každý den.
// = webové rezervace (sheet sloupec C) + offline rezervace (env var).
export async function getDayAvailability(): Promise<Record<PrazdninyDayIso, number>> {
  const result: Record<string, number> = {};
  for (const d of PRAZDNINY_DAYS) result[d.iso] = 0;

  const sheets = getSheetsClient();
  const sheetId = getSheetId();

  // Webové rezervace ze sheetu
  if (sheets && sheetId) {
    try {
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${SHEET_TAB}'!C2:C`,
      });
      const rows = res.data.values || [];
      for (const row of rows) {
        const cell = (row[0] ?? "").toString();
        for (const d of PRAZDNINY_DAYS) {
          if (cell.includes(d.iso)) {
            result[d.iso] += 1;
          }
        }
      }
    } catch (e) {
      console.error("[sheets-prazdniny] read availability failed:", e);
    }
  }

  // Offline rezervace (telefon / osobní)
  const offline = getOfflineCounts();
  for (const d of PRAZDNINY_DAYS) {
    result[d.iso] += offline[d.iso];
  }

  return result as Record<PrazdninyDayIso, number>;
}

export type AppendRowInput = {
  parentName: string;
  childName: string;
  daysIso: PrazdninyDayIso[];
  phone: string;
  email: string;
  note: string;
};

// Vrací číslo řádku (1-indexed), kde byl záznam zapsán — potřebujeme to,
// abychom mohli později updatnout URL faktury (col H) a status uhrazení (col G).
export async function appendPrazdninyRow(input: AppendRowInput): Promise<number | null> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();
  if (!sheets || !sheetId) {
    console.error("[sheets-prazdniny] config missing");
    return null;
  }

  try {
    // Zjistíme aktuální počet řádků v listu (sloupec A) — kam zapsat další.
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `'${SHEET_TAB}'!A:A`,
    });
    const lastRow = (existing.data.values || []).length;
    const newRowNumber = lastRow + 1;

    const dayCell = input.daysIso
      .map((iso) => {
        const d = PRAZDNINY_DAYS.find((x) => x.iso === iso);
        return d ? `${d.label} (${iso})` : iso;
      })
      .join(", ");

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'${SHEET_TAB}'!A${newRowNumber}:I${newRowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            input.parentName,        // A
            input.childName,         // B
            dayCell,                  // C
            input.phone,              // D
            input.email,              // E
            input.note || "",         // F
            "NE",                     // G
            "",                       // H (vyplníme po vytvoření faktury)
            "",                       // I (moje poznámka)
          ],
        ],
      },
    });

    return newRowNumber;
  } catch (e) {
    console.error("[sheets-prazdniny] append failed:", e);
    return null;
  }
}

export async function updateRowInvoiceUrl(rowNumber: number, invoiceUrl: string): Promise<void> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();
  if (!sheets || !sheetId) return;

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `'${SHEET_TAB}'!H${rowNumber}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[invoiceUrl]] },
    });
  } catch (e) {
    console.error("[sheets-prazdniny] update invoice URL failed:", e);
  }
}

// Najde řádek podle custom_id faktury (zapsaný v invoice variable_symbol nebo custom_id)
// a označí ho jako uhrazený. Custom_id má tvar `prazdniny-<rowNumber>`.
export async function markRowPaidByCustomId(
  customId: string,
  paidOn: string | null,
): Promise<boolean> {
  const sheets = getSheetsClient();
  const sheetId = getSheetId();
  if (!sheets || !sheetId) return false;

  const match = customId.match(/^prazdniny-(\d+)$/);
  if (!match) {
    console.warn(`[sheets-prazdniny] unknown custom_id format: ${customId}`);
    return false;
  }
  const rowNumber = parseInt(match[1], 10);
  if (!Number.isFinite(rowNumber) || rowNumber < 2) return false;

  const note = paidOn
    ? `Uhrazeno ${paidOn} (auto z Fakturoid webhooku)`
    : "Uhrazeno (auto z Fakturoid webhooku)";

  try {
    // 1) Zapsat G="ANO" a I=poznámka s datem
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: sheetId,
      requestBody: {
        valueInputOption: "USER_ENTERED",
        data: [
          { range: `'${SHEET_TAB}'!G${rowNumber}`, values: [["ANO"]] },
          { range: `'${SHEET_TAB}'!I${rowNumber}`, values: [[note]] },
        ],
      },
    });

    // 2) Obarvit celý řádek A:I zeleným pozadím (vizuální indikátor zaplacení).
    //    Potřebujeme numerické sheetId (gid) listu — bereme z metadat.
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const tab = meta.data.sheets?.find((s) => s.properties?.title === SHEET_TAB);
    const tabGid = tab?.properties?.sheetId;

    if (typeof tabGid === "number") {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              repeatCell: {
                range: {
                  sheetId: tabGid,
                  startRowIndex: rowNumber - 1, // 0-indexed
                  endRowIndex: rowNumber,        // exclusive
                  startColumnIndex: 0,
                  endColumnIndex: 9,             // A..I
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.78, green: 0.95, blue: 0.78 }, // jemně zelená
                  },
                },
                fields: "userEnteredFormat.backgroundColor",
              },
            },
          ],
        },
      });
    }

    return true;
  } catch (e) {
    console.error("[sheets-prazdniny] mark paid failed:", e);
    return false;
  }
}
