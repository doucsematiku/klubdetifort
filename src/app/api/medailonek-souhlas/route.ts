import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { MEDAILONEK_KOD, PRUVODKYNE } from "@/lib/medailonky";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Odpověď průvodkyně na návrh jejího medailonku. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const id = typeof b.id === "string" ? b.id : "";
  const verdikt = b.verdikt === "schvaluji" || b.verdikt === "pripominka" ? b.verdikt : null;
  const email = typeof b.email === "string" ? b.email.trim().slice(0, 120) : "";
  const komentar = typeof b.komentar === "string" ? b.komentar.trim().slice(0, 4000) : "";

  // stránka je za kódem, tak ho chceme i u odpovědi — ať sem nechodí náhodný spam
  if (b.kod !== MEDAILONEK_KOD) {
    return NextResponse.json({ error: "Neplatný kód." }, { status: 403 });
  }

  const osoba = PRUVODKYNE.find((p) => p.id === id);
  if (!osoba || !verdikt || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Chybí povinné údaje." }, { status: 400 });
  }
  if (verdikt === "pripominka" && komentar.length < 3) {
    return NextResponse.json({ error: "Chybí komentář." }, { status: 400 });
  }

  const kdy = new Date().toLocaleString("cs-CZ", { timeZone: "Europe/Prague" });
  const nadpis =
    verdikt === "schvaluji"
      ? `Medailonek SCHVÁLEN — ${osoba.jmeno}`
      : `Medailonek — připomínka od ${osoba.jmeno}`;

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  try {
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: "reditel@doucse.cz",
      replyTo: email,
      subject: nadpis,
      html: `
        <div style="font-family:sans-serif;max-width:560px;">
          <h2 style="color:#2d5a27;">${esc(nadpis)}</h2>
          <table style="border-collapse:collapse;font-family:sans-serif;">
            <tr><td style="padding:4px 12px 4px 0;"><strong>Průvodkyně:</strong></td><td>${esc(osoba.jmeno)} (${esc(osoba.id)})</td></tr>
            <tr><td style="padding:4px 12px 4px 0;"><strong>Odpověděla z:</strong></td><td>${esc(email)}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;"><strong>Rozhodnutí:</strong></td><td>${verdikt === "schvaluji" ? "souhlasí se zveřejněním" : "chce upravit"}</td></tr>
            <tr><td style="padding:4px 12px 4px 0;"><strong>Kdy:</strong></td><td>${esc(kdy)}</td></tr>
          </table>
          ${komentar ? `<p><strong>Komentář:</strong></p><p style="white-space:pre-wrap;background:#f5f0e8;padding:12px;border-radius:8px;">${esc(komentar)}</p>` : ""}
        </div>
      `,
    });

    // kopie jí samotné, ať má černé na bílém, co odeslala
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: email,
      subject:
        verdikt === "schvaluji"
          ? "Váš medailonek — díky za odsouhlasení"
          : "Váš medailonek — připomínku máme",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#2d5a27;">Děkujeme, ${esc(osoba.jmeno)}!</h2>
          <p>${
            verdikt === "schvaluji"
              ? "Medailonek dáme na web v podobě, kterou jste viděla."
              : "Text upravíme podle vaší připomínky a pošleme vám ho znovu ke schválení."
          }</p>
          ${komentar ? `<p><strong>Co jste nám napsala:</strong></p><p style="white-space:pre-wrap;background:#f5f0e8;padding:12px;border-radius:8px;">${esc(komentar)}</p>` : ""}
          <p style="color:#666;font-size:14px;">Kdyby vás cokoliv dalšího napadlo, stačí odpovědět na tento e-mail nebo napsat na reditel@doucse.cz.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[medailonek-souhlas] email failed:", err);
    return NextResponse.json({ error: "Odeslání se nepodařilo." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
