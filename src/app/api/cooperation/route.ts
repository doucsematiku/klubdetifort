import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const interestLabels: Record<string, string> = {
  pruvodce: "Průvodcování / Mentoring",
  dobrovolnik: "Dobrovolnictví / Pomoc",
  financni: "Finanční podpora / Sponzoring",
  materialni: "Materiální podpora",
  jine: "Jiné",
};

const submissions = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

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

    const formData = await req.formData();

    // Honeypot spam protection — bots fill hidden fields
    const honeypot = (formData.get("website") as string)?.trim() ?? "";
    if (honeypot) {
      // Silently reject but return success to not alert bots
      return NextResponse.json({ success: true });
    }

    // Timing-based spam protection — form filled in < 2s is likely a bot
    const formLoadedAt = Number(formData.get("_t") ?? "0");
    if (formLoadedAt > 0 && Date.now() - formLoadedAt < 2000) {
      return NextResponse.json({ success: true });
    }

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const interest = (formData.get("interest") as string)?.trim();
    const message = (formData.get("message") as string)?.trim() ?? "";
    const gdpr = formData.get("gdpr") === "true";
    const cvFile = formData.get("cv") as File | null;

    if (!name || !email || !interest) {
      return NextResponse.json(
        { error: "Vyplňte prosím všechna povinná pole." },
        { status: 400 }
      );
    }

    if (!gdpr) {
      return NextResponse.json(
        { error: "Je potřeba souhlasit se zpracováním údajů." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Zadejte prosím platný e-mail." },
        { status: 400 }
      );
    }

    // Validate CV file if provided
    const attachments: { filename: string; content: Buffer }[] = [];
    if (cvFile && cvFile.size > 0) {
      if (cvFile.type !== "application/pdf") {
        return NextResponse.json(
          { error: "CV musí být ve formátu PDF." },
          { status: 400 }
        );
      }
      if (cvFile.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "CV je příliš velké (max 5 MB)." },
          { status: 400 }
        );
      }
      const buffer = Buffer.from(await cvFile.arrayBuffer());
      attachments.push({
        filename: cvFile.name || "cv.pdf",
        content: buffer,
      });
    }

    const cvNote = attachments.length > 0
      ? `<tr><td style="padding:6px 12px;font-weight:bold;">CV:</td><td style="padding:6px 12px;">Přiloženo (${attachments[0].filename})</td></tr>`
      : "";

    const interestLabel = interestLabels[interest] ?? interest;

    // Send notification to admin
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: "reditel@doucse.cz",
      replyTo: email,
      subject: `Nabídka spolupráce: ${name} — ${interestLabel}`,
      html: `
        <h2>Nová nabídka spolupráce — Vzdělávací klub Farma Fořt</h2>
        <table style="border-collapse:collapse;font-family:sans-serif;">
          <tr><td style="padding:6px 12px;font-weight:bold;">Jméno:</td><td style="padding:6px 12px;">${name}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:bold;">Email:</td><td style="padding:6px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding:6px 12px;font-weight:bold;">Telefon:</td><td style="padding:6px 12px;"><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
          <tr><td style="padding:6px 12px;font-weight:bold;">Zájem o:</td><td style="padding:6px 12px;">${interestLabel}</td></tr>
          ${cvNote}
        </table>
        ${message ? `<h3>Zpráva:</h3><p style="white-space:pre-wrap;">${message}</p>` : ""}
        <hr style="margin-top:20px;border:none;border-top:1px solid #ddd;">
        <p style="font-size:12px;color:#999;">Odesláno z formuláře na klubdetifort.cz</p>
      `,
      attachments,
    });

    // Send confirmation email to the applicant
    await resend.emails.send({
      from: "Klub Fořt <noreply@klubdetifort.cz>",
      to: email,
      subject: "Děkujeme za váš zájem o spolupráci — Klub Fořt",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#2d5a27;">Děkujeme, ${name}!</h2>
          <p>Vaši nabídku spolupráce v oblasti <strong>${interestLabel}</strong> jsme přijali.</p>
          <p>Ozveme se vám co nejdříve. Pokud máte zatím jakékoliv dotazy, neváhejte nám napsat na
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
    console.error("Cooperation form error:", error);
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
