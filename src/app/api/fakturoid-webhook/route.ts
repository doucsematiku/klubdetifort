import { NextRequest, NextResponse } from "next/server";
import { type FakturoidWebhookPayload } from "@/lib/fakturoid";
import { markRowPaidByCustomId } from "@/lib/sheets-prazdniny";
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

  // Reagujeme jen na faktury z prázdninového programu (custom_id začíná `prazdniny-`).
  if (!customId.startsWith("prazdniny-")) {
    return NextResponse.json({ ok: true, ignored: "not_prazdniny", customId });
  }

  const paidOn = (invoice.paid_on ?? null) as string | null;
  const updated = await markRowPaidByCustomId(customId, paidOn);

  return NextResponse.json({ ok: true, updated, customId });
}
