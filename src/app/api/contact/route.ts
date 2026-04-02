import { NextRequest, NextResponse } from "next/server";

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

    const body = (await req.json()) as ContactPayload;

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

    // Log for now (later: send email via Resend/Nodemailer)
    console.log("=== NOVÝ ZÁJEMCE O FARMU FOŘT ===");
    console.log(`Rodič: ${body.parentName}`);
    console.log(`Email: ${body.email}`);
    console.log(`Telefon: ${body.phone}`);
    console.log(`Dítě: ${body.childName || "neuvedeno"}`);
    console.log(`Ročník: ${body.childGrade || "neuvedeno"}`);
    console.log(`IV status: ${body.ivStatus || "neuvedeno"}`);
    console.log(`Zpráva: ${body.message || "žádná"}`);
    console.log("==================================");

    // TODO: Add email sending via Resend or Nodemailer
    // await sendEmail({
    //   to: "reditel@doucse.cz",
    //   subject: `Nový zájemce: ${body.parentName}`,
    //   body: formatEmail(body),
    // });

    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
