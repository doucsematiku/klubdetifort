import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const debug: Record<string, unknown> = {
    hasEmail: !!clientEmail,
    hasKey: !!rawKey,
    keyLength: rawKey?.length ?? 0,
    hasSheetId: !!sheetId,
  };

  if (!clientEmail || !rawKey || !sheetId) {
    return NextResponse.json({ error: "missing env", debug });
  }

  try {
    const privateKey = Buffer.from(rawKey, "base64").toString("utf-8");
    debug.keyStartsWith = privateKey.substring(0, 30);

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
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
