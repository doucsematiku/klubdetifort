import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { google } from "googleapis";
import { findSlotById, isSlotBookable, slotToEventId, type Slot } from "@/lib/prohlidky-slots";
import { insertReservation } from "@/lib/google-calendar";
import { supabaseInsert } from "@/lib/supabase";
import { allAcksAccepted, PROHLIDKY_ACKS, type AcksState } from "@/lib/prohlidky-acks";

/** Vyrenderuje 9 acks jako HTML <ol> seznam pro confirmation email. */
function renderAcksHtml(): string {
  const items = PROHLIDKY_ACKS.map((ack) => {
    // Bezpečné: text z PROHLIDKY_ACKS je statický, žádný uživatelský vstup.
    // **bold** → <strong>
    const html = ack.text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    return `<li style="margin-bottom:10px;padding-left:4px;">${html}</li>`;
  }).join("");
  return `<ol style="padding-left:22px;font-size:13px;color:#3A362D;line-height:1.55;margin:0;">${items}</ol>`;
}

const resend = new Resend(process.env.RESEND_API_KEY);

// ============ Google Sheets helper ============
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

const REZERVACE_SHEET = "Rezervace prohlídek";

async function ensureRezervaceSheet() {
  const sheets = getSheetsClient();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheets || !sheetId) return null;

  try {
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const exists = (meta.data.sheets || []).some(
      (s) => s.properties?.title === REZERVACE_SHEET
    );
    if (!exists) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: REZERVACE_SHEET } } }],
        },
      });
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `${REZERVACE_SHEET}!A1`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              "Odesláno",
              "Den",
              "Čas od",
              "Čas do",
              "Rodič",
              "E-mail",
              "Telefon",
              "Děti (info)",
              "Počet dětí",
              "Slot ID",
              "Calendar event ID",
            ],
          ],
        },
      });
    }
    return sheets;
  } catch (err) {
    console.error("ensureRezervaceSheet error:", err);
    return null;
  }
}

async function appendRezervaceRow(slot: Slot, body: SanitizedReservation) {
  const sheets = await ensureRezervaceSheet();
  const sheetId = process.env.GOOGLE_SHEET_ID;
  if (!sheets || !sheetId) return;
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${REZERVACE_SHEET}!A:K`,
      // RAW: žádná auto-konverze textu na datum/čas/číslo — vše zůstává string
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            slot.dayLabel,
            slot.start,
            slot.end,
            body.parentName,
            body.email,
            body.phone,
            body.childrenInfo,
            String(body.childrenCount),
            slot.id,
            slotToEventId(slot),
          ],
        ],
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("appendRezervaceRow error:", msg);
  }
}

interface SanitizedReservation {
  parentName: string;
  email: string;
  phone: string;
  childrenInfo: string;
  childrenCount: number;
}

interface ReservePayload {
  slotId: string;
  parentName: string;
  email: string;
  emailConfirm: string;
  phone: string;
  childrenInfo: string;
  childrenCount: number;
  gdpr: boolean;
  acks?: AcksState;
  website?: string; // honeypot
  _t?: number; // form load timestamp
}

const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 30_000;

export const dynamic = "force-dynamic";
// Vercel Hobby plan: max 60s. Default 10s by mohl být přerušen
// pokud Calendar + SB + Sheet + 2× Resend trvá příliš dlouho.
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

    const body = (await req.json()) as ReservePayload;

    // Honeypot
    if (body.website?.trim()) {
      return NextResponse.json({ success: true });
    }
    // Timing-based — < 2s = bot
    if (body._t && Date.now() - body._t < 2000) {
      return NextResponse.json({ success: true });
    }

    if (
      !body.slotId?.trim() ||
      !body.parentName?.trim() ||
      !body.email?.trim() ||
      !body.emailConfirm?.trim() ||
      !body.phone?.trim() ||
      !body.childrenInfo?.trim() ||
      !body.childrenCount
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
            "Pro rezervaci je třeba odsouhlasit všechny body výše. Zkontrolujte prosím, že máte zaškrtnuté všechny.",
        },
        { status: 400 }
      );
    }

    if (body.email.trim().toLowerCase() !== body.emailConfirm.trim().toLowerCase()) {
      return NextResponse.json(
        { error: "E-maily se neshodují. Zkontrolujte prosím obě políčka." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Zadejte prosím platný e-mail." },
        { status: 400 }
      );
    }

    const childrenCount = Math.max(1, Math.min(20, Number(body.childrenCount) || 1));

    const slot: Slot | null = findSlotById(body.slotId);
    if (!slot) {
      return NextResponse.json(
        { error: "Vybraný termín neexistuje." },
        { status: 400 }
      );
    }

    // Server-side ověření, že je do startu slotu ještě > 24 h
    if (!isSlotBookable(slot)) {
      return NextResponse.json(
        {
          error:
            "Tento termín už nelze online rezervovat (do startu zbývá méně než 24 hodin). Zavolejte prosím na 775 917 363.",
        },
        { status: 400 }
      );
    }

    // Atomic insert přes Google Calendar events.import + iCalUID
    const result = await insertReservation(slot, {
      parentName: body.parentName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      childrenInfo: body.childrenInfo.trim(),
      childrenCount,
    });

    if (result.conflict) {
      return NextResponse.json(
        {
          error:
            "Termín byl právě zarezervován jiným zájemcem. Vyberte prosím jiný volný termín.",
          conflict: true,
        },
        { status: 409 }
      );
    }

    if (!result.ok) {
      console.error("Reservation failed:", result.error);
      return NextResponse.json(
        { error: "Rezervaci se nepodařilo uložit. Zkuste to prosím znovu." },
        { status: 500 }
      );
    }

    // Calendar insert OK → paralelně zapíšeme do Supabase + Google Sheetu.
    // Tyhle zápisy nejsou critical path — když selžou, rezervace stále drží.
    const sanitized: SanitizedReservation = {
      parentName: body.parentName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      childrenInfo: body.childrenInfo.trim(),
      childrenCount,
    };
    const ua = req.headers.get("user-agent") ?? "";

    await Promise.allSettled([
      supabaseInsert("prohlidky_rezervace", {
        slot_id: slot.id,
        slot_date: slot.date,
        slot_start: slot.start,
        slot_end: slot.end,
        parent_name: sanitized.parentName,
        email: sanitized.email,
        phone: sanitized.phone,
        children_info: sanitized.childrenInfo,
        children_count: sanitized.childrenCount,
        calendar_event_id: slotToEventId(slot),
        user_agent: ua,
        ip,
      }),
      appendRezervaceRow(slot, sanitized),
    ]);

    // Confirmation emaily — admin + rodič (paralelně, ať response nestrávíme čekáním)
    const slotLabel = `${slot.dayLabel}, ${slot.start}–${slot.end}`;

    const adminHtml = `
          <h2>Nová rezervace prohlídky areálu Farmy Fořt</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:6px 12px;font-weight:bold;">Termín:</td><td style="padding:6px 12px;">${slotLabel}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Rodič:</td><td style="padding:6px 12px;">${escapeHtml(body.parentName)}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Email:</td><td style="padding:6px 12px;"><a href="mailto:${escapeHtml(body.email)}">${escapeHtml(body.email)}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${escapeHtml(body.phone)}">${escapeHtml(body.phone)}</a></td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Děti:</td><td style="padding:6px 12px;">${escapeHtml(body.childrenInfo)}</td></tr>
            <tr><td style="padding:6px 12px;font-weight:bold;">Počet:</td><td style="padding:6px 12px;">${childrenCount}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:13px;color:#666;">Rodič odsouhlasil všech ${PROHLIDKY_ACKS.length} bodů rezervačního formuláře.</p>
          <p style="font-size:13px;color:#666;">Rezervace je zapsána v kalendáři Prohlídky Klub Fořt na reditel@doucse.cz.</p>
        `;

    const parentHtml = `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#3A362D;">
            <h2 style="color:#2D5A27;">Děkujeme, ${escapeHtml(body.parentName)}!</h2>
            <p>Vaše rezervace prohlídky areálu Klub dětí Farma Fořt je potvrzena.</p>

            <div style="background:#F5F0E8;border-radius:12px;padding:16px 20px;margin:20px 0;">
              <p style="margin:0 0 4px;color:#5C4033;font-size:13px;">Termín prohlídky</p>
              <p style="margin:0;font-size:18px;font-weight:bold;color:#2D5A27;">${slotLabel}</p>
            </div>

            <p><strong>Údaje ve vaší rezervaci:</strong></p>
            <table style="border-collapse:collapse;font-family:sans-serif;">
              <tr><td style="padding:4px 0;color:#5C4033;width:120px;">Jméno rodiče:</td><td style="padding:4px 0;">${escapeHtml(body.parentName)}</td></tr>
              <tr><td style="padding:4px 0;color:#5C4033;">E-mail:</td><td style="padding:4px 0;">${escapeHtml(body.email)}</td></tr>
              <tr><td style="padding:4px 0;color:#5C4033;">Telefon:</td><td style="padding:4px 0;">${escapeHtml(body.phone)}</td></tr>
              <tr><td style="padding:4px 0;color:#5C4033;">Děti:</td><td style="padding:4px 0;">${escapeHtml(body.childrenInfo)}</td></tr>
              <tr><td style="padding:4px 0;color:#5C4033;">Počet:</td><td style="padding:4px 0;">${childrenCount}</td></tr>
            </table>

            <div style="margin-top:28px;padding:18px 20px;background:#F5F0E8;border-radius:12px;">
              <p style="margin:0 0 12px;font-weight:bold;color:#2D5A27;">Co jste při rezervaci odsouhlasili:</p>
              ${renderAcksHtml()}
              <p style="margin:14px 0 0;font-size:12px;color:#8B6F5E;font-style:italic;">
                Posíláme vám tento opis, abyste body měli ještě jednou na očích — uvidíme se v klidu na prohlídce.
              </p>
            </div>

            <p style="margin-top:24px;">Adresa: <strong>Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí</strong></p>
            <p>Pokud byste se nemohli dostavit nebo potřebovali termín změnit, napište prosím na
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
        replyTo: body.email,
        subject: `Nová rezervace prohlídky: ${body.parentName} — ${slotLabel}`,
        html: adminHtml,
      }),
      resend.emails.send({
        from: "Klub Fořt <noreply@klubdetifort.cz>",
        to: body.email,
        subject: `Potvrzení rezervace prohlídky — ${slotLabel}`,
        html: parentHtml,
      }),
    ]);

    // Loguj selhání aby šly vidět v Vercel logs
    for (const [i, r] of emailResults.entries()) {
      if (r.status === "rejected") {
        console.error(`[rezervace] email ${i === 0 ? "admin" : "parent"} failed:`, r.reason);
      } else if (r.value && "error" in r.value && r.value.error) {
        console.error(`[rezervace] email ${i === 0 ? "admin" : "parent"} returned error:`, r.value.error);
      }
    }

    submissions.set(ip, Date.now());

    return NextResponse.json({
      success: true,
      slotLabel,
    });
  } catch (error) {
    console.error("Reservation error:", error);
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
