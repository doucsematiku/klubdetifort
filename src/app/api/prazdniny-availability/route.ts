import { NextRequest, NextResponse } from "next/server";
import {
  getDayAvailability,
  PRAZDNINY_DAYS,
  MAX_KIDS_PER_DAY,
} from "@/lib/sheets-prazdniny";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const taken = await getDayAvailability();

  const days = PRAZDNINY_DAYS.map((d) => {
    const used = taken[d.iso] ?? 0;
    const free = Math.max(0, MAX_KIDS_PER_DAY - used);
    return {
      iso: d.iso,
      label: d.label,
      theme: d.theme,
      capacity: MAX_KIDS_PER_DAY,
      used,
      free,
      soldOut: free === 0,
    };
  });

  // Debug mode: ?debug=1 vrátí i raw offline env (pro admin troubleshooting)
  const debugMode = req.nextUrl.searchParams.get("debug") === "1";
  const payload: Record<string, unknown> = { days };
  if (debugMode) {
    const rawOffline = process.env.PRAZDNINY_OFFLINE_RESERVATIONS;
    payload.debug = {
      offline_raw: rawOffline ?? null,
      offline_raw_length: rawOffline?.length ?? 0,
      offline_raw_first_50: rawOffline?.slice(0, 50) ?? null,
    };
  }

  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}
