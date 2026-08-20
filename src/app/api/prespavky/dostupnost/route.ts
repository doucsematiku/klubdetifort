import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase";
import {
  PRESPAVKY_TERMINY,
  KAPACITA_SPICI,
  KAPACITA_DENNI,
  getBlok,
} from "@/lib/prespavky";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Volná místa po termínech: spací kapacita (6) a denní kapacita (8) zvlášť
 * pro sobotu a neděli. Počítají se všechny nezrušené registrace.
 */
export async function GET() {
  const rows = await supabaseSelect<{ termin_id: string; blok: string }>(
    "prespavky_registrace",
    "status=neq.zruseno&select=termin_id,blok"
  );

  const out: Record<
    string,
    { spiciVolno: number; soVolno: number; neVolno: number }
  > = {};

  for (const t of PRESPAVKY_TERMINY) {
    let spici = 0;
    let so = 0;
    let ne = 0;
    for (const r of rows) {
      if (r.termin_id !== t.id) continue;
      const blok = getBlok(r.blok);
      if (!blok) continue;
      if (blok.spi) spici++;
      if (blok.dny.includes("so")) so++;
      if (blok.dny.includes("ne")) ne++;
    }
    out[t.id] = {
      spiciVolno: Math.max(0, KAPACITA_SPICI - spici),
      soVolno: Math.max(0, KAPACITA_DENNI - so),
      neVolno: Math.max(0, KAPACITA_DENNI - ne),
    };
  }

  return NextResponse.json(out);
}
