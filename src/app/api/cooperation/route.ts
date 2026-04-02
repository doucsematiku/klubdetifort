import { NextRequest, NextResponse } from "next/server";

interface CoopPayload {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  gdpr: boolean;
}

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

    console.log("=== NOVÁ NABÍDKA SPOLUPRÁCE ===");
    console.log(`Jméno: ${body.name}`);
    console.log(`Email: ${body.email}`);
    console.log(`Telefon: ${body.phone || "neuvedeno"}`);
    console.log(`Zájem: ${body.interest}`);
    console.log(`Zpráva: ${body.message || "žádná"}`);
    console.log("===============================");

    submissions.set(ip, Date.now());

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Interní chyba serveru." },
      { status: 500 }
    );
  }
}
