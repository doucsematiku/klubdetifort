import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { google } from "googleapis";
import { supabaseInsert } from "@/lib/supabase";
import { allAcksAccepted, type AcksState } from "@/lib/prohlidky-acks";
import { MAX_DATE, MAX_DATE_LABEL } from "@/lib/prohlidky-config";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AlternativaNavrh {
  datum: string; // YYYY-MM-DD
  cas_od: string; // HH:MM
  cas_do: string; // HH:MM
}

interface AlternativyPayload {
  parentName: string;
  email: string;
  emailConfirm: string;
  phone: string;
  childrenInfo: string;
  childrenCount: number;
  navrhy: AlternativaNavrh[];
  poznamka?: string;
  gdpr: boolean;
  acks?: AcksState;
  website?: string;
  _t?: number;
}

function getSheetsClient() {
  const credsB64 = process.env.GOOGLE_CREDENTIALS;
  if (!credsB64) return null;
  const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf-8"));
  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function ensureAlternativySheet() {
  const sheets = getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheets || !sheetId) return null;

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const exists = (meta.data.sheets || []).some(
      (s) => s.properties?.title === "Alternativy prohlídek"
    );
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: "Alternativy prohlídek" },
              },
            },
          ],
        },
      });
      // header row
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: "Alternativy prohlídek!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "Odesláno",
              "Rodič",
              "E-mail",
              "Telefon",
              "Děti (info)",
              "Počet dětí",
              "Návrh 1 — datum",
              "Návrh 1 — od",
              "Návrh 1 — do",
              "Návrh 2 — datum",
              "Návrh 2 — od",
              "Návrh 2 — do",
              "Návrh 3 — datum",
              "Návrh 3 — od",
              "Návrh 3 — do",
              "Návrh 4 (volitelně)",
              "Návrh 5 (volitelně)",
              "Poznámka",
            ],
          ],
        },
      });
    }
    return sheets;
  } catch (err) {
    console.error("ensureAlternativySheet error:", err);
    return null;
  }
}

async function appendAlternativa(body: AlternativyPayload) {
  const sheets = await ensureAlternativySheet();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheets || !sheetId) return;

  const n = body.navrhy;
  const slot = (i: number) => [
    n[i]?.datum || "",
    n[i]?.cas_od || "",
    n[i]?.cas_do || "",
  ];

  const navrh4 = n[3] ? `${n[3].datum} ${n[3].cas_od}–${n[3].cas_do}` : "";
  const navrh5 = n[4] ? `${n[4].datum} ${n[4].cas_od}–${n[4].cas_do}` : "";

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Alternativy prohlídek!A:R",
      // RAW: žádná auto-konverze textu na datum/čas/číslo — vše zůstává string
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            body.parentName,
            body.email,
            body.phone,
            body.childrenInfo,
            String(body.childrenCount),
            ...slot(0),
            ...slot(1),
            ...slot(2),
            navrh4,
            navrh5,
            body.poznamka || "",
          ],
        ],
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Alternativy sheet append error:", msg);
  }
}

const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    const lastSubmission = submissions.get(ip);
    if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as AlternativyPayload;

    if (body.website?.trim()) return NextResponse.json({ success: true });
    if (body._t && Date.now() - body._t < 2000) return NextResponse.json({ success: true });

    if (
      !body.parentName?.trim() ||
      !body.email?.trim() ||
      !body.emailConfirm?.trim() ||
      !body.phone?.trim() ||
      !body.childrenInfo?.trim() ||
      !body.childrenCount ||
      !Array.isArray(body.navrhy)
    ) {
      return NextResponse.json(
        { error: "Vyplňte prosím všechna povinná pole." },
        { status: 400 }
      );
    }

    if (!body.gdpr) {
      return NextResponse.json(
        { error: "Je potřeba souhlasit se zpracováním údajů." },
        { status: 400 }
      );
    }

    if (!allAcksAccepted(body.acks)) {
      return NextResponse.json(
        {
          error:
            "Pro odeslání návrhů je třeba odsouhlasit všechny body výše. Zkontrolujte prosím, že máte zaškrtnuté všechny.",
        },
        { status: 400 }
      );
    }

    if (body.email.trim().toLowerCase() !== body.emailConfirm.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "E-maily se neshodují." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Zadejte prosím platný e-mail." }, { status: 400 });
    }

    const validNavrhy = body.navrhy.filter(
      (n) => n && n.datum?.trim() && n.cas_od?.trim() && n.cas_do?.trim()
    );

    if (validNavrhy.length < 3) {
      return NextResponse.json(
        { error: "Vyplňte prosím alespoň 3 termínové návrhy (datum + časové okno)." },
        { status: 400 }
      );
    }

    // Termíny jen do konce srpna 2026 a ne v minulosti.
    // Spodní mez = včerejšek v UTC (lenient kvůli časovým zónám).
    const lowerBound = new Date(Date.now() - 24 * 3600 * 1000).toISOString().slice(0, 10);
    const outOfRange = validNavrhy.some(
      (n) => n.datum > MAX_DATE || n.datum < lowerBound
    );
    if (outOfRange) {
      return NextResponse.json(
        { error: `Termíny prosím navrhujte do ${MAX_DATE_LABEL} a ne v minulosti.` },
        { status: 400 }
      );
    }

    const childrenCount = Math.max(1, Math.min(20, Number(body.childrenCount) || 1));

    const sanitized: AlternativyPayload = {
      ...body,
      parentName: body.parentName.trim(),
      email: body.email.trim(),
      emailConfirm: body.emailConfirm.trim(),
      phone: body.phone.trim(),
      childrenInfo: body.childrenInfo.trim(),
      childrenCount,
      navrhy: validNavrhy,
      poznamka: body.poznamka?.trim() || "",
    };

    const ua = req.headers.get("user-agent") ?? "";

    // paralelně: Google Sheet (existující list) + Supabase
    await Promise.allSettled([
      appendAlternativa(sanitized),
      supabaseInsert("prohlidky_alternativy", {
        parent_name: sanitized.parentName,
        email: sanitized.email,
        phone: sanitized.phone,
        children_info: sanitized.childrenInfo,
        children_count: sanitized.childrenCount,
        navrhy: sanitized.navrhy,
        poznamka: sanitized.poznamka || "",
        user_agent: ua,
        ip,
      }),
    ]);

    const navrhyRows = sanitized.navrhy
      .map(
        (n, i) =>
          `<tr><td style="padding:4px 12px;">Návrh ${i + 1}:</td><td style="padding:4px 12px;">${escapeHtml(n.datum)} &middot; ${escapeHtml(n.cas_od)}–${escapeHtml(n.cas_do)}</td></tr>`
      )
      .join("");

    const adminHtml = `
          <h2>Žádost o individuální prohlídku</h2>
          <p>Rodič navrhuje termíny, kdy by se mohl přijít podívat. Domluvte se s ním na konkrétním čase.</p>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Rodič:</td><td style="padding:6px 12px;">${escapeHtml(sanitized.parentName)}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email:</td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(sanitized.email)}">${escapeHtml(sanitized.email)}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${escapeHtml(sanitized.phone)}">${escapeHtml(sanitized.phone)}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Děti:</td><td style="padding:6px 12px;">${escapeHtml(sanitized.childrenInfo)}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Počet dětí:</td><td style="padding:6px 12px;">${childrenCount}</td></tr>
          </table>
          <h3>Navrhované termíny</h3>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            ${navrhyRows}
          </table>
          ${sanitized.poznamka ? `<h3>Poznámka:</h3><p style="white-space:pre-wrap;">${escapeHtml(sanitized.poznamka)}</p>` : ""}
          <hr style="margin-top:20px;border:none;border-top:1px solid #ddd;">
          <p style="font-size:12px;color:#999;">Zápis v listu „Alternativy prohlídek" v Google Sheetu.</p>
        `;

    const parentHtml = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#3A362D;">
            <h2 style="color:#2D5A27;">Děkujeme, ${escapeHtml(sanitized.parentName)}!</h2>
            <p>Vaše návrhy termínů jsme přijali. Brzy se vám ozveme (telefonicky nebo e-mailem) a domluvíme konkrétní čas individuální prohlídky.</p>

            <p><strong>Vaše navrhované termíny:</strong></p>
            <table style="border-collapse:collapse;font-family:sans-serif;">
              ${navrhyRows}
            </table>

            ${sanitized.poznamka ? `<p style="margin-top:16px;"><strong>Vaše poznámka:</strong><br>${escapeHtml(sanitized.poznamka)}</p>` : ""}

            <p style="margin-top:24px;">Pokud máte další dotaz, napište nám na
              <a href="mailto:reditel@doucse.cz">reditel@doucse.cz</a> nebo zavolejte na
              <a href="tel:+420775917363">775 917 363</a>.
            </p>
            <p>Těšíme se na vás!<br><strong>Tým Vzdělávacího klubu Farma Fořt</strong></p>
            <hr style="margin-top:24px;border:none;border-top:1px solid #e5e5e5;">
            <p style="font-size:12px;color:#999;">Toto je automatické potvrzení z klubdetifort.cz</p>
          </div>
        `;

    const emailResults = await Promise.allSettled([
      resend.emails.send({
        from: "Klub Fořt <noreply@klubdetifort.cz>",
        to: "reditel@doucse.cz",
        cc: "jadrna.nela@gmail.com",
        replyTo: sanitized.email,
        subject: `Nový návrh termínu prohlídky: ${sanitized.parentName}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Klub Fořt <noreply@klubdetifort.cz>",
        to: sanitized.email,
        subject: "Děkujeme za návrhy termínů — Klub Farma Fořt",
        html: parentHtml,
      }),
    ]);

    for (const [i, r] of emailResults.entries()) {
      if (r.status === "rejected") {
        console.error(`[alternativy] email ${i === 0 ? "admin" : "parent"} failed:`, r.reason);
      } else if (r.value && "error" in r.value && r.value.error) {
        console.error(`[alternativy] email ${i === 0 ? "admin" : "parent"} returned error:`, r.value.error);
      }
    }

    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Alternativy error:", error);
    return NextResponse.json({ error: "Interní chyba serveru." }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
