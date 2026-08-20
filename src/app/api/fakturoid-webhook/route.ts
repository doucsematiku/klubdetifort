import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { type FakturoidWebhookPayload } from "@/lib/fakturoid";
import { markRowPaidByCustomId } from "@/lib/sheets-prazdniny";
import { supabaseUpdate } from "@/lib/supabase";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Fakturoid v3 webhook nepoužívá HMAC. Posílá Authorization hlavičku s tím, co jsme
// nastavili v poli „Autorizace" v UI webhooku. My tam dáme `Bearer <secret>` a
// tady ověříme rovnost (timing-safe).
function verifyAuth(authHeader: string | null): boolean {
  const expected = process.env.FAKTUROID_WEBHOOK_SECRET;
  if (!expected || !authHeader) return false;

  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : authHeader.trim();

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  if (!verifyAuth(req.headers.get("authorization"))) {
    console.warn("[fakturoid-webhook] invalid Authorization header");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  let payload: FakturoidWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as FakturoidWebhookPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // Fakturoid v3 posílá payload ve tvaru { body: { invoice: {...} } } — BEZ pole
  // event_type. Subscribujeme jen na invoice události (Zaplacena + Platba přidána),
  // takže reagujeme na jakoukoli invoice událost, kde je faktura ve stavu `paid`.
  const invoice = payload.body?.invoice;
  if (!invoice) {
    return NextResponse.json({ ok: true, ignored: "no_invoice_in_body" });
  }

  if (invoice.status !== "paid") {
    return NextResponse.json({ ok: true, ignored: "not_paid", status: invoice.status });
  }

  const customId = invoice.custom_id;
  if (!customId) {
    console.warn("[fakturoid-webhook] paid invoice without custom_id:", invoice.number);
    return NextResponse.json({ ok: true, ignored: "no_custom_id" });
  }

  // Faktury Klubíku (provozní appka, custom_id `klubik-*`) přeposíláme do
  // fort-klub-app — Fakturoid credential neumí spravovat webhooky, takže appka
  // sdílí tenhle registrovaný webhook. Secret appky je v env KLUBIK_APP_WEBHOOK_SECRET.
  if (customId.startsWith("klubik-")) {
    const appSecret = process.env.KLUBIK_APP_WEBHOOK_SECRET;
    if (!appSecret) {
      console.error("[fakturoid-webhook] KLUBIK_APP_WEBHOOK_SECRET chybí — nemohu přeposlat", customId);
      return NextResponse.json({ ok: true, forwarded: false, customId });
    }
    try {
      const res = await fetch("https://fort-klub-app.vercel.app/api/fakturoid-webhook", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${appSecret}`,
          "Content-Type": "application/json",
        },
        body: rawBody,
      });
      const forwarded = await res.json().catch(() => null);
      return NextResponse.json({ ok: true, forwarded: res.ok, app: forwarded, customId });
    } catch (e) {
      console.error("[fakturoid-webhook] forward do fort-klub-app selhal:", e);
      return NextResponse.json({ error: "forward failed" }, { status: 500 });
    }
  }

  // Přespávačky (custom_id `prespavky-<uuid>`): označíme zaplaceno v Supabase
  // a pošleme rodiči potvrzení platby — místo je tím definitivně jeho.
  // Víc dětí v jedné objednávce = víc řádků se stejnou fakturou: custom_id má
  // v DB unique constraint, takže ho má jen první řádek — párujeme proto podle
  // fakturoid_invoice_number, ať se zaplaceno označí u všech řádků objednávky.
  if (customId.startsWith("prespavky-")) {
    const paidOnDate = (invoice.paid_on ?? null) as string | null;
    const matchFilter = invoice.number
      ? `fakturoid_invoice_number=eq.${encodeURIComponent(invoice.number)}`
      : `fakturoid_custom_id=eq.${encodeURIComponent(customId)}`;
    const rows = await supabaseUpdate<{
      email: string;
      rodic_jmeno: string;
      dite_jmeno: string;
      termin_id: string;
      blok: string;
      cena_kc: number;
    }>("prespavky_registrace", matchFilter, {
      status: "zaplaceno",
      paid_on: paidOnDate,
    });

    const reg = rows[0];
    if (reg?.email) {
      const jmenaDeti = rows.map((r) => r.dite_jmeno).join(", ");
      const celkemKc = rows.reduce((s, r) => s + (r.cena_kc || 0), 0);
      const castka = new Intl.NumberFormat("cs-CZ", {
        style: "currency",
        currency: "CZK",
        maximumFractionDigits: 0,
      }).format(celkemKc);
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Klubík Fořt <noreply@klubdetifort.cz>",
          to: reg.email,
          replyTo: "reditel@doucse.cz",
          subject: "Platba přijata — místo na přespávačce je vaše 🎉",
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#3A362D;line-height:1.6;">
              <h2 style="color:#2D5A27;">Platba v pořádku dorazila</h2>
              <p>Děkujeme! Platbu za víkendovou přespávačku (${jmenaDeti}) ve výši ${castka} jsme přijali
              a ${rows.length > 1 ? "místa jsou" : "místo je"} závazně rezervované.</p>
              <p>Pár dní před akcí vám pošleme e-mail s tím, co dítěti sbalit
              a jak bude víkend probíhat. Dokumenty k pobytu vyplníme společně na místě při příjezdu.</p>
              <p>S čímkoli se ozvěte na <a href="mailto:reditel@doucse.cz" style="color:#2D5A27;">reditel@doucse.cz</a>
              nebo <a href="tel:+420775917363" style="color:#2D5A27;">775 917 363</a>.</p>
              <p>Těšíme se!<br><strong>Klubík Fořt</strong></p>
              <hr style="margin-top:24px;border:none;border-top:1px solid #E8DFD0;">
              <p style="font-size:12px;color:#8B6F5E;">Automatické potvrzení z klubdetifort.cz ·
              Vzdělávací centrum Doučse z.s.</p>
            </div>
          `,
        });
      } catch (e) {
        console.error("[fakturoid-webhook] prespavky payment email failed:", e);
      }
    } else {
      console.warn("[fakturoid-webhook] prespavky paid, registrace nenalezena:", customId);
    }
    return NextResponse.json({ ok: true, prespavky: true, updated: rows.length, customId });
  }

  // Reagujeme jen na faktury z prázdninového programu (custom_id začíná `prazdniny-`).
  if (!customId.startsWith("prazdniny-")) {
    return NextResponse.json({ ok: true, ignored: "not_prazdniny", customId });
  }

  const paidOn = (invoice.paid_on ?? null) as string | null;
  const updated = await markRowPaidByCustomId(customId, paidOn);

  return NextResponse.json({ ok: true, updated, customId });
}
