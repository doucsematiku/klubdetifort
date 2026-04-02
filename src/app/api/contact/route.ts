import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactPayload {
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childGrade: string;
  ivStatus: string;
  message: string;
  gdpr: boolean;
}

// Simple in-memory rate limiter
const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 minute between submissions

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";

    // Rate limiting
    const lastSubmission = submissions.get(ip);
    if (lastSubmission && Date.now() - lastSubmission < RATE_LIMIT_MS) {
      return NextResponse.json(
        { error: "Příliš mnoho požadavků. Zkuste to za chvíli." },
        { status: 429 }
      );
    }

    const body = (await req.json()) as ContactPayload & { website?: string; _t?: number };

    // Honeypot spam protection — bots fill hidden fields
    if (body.website?.trim()) {
      return NextResponse.json({ success: true });
    }

    // Timing-based spam protection — form filled in < 2s is likely a bot
    if (body._t && Date.now() - body._t < 2000) {
      return NextResponse.json({ success: true });
    }

    // Server-side validation
    if (!body.parentName?.trim() || !body.email?.trim() || !body.phone?.trim()) {
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

    const gradeLabels: Record<string, string> = {
      "1": "1. třída",
      "2": "2. třída",
      "3": "3. třída",
      "4": "4. třída",
      "5": "5. třída",
    };

    const ivLabels: Record<string, string> = {
      ano: "Ano, již na IV",
      zvazuji: "Zvažujeme přechod",
      ne: "Ne, zatím ne",
    };

    // Send notification to admin
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: "reditel@doucse.cz",
      replyTo: body.email,
      subject: `Nový zájemce: ${body.parentName}`,
      html: `
        <h2>Nový zájemce o Vzdělávací klub Farma Fořt</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Rodič:</td><td style="padding:6px 12px;">${body.parentName}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email:</td><td style="padding:6px 12px;"><a href="mailto:${body.email}">${body.email}</a></td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${body.phone}">${body.phone}</a></td></tr>
          ${body.childName ? `<tr><td style="padding:6px 12px;font-weight:bold;">Dítě:</td><td style="padding:6px 12px;">${body.childName}</td></tr>` : ""}
          ${body.childGrade ? `<tr><td style="padding:6px 12px;font-weight:bold;">Ročník:</td><td style="padding:6px 12px;">${gradeLabels[body.childGrade] ?? body.childGrade}</td></tr>` : ""}
          ${body.ivStatus ? `<tr><td style="padding:6px 12px;font-weight:bold;">Individuální vzdělávání:</td><td style="padding:6px 12px;">${ivLabels[body.ivStatus] ?? body.ivStatus}</td></tr>` : ""}
        </table>
        ${body.message ? `<h3>Zpráva:</h3><p style="white-space:pre-wrap;">${body.message}</p>` : ""}
        <hr style="margin-top:20px;border:none;border-top:1px solid #ddd;">
        <p style="font-size:12px;color:#999;">Odesláno z formuláře na klubdetifort.cz</p>
      `,
    });

    // Send confirmation email to the parent
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: body.email,
      subject: "Děkujeme za váš zájem — Vzdělávací klub Farma Fořt",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#2d5a27;">Děkujeme, ${body.parentName}!</h2>
          <p>Vaši zprávu jsme přijali a brzy se vám ozveme.</p>
          ${body.childName ? `<p>Těšíme se, že ${body.childName} by mohl/a být součástí našeho klubu!</p>` : ""}
          <p>Pokud máte zatím jakékoliv dotazy, neváhejte nám napsat na
            <a href="mailto:reditel@doucse.cz">reditel@doucse.cz</a> nebo zavolat na
            <a href="tel:+420775917363">775 917 363</a>.
          </p>
          <p>S pozdravem,<br><strong>Tým Vzdělávacího klubu Farma Fořt</strong></p>
          <hr style="margin-top:24px;border:none;border-top:1px solid #e5e5e5;">
          <p style="font-size:12px;color:#999;">Toto je automatické potvrzení z klubdetifort.cz</p>
        </div>
      `,
    });

    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
