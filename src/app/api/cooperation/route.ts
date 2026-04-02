import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CoopPayload {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  gdpr: boolean;
}

const interestLabels: Record<string, string> = {
  pruvodce: "Průvodcování / Mentoring",
  dobrovolnik: "Dobrovolnictví / Pomoc",
  financni: "Finanční podpora / Sponzoring",
  materialni: "Materiální podpora",
  jine: "Jiné",
};

const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

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

    const body = (await req.json()) as CoopPayload;

    if (!body.name?.trim() || !body.email?.trim() || !body.interest?.trim()) {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "Zadejte prosím platný e-mail." },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: "reditel@doucse.cz",
      replyTo: body.email,
      subject: `Nabídka spolupráce: ${body.name} — ${interestLabels[body.interest] ?? body.interest}`,
      html: `
        <h2>Nová nabídka spolupráce — Vzdělávací klub Farma Fořt</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Jméno:</td><td style="padding:6px 12px;">${body.name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email:</td><td style="padding:6px 12px;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
          ${body.phone ? `<tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${body.phone}">${body.phone}</a></td></tr>` : ""}
          <tr><td style="padding:6px 12px;font-weight:bold;">Zájem o:</td><td style="padding:6px 12px;">${interestLabels[body.interest] ?? body.interest}</td></tr>
        </table>
        ${body.message ? `<h3>Zpráva:</h3><p style="white-space:pre-wrap;">${body.message}</p>` : ""}
        <hr style="margin-top:20px;border:none;border-top:1px solid #ddd;">
        <p style="font-size:12px;color:#999;">Odesláno z formuláře na klubdetifort.cz</p>
      `,
    });

    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cooperation form error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
