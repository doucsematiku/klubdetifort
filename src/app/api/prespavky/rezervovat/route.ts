import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createInvoice } from "@/lib/fakturoid";
import { supabaseInsert, supabaseSelect, supabaseUpdate } from "@/lib/supabase";
import {
  ACK_PRESPANI,
  PRESPAVKY_ACKS,
  KAPACITA_DENNI,
  KAPACITA_SPICI,
  VEK_DO,
  VEK_OD,
  cenaBloku,
  getBlok,
  getTermin,
} from "@/lib/prespavky";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RezervacePayload {
  terminId: string;
  blokId: string;
  diteJmeno: string;
  diteVek: string;
  rodicJmeno: string;
  email: string;
  telefon: string;
  poznamka?: string;
  zalohaJmeno: string;
  zalohaTelefon: string;
  acks: Record<string, boolean>;
  gdpr: boolean;
  website?: string;
  _t?: number;
}

// IP rate limit — 1 odeslání za minutu (stejně jako prázdniny).
const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function formatCZK(n: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
    const last = submissions.get(ip);
    if (last && Date.now() - last < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as RezervacePayload;

    // Honeypot + timing — boti dostanou „úspěch" a nic se nestane.
    if (body.website?.trim()) return NextResponse.json({ success: true });
    if (body._t && Date.now() - body._t < 2000) {
      return NextResponse.json({ success: true });
    }

    // ─── Validace ────────────────────────────────────────────────────────
    const termin = getTermin(body.terminId ?? "");
    const blok = getBlok(body.blokId ?? "");
    if (!termin || !blok) {
      return NextResponse.json({ error: "Neplatný termín nebo blok." }, { status: 400 });
    }
    if (!body.rodicJmeno?.trim() || !body.diteJmeno?.trim()) {
      return NextResponse.json(
        { error: "Vyplňte prosím jméno rodiče i dítěte." },
        { status: 400 }
      );
    }
    const vek = parseInt(body.diteVek ?? "", 10);
    if (!Number.isFinite(vek) || vek < VEK_OD || vek > VEK_DO) {
      return NextResponse.json(
        { error: `Přespávačky jsou pro děti ${VEK_OD}–${VEK_DO} let.` },
        { status: 400 }
      );
    }
    if (!body.email?.trim() || !isValidEmail(body.email)) {
      return NextResponse.json({ error: "Zadejte prosím platný e-mail." }, { status: 400 });
    }
    if (!body.telefon?.trim()) {
      return NextResponse.json({ error: "Telefon je povinný." }, { status: 400 });
    }
    if (!body.zalohaJmeno?.trim() || !body.zalohaTelefon?.trim()) {
      return NextResponse.json(
        { error: "Vyplňte prosím záložní kontakt — jméno i telefon." },
        { status: 400 }
      );
    }
    if (blok.spi && body.acks?.[ACK_PRESPANI.key] !== true) {
      return NextResponse.json(
        { error: "U přespání prosím potvrďte, že ho dítě zvládne." },
        { status: 400 }
      );
    }
    if (!body.gdpr) {
      return NextResponse.json(
        { error: "Je potřeba souhlasit se zpracováním údajů." },
        { status: 400 }
      );
    }
    // Všechny podmínky účasti musí být odsouhlasené — kontrolujeme server-side
    // podle stabilních klíčů; do DB se loguje přesně to, co rodič zaškrtl.
    const chybejici = PRESPAVKY_ACKS.filter((a) => body.acks?.[a.key] !== true);
    if (chybejici.length > 0) {
      return NextResponse.json(
        { error: "Potvrďte prosím všechny podmínky účasti." },
        { status: 400 }
      );
    }

    // ─── Re-check kapacity ───────────────────────────────────────────────
    const rows = await supabaseSelect<{ blok: string }>(
      "prespavky_registrace",
      `termin_id=eq.${termin.id}&status=neq.zruseno&select=blok`
    );
    let spici = 0;
    let so = 0;
    let ne = 0;
    for (const r of rows) {
      const b = getBlok(r.blok);
      if (!b) continue;
      if (b.spi) spici++;
      if (b.dny.includes("so")) so++;
      if (b.dny.includes("ne")) ne++;
    }
    if (
      (blok.spi && spici >= KAPACITA_SPICI) ||
      (blok.dny.includes("so") && so >= KAPACITA_DENNI) ||
      (blok.dny.includes("ne") && ne >= KAPACITA_DENNI)
    ) {
      return NextResponse.json(
        {
          error:
            "Bohužel, vybraný blok je pro tento víkend už obsazený. Zkuste prosím jiný blok nebo termín.",
        },
        { status: 409 }
      );
    }

    const cenaKc = cenaBloku(termin, blok);

    // ─── Zápis registrace (před fakturou — záznam je důležitější) ────────
    const acksLog: Record<string, boolean> = {};
    for (const a of PRESPAVKY_ACKS) acksLog[a.key] = body.acks[a.key] === true;
    if (blok.spi) acksLog[ACK_PRESPANI.key] = body.acks[ACK_PRESPANI.key] === true;

    const row = await supabaseInsert("prespavky_registrace", {
      termin_id: termin.id,
      blok: blok.id,
      rodic_jmeno: body.rodicJmeno.trim(),
      email: body.email.trim(),
      telefon: body.telefon.trim(),
      dite_jmeno: body.diteJmeno.trim(),
      dite_vek: vek,
      poznamka: body.poznamka?.trim() || null,
      zaloha_jmeno: body.zalohaJmeno.trim(),
      zaloha_telefon: body.zalohaTelefon.trim(),
      cena_kc: cenaKc,
      acks: acksLog,
      gdpr: true,
      ip,
      user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
    });

    if (!row || !("id" in row)) {
      return NextResponse.json(
        { error: "Chyba při zápisu přihlášky. Zkuste to prosím znovu." },
        { status: 500 }
      );
    }
    const registraceId = String((row as { id: string }).id);
    const customId = `prespavky-${registraceId}`;

    // ─── Fakturoid faktura ───────────────────────────────────────────────
    let invoiceUrl = "";
    let invoiceNumber = "";
    let bankAccount = "";
    let variableSymbol = "";
    let dueOn = "";

    try {
      const invoice = await createInvoice({
        subject: {
          name: body.rodicJmeno.trim(),
          email: body.email.trim(),
          phone: body.telefon.trim(),
          type: "customer",
        },
        lines: [
          {
            name: `Klubík Fořt — víkendová přespávačka ${termin.label} (${termin.tema}), ${blok.label.toLowerCase()} — ${body.diteJmeno.trim()}`,
            quantity: 1,
            unit_name: "ks",
            unit_price: cenaKc,
            vat_rate: 0,
          },
        ],
        payment_method: "bank",
        due: 7,
        note: `Děkujeme za přihlášení dítěte ${body.diteJmeno.trim()} na víkendovou přespávačku na BIO farmě Fořt (${termin.label}, ${blok.casy}). Jídlo je v ceně. Místo je závazně drženo po připsání platby.`,
        footer_note: "Vzdělávací centrum Doučse z.s. — IČO 22201581 — neplátce DPH.",
        custom_id: customId,
        issue_invoice_email: true,
        tags: ["klub-fort", "prespavky-2026"],
      });

      invoiceUrl = invoice.public_html_url || invoice.html_url;
      invoiceNumber = invoice.number;
      bankAccount = invoice.bank_account ?? "";
      variableSymbol = invoice.variable_symbol ?? "";
      dueOn = invoice.due_on ?? "";

      await supabaseUpdate(
        "prespavky_registrace",
        `id=eq.${registraceId}`,
        {
          fakturoid_custom_id: customId,
          fakturoid_invoice_number: invoiceNumber,
          fakturoid_invoice_url: invoiceUrl,
        }
      );
    } catch (err) {
      console.error("[prespavky-rezervovat] Fakturoid invoice failed:", err);
      // Registrace zůstává — fakturu doplní vedení ručně, rodič dostane mail bez odkazu.
    }

    // ─── E-maily ─────────────────────────────────────────────────────────
    const safeRodic = body.rodicJmeno.replace(/[<>]/g, "");
    const safeDite = body.diteJmeno.replace(/[<>]/g, "");
    const safePozn = (body.poznamka ?? "").replace(/[<>]/g, "");
    const safeZaloha = (body.zalohaJmeno + " — " + body.zalohaTelefon).replace(/[<>]/g, "");

    try {
      await resend.emails.send({
        from: "Klubík Fořt <noreply@klubdetifort.cz>",
        to: body.email.trim(),
        replyTo: "reditel@doucse.cz",
        subject: "Potvrzení přihlášky — víkendová přespávačka na farmě",
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#3A362D;line-height:1.6;">
            <h2 style="color:#2D5A27;margin-bottom:8px;">Děkujeme, ${safeRodic}!</h2>
            <p>Přihlášku ${safeDite} na víkendovou přespávačku na BIO farmě Fořt máme zaevidovanou.</p>

            <h3 style="color:#2D5A27;margin-top:24px;">Co jste objednali</h3>
            <table style="border-collapse:collapse;width:100%;font-size:14px;">
              <tr><td style="padding:6px 0;font-weight:bold;width:140px;">Dítě:</td><td style="padding:6px 0;">${safeDite} (${vek} let)</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Termín:</td><td style="padding:6px 0;">${termin.label} — ${termin.tema}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Rozsah:</td><td style="padding:6px 0;">${blok.label} (${blok.casy})</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Cena:</td><td style="padding:6px 0;"><strong>${formatCZK(cenaKc)}</strong> vč. jídla</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Záložní kontakt:</td><td style="padding:6px 0;">${safeZaloha}</td></tr>
              <tr><td style="padding:6px 0;font-weight:bold;">Místo:</td><td style="padding:6px 0;">BIO farma Fořt, Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí</td></tr>
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
                     Částka: <strong>${formatCZK(cenaKc)}</strong><br>
                     Místo je závazně drženo po připsání platby — pošleme vám o ní potvrzení.
                   </p>`
                : `<h3 style="color:#2D5A27;margin-top:24px;">Faktura</h3>
                   <p>Fakturu Vám pošleme do 24 hodin samostatným e-mailem.</p>`
            }

            <h3 style="color:#2D5A27;margin-top:24px;">Dobré vědět</h3>
            <ul style="padding-left:20px;">
              <li>Zrušení je <strong>zdarma do 7 dnů před začátkem akce</strong> — poté se platba nevrací.</li>
              <li>Dokumenty k pobytu (kontakty, oprávněné osoby, zdravotní údaje) vyplníme společně <strong>na místě při příjezdu</strong>.</li>
              <li>Co dítěti sbalit najdete na <a href="https://klubdetifort.cz/prespavky#sbalit" style="color:#2D5A27;">klubdetifort.cz/prespavky#sbalit</a> — pár dní před akcí to ještě připomeneme.</li>
              <li>Zvláštní potřeby dítěte (léky, alergie, diety) proberte prosím předem s Lenkou Formánkovou, která přespávačky vede — detivpoho@gmail.com, 777 584 150.</li>
            </ul>

            <p style="margin-top:24px;">S čímkoli se ozvěte na
              <a href="mailto:reditel@doucse.cz" style="color:#2D5A27;">reditel@doucse.cz</a> nebo
              <a href="tel:+420775917363" style="color:#2D5A27;">775 917 363</a>.
            </p>
            <p>Těšíme se!</p>
            <p><strong>Klubík Fořt</strong></p>

            <hr style="margin-top:24px;border:none;border-top:1px solid #E8DFD0;">
            <p style="font-size:12px;color:#8B6F5E;">
              Toto je automatické potvrzení z klubdetifort.cz.<br>
              Vzdělávací centrum Doučse z.s. · Korunní 2569/108, Praha 10
            </p>
          </div>
        `,
      });
    } catch (e) {
      console.error("[prespavky-rezervovat] client email failed:", e);
    }

    try {
      await resend.emails.send({
        from: "Klubík Fořt <noreply@klubdetifort.cz>",
        // Lenka Formánková vede přespávačky — o každé objednávce ví hned.
        to: ["reditel@doucse.cz", "detivpoho@gmail.com"],
        replyTo: body.email.trim(),
        subject: `🏕️ Nová přespávačka — ${termin.label} — ${safeDite} (${blok.label}, ${formatCZK(cenaKc)})`,
        html: `
          <div style="font-family:sans-serif;max-width:640px;color:#3A362D;">
            <h2 style="color:#2D5A27;">Nová přihláška na přespávačku</h2>
            <table style="border-collapse:collapse;font-size:14px;">
              <tr><td style="padding:6px 12px;font-weight:bold;">Termín:</td><td style="padding:6px 12px;">${termin.label} — ${termin.tema}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Blok:</td><td style="padding:6px 12px;">${blok.label} (${blok.casy})</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Dítě:</td><td style="padding:6px 12px;">${safeDite} (${vek} let)</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Rodič:</td><td style="padding:6px 12px;">${safeRodic}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Kontakt:</td><td style="padding:6px 12px;"><a href="tel:${body.telefon}">${body.telefon}</a> · <a href="mailto:${body.email}">${body.email}</a></td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Záložní kontakt:</td><td style="padding:6px 12px;">${safeZaloha}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Cena:</td><td style="padding:6px 12px;"><strong>${formatCZK(cenaKc)}</strong></td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Faktura:</td><td style="padding:6px 12px;">${invoiceUrl ? `<a href="${invoiceUrl}">${invoiceNumber}</a>` : "<em>nevytvořena (chyba Fakturoidu) — doplnit ručně</em>"}</td></tr>
              <tr><td style="padding:6px 12px;font-weight:bold;">Obsazenost po přihlášce:</td><td style="padding:6px 12px;">spí ${spici + (blok.spi ? 1 : 0)}/${KAPACITA_SPICI} · so ${so + (blok.dny.includes("so") ? 1 : 0)}/${KAPACITA_DENNI} · ne ${ne + (blok.dny.includes("ne") ? 1 : 0)}/${KAPACITA_DENNI}</td></tr>
            </table>
            ${safePozn ? `<h3 style="margin-top:16px;">Poznámka rodiče:</h3><p style="white-space:pre-wrap;background:#F5F0E8;padding:12px;border-radius:8px;">${safePozn}</p>` : ""}
            <p style="font-size:12px;color:#8B6F5E;margin-top:16px;">Souhlasy s podmínkami jsou zalogované v DB (prespavky_registrace, id ${registraceId}).</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("[prespavky-rezervovat] admin email failed:", e);
    }

    submissions.set(ip, Date.now());

    return NextResponse.json({
      success: true,
      invoiceUrl: invoiceUrl || null,
      invoiceNumber: invoiceNumber || null,
      totalKc: cenaKc,
    });
  } catch (err) {
    console.error("[prespavky-rezervovat] error:", err);
    return NextResponse.json({ error: "Interní chyba serveru." }, { status: 500 });
  }
}
