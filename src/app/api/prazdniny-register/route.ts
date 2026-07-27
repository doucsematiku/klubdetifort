import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  PRAZDNINY_DAYS,
  PRICE_PER_DAY_KC,
  MAX_KIDS_PER_DAY,
  appendPrazdninyRow,
  getDayAvailability,
  updateRowInvoiceUrl,
  type PrazdninyDayIso,
} from "@/lib/sheets-prazdniny";
import { createInvoice } from "@/lib/fakturoid";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RegisterPayload {
  parentName: string;
  childName: string;
  childAge?: string;
  days: string[];
  phone: string;
  email: string;
  note?: string;
  gdpr: boolean;
  website?: string;
  _t?: number;
}

// IP-based rate limit (1 submission per IP per minute).
const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isAllowedDay(iso: string): iso is PrazdninyDayIso {
  return PRAZDNINY_DAYS.some((d) => d.iso === iso);
}

function formatCZK(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    const lastSubmission = submissions.get(ip);
    if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
        { status: 429 },
      );
    }

    const body = (await req.json()) as RegisterPayload;

    // Honeypot
    if (body.website?.trim()) {
      return NextResponse.json({ success: true });
    }

    // Timing — pod 2 s je s velkou pravděpodobností bot
    if (body._t && Date.now() - body._t < 2000) {
      return NextResponse.json({ success: true });
    }

    // ─── Validace ────────────────────────────────────────────────────────
    if (!body.parentName?.trim() || !body.childName?.trim()) {
      return NextResponse.json(
        { error: "Vyplňte prosím jméno rodiče i dítěte." },
        { status: 400 },
      );
    }
    if (!body.email?.trim() || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Zadejte prosím platný e-mail." },
        { status: 400 },
      );
    }
    if (!body.phone?.trim()) {
      return NextResponse.json({ error: "Telefon je povinný." }, { status: 400 });
    }
    if (!body.gdpr) {
      return NextResponse.json(
        { error: "Je potřeba souhlasit se zpracováním údajů." },
        { status: 400 },
      );
    }
    if (!Array.isArray(body.days) || body.days.length === 0) {
      return NextResponse.json(
        { error: "Vyberte prosím alespoň jeden den." },
        { status: 400 },
      );
    }
    const days = Array.from(new Set(body.days.filter(isAllowedDay)));
    if (days.length === 0) {
      return NextResponse.json(
        { error: "Vyberte prosím alespoň jeden platný den." },
        { status: 400 },
      );
    }

    // ─── Re-check kapacity ───────────────────────────────────────────────
    const taken = await getDayAvailability();
    const fullDays = days.filter((iso) => (taken[iso] ?? 0) >= MAX_KIDS_PER_DAY);
    if (fullDays.length > 0) {
      const labels = fullDays
        .map((iso) => PRAZDNINY_DAYS.find((d) => d.iso === iso)?.label ?? iso)
        .join(", ");
      return NextResponse.json(
        {
          error: `Bohužel, dny ${labels} jsou už plně obsazené. Zkuste prosím vybrat jiný termín.`,
          fullDays,
        },
        { status: 409 },
      );
    }

    // ─── Append do Sheetu (před fakturou — záznam je důležitější) ─────────
    const rowNumber = await appendPrazdninyRow({
      parentName: body.parentName.trim(),
      childName: body.childName.trim() + (body.childAge ? ` (${body.childAge.trim()})` : ""),
      daysIso: days,
      phone: body.phone.trim(),
      email: body.email.trim(),
      note: body.note?.trim() ?? "",
    });

    if (!rowNumber) {
      return NextResponse.json(
        { error: "Chyba při zápisu rezervace. Zkuste to prosím znovu." },
        { status: 500 },
      );
    }

    // ─── Fakturoid faktura ───────────────────────────────────────────────
    const totalKc = days.length * PRICE_PER_DAY_KC;
    const daysHumanList = days
      .map((iso) => PRAZDNINY_DAYS.find((d) => d.iso === iso)?.label ?? iso)
      .join(", ");

    const customId = `prazdniny-${rowNumber}`;

    let invoiceUrl = "";
    let invoiceNumber = "";
    let bankAccount = "";
    let variableSymbol = "";
    let dueOn = "";

    try {
      const invoice = await createInvoice({
        subject: {
          name: body.parentName.trim(),
          email: body.email.trim(),
          phone: body.phone.trim(),
          type: "customer",
        },
        lines: [
          {
            name: `Klub dětí Fořt — prázdninový program (${body.childName.trim()}, ${daysHumanList})`,
            quantity: days.length,
            unit_name: days.length === 1 ? "den" : "dny",
            unit_price: PRICE_PER_DAY_KC,
            vat_rate: 0,
          },
        ],
        payment_method: "bank",
        due: 7,
        note: `Děkujeme za přihlášení dítěte ${body.childName.trim()} na prázdninový program Klubu dětí Fořt. Cena je ${formatCZK(totalKc)} (${days.length} × ${formatCZK(PRICE_PER_DAY_KC)} bez oběda, ten si dítě přinese s sebou).`,
        footer_note: "Vzdělávací centrum Doučse z.s. — IČO 06875689 — neplátce DPH.",
        custom_id: customId,
        issue_invoice_email: true,
        tags: ["klub-fort", "prazdniny-2026"],
      });

      invoiceUrl = invoice.public_html_url || invoice.html_url;
      invoiceNumber = invoice.number;
      bankAccount = invoice.bank_account ?? "";
      variableSymbol = invoice.variable_symbol ?? "";
      dueOn = invoice.due_on ?? "";

      await updateRowInvoiceUrl(rowNumber, invoiceUrl);
    } catch (err) {
      console.error("[prazdniny-register] Fakturoid invoice failed:", err);
      // Necháme záznam v sheetu i bez faktury — admin si ho doplní ručně.
      // Klientovi posíláme email bez odkazu na fakturu, s instrukcí co dál.
    }

    // ─── Emaily ──────────────────────────────────────────────────────────
    const safeName = body.parentName.replace(/[<>]/g, "");
    const safeChild = body.childName.replace(/[<>]/g, "");
    const safeNote = (body.note ?? "").replace(/[<>]/g, "");

    // Klient
    try {
      await resend.emails.send({
        from: "Klub Fořt <noreply@klubdetifort.cz>",
        to: body.email.trim(),
        replyTo: "reditel@doucse.cz",
        subject: `Potvrzení rezervace — Klub dětí Fořt, prázdninový program`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#3A362D;line-height:1.6;">
            <h2 style="color:#2D5A27;margin-bottom:8px;">Děkujeme, ${safeName}!</h2>
            <p>Přihlášku ${safeChild} na prázdninový program Klubu dětí Fořt máme zaevidovanou.</p>

            <h3 style="color:#2D5A27;margin-top:24px;">Co jste si zarezervoval(a)</h3>
            <table style="border-collapse:collapse;width:100%;font-size:14px;">
              <tr><td style="padding:6px 0;font-weight:bold;width:140px;">Dítě:</td><td style="padding:6px 0;">${safeChild}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Dny:</td><td style="padding:6px 0;">${daysHumanList}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Cena:</td><td style="padding:6px 0;"><strong>${formatCZK(totalKc)}</strong> (${days.length} × 600 Kč)</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Místo:</td><td style="padding:6px 0;">BIO farma Fořt, Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Čas:</td><td style="padding:6px 0;">9:00 – 13:00 (přijít prosím včas)</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Průvodkyně:</td><td style="padding:6px 0;">Lenka Formánková</td></tr>
            </table>

            ${
              invoiceUrl
                ? `<h3 style="color:#2D5A27;margin-top:24px;">Faktura ${invoiceNumber}</h3>
                   <p>Fakturu k úhradě najdete zde:<br>
                     <a href="${invoiceUrl}" style="color:#2D5A27;font-weight:bold;">${invoiceUrl}</a>
                   </p>
                   <p style="background:#F5F0E8;padding:12px;border-radius:8px;font-size:14px;">
                     ${bankAccount ? `Číslo účtu: <strong>${bankAccount}</strong><br>` : ""}
                     ${variableSymbol ? `Variabilní symbol: <strong>${variableSymbol}</strong><br>` : ""}
                     ${dueOn ? `Splatnost: <strong>${dueOn}</strong><br>` : ""}
                     Částka: <strong>${formatCZK(totalKc)}</strong>
                   </p>`
                : `<h3 style="color:#2D5A27;margin-top:24px;">Faktura</h3>
                   <p>Fakturu Vám pošleme do 24 hodin samostatným e-mailem z Fakturoidu.</p>`
            }

            <h3 style="color:#2D5A27;margin-top:24px;">Co si s sebou vzít</h3>
            <ul style="padding-left:20px;">
              <li><strong>Oběd</strong> — připravte prosím dítěti hlavní jídlo na cca 12:00</li>
              <li>Lahev na vodu</li>
              <li>Svačinu (pokud si dáváte ráno)</li>
              <li>Pohodlné oblečení do přírody</li>
              <li>Náhradní triko, pláštěnku (počasí v Krkonoších je různé)</li>
              <li>Pokrývku hlavy a krém na opalování</li>
            </ul>

            <p style="margin-top:24px;">Pokud máte jakékoliv otázky, ozvěte se mi prosím na
              <a href="mailto:reditel@doucse.cz" style="color:#2D5A27;">reditel@doucse.cz</a> nebo na
              <a href="tel:+420775917363" style="color:#2D5A27;">775 917 363</a>.
            </p>

            <p>Těšíme se na vaše dítě!</p>
            <p><strong>Tým Klubu dětí Fořt</strong></p>

            <hr style="margin-top:24px;border:none;border-top:1px solid #E8DFD0;">
            <p style="font-size:12px;color:#8B6F5E;">
              Toto je automatické potvrzení z klubdetifort.cz.<br>
              Vzdělávací centrum Doučse z.s. · Korunní 2569/108, Praha 10
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("[prazdniny-register] client email failed:", e);
    }

    // Admin
    try {
      await resend.emails.send({
        from: "Klub Fořt <noreply@klubdetifort.cz>",
        to: "reditel@doucse.cz",
        replyTo: body.email.trim(),
        subject: `🌳 Nová rezervace — prázdniny — ${safeName} (${days.length}× ${formatCZK(PRICE_PER_DAY_KC)})`,
        html: `
          <div style="font-family:sans-serif;max-width:640px;color:#3A362D;">
            <h2 style="color:#2D5A27;">Nová rezervace — prázdninový program</h2>
            <table style="border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 12px;font-weight:bold;">Rodič:</td><td style="padding:6px 12px;">${safeName}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Dítě:</td><td style="padding:6px 12px;">${safeChild}${body.childAge ? ` (${body.childAge})` : ""}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${body.phone}">${body.phone}</a></td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">E-mail:</td><td style="padding:6px 12px;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Dny:</td><td style="padding:6px 12px;">${daysHumanList}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Cena:</td><td style="padding:6px 12px;"><strong>${formatCZK(totalKc)}</strong></td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Faktura:</td><td style="padding:6px 12px;">${invoiceUrl ? `<a href="${invoiceUrl}">${invoiceNumber}</a>` : "<em>nevytvořena (chyba Fakturoidu)</em>"}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Sheet řádek:</td><td style="padding:6px 12px;">#${rowNumber}</td></tr>
            </table>
            ${safeNote ? `<h3 style="margin-top:16px;">Poznámka rodiče:</h3><p style="white-space:pre-wrap;background:#F5F0E8;padding:12px;border-radius:8px;">${safeNote}</p>` : ""}
            <hr style="margin-top:20px;border:none;border-top:1px solid #E8DFD0;">
            <p style="font-size:12px;color:#8B6F5E;">Odesláno z klubdetifort.cz — /prazdninovy-program</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("[prazdniny-register] admin email failed:", e);
    }

    submissions.set(ip, Date.now());

    return NextResponse.json({
      success: true,
      invoiceUrl: invoiceUrl || null,
      invoiceNumber: invoiceNumber || null,
      totalKc,
    });
  } catch (err) {
    console.error("[prazdniny-register] error:", err);
    return NextResponse.json({ error: "Interní chyba serveru." }, { status: 500 });
  }
}
