import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const credsB64 = process.env.GOOGLE_CREDENTIALS;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const debug: Record<string, unknown> = {
    hasCreds: !!credsB64,
    credsLength: credsB64?.length ?? 0,
    hasSheetId: !!sheetId,
  };

  if (!credsB64 || !sheetId) {
    return NextResponse.json({ error: "missing env", debug });
  }

  try {
    const creds = JSON.parse(Buffer.from(credsB64, "base64").toString("utf-8"));
    debug.clientEmail = creds.client_email;
    debug.hasPrivateKey = !!creds.private_key;
    debug.keyLength = creds.private_key?.length ?? 0;

    const auth = new google.auth.JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "List 1!A1:A3",
    });

    debug.sheetData = res.data.values;
    return NextResponse.json({ success: true, debug });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    debug.error = msg;
    return NextResponse.json({ error: "failed", debug }, { status: 500 });
  }
}
