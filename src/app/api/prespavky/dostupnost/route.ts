import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase";
import {
  PRESPAVKY_TERMINY,
  PRESPAVKY_BLOKY,
  KAPACITA_SPICI,
  KAPACITA_DENNI,
  getBlok,
  volnoPreBlok,
  type PrespavkyBlokId,
  type PrespavkyPocty,
} from "@/lib/prespavky";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface DostupnostTermin {
  spiciVolno: number;
  soVolno: number;
  neVolno: number;
  /** volná místa pro každý blok (0 = blok je pro tenhle termín obsazený) */
  bloky: Record<PrespavkyBlokId, number>;
  /** celý termín je vyčerpaný — nedostupný žádný blok z PRESPAVKY_BLOKY */
  plny: boolean;
}

/**
 * Volná místa po termínech: spací kapacita (6) a denní kapacita (8) zvlášť
 * pro sobotu a neděli, plus dopočítaná plnost jednotlivých bloků a celého
 * termínu — ať klient (formulář) nic z toho sám nepočítá. Počítají se
 * všechny nezrušené registrace.
 */
export async function GET() {
  const rows = await supabaseSelect<{ termin_id: string; blok: string }>(
    "prespavky_registrace",
    "status=neq.zruseno&select=termin_id,blok"
  );

  const out: Record<string, DostupnostTermin> = {};

  for (const t of PRESPAVKY_TERMINY) {
    const pocty: PrespavkyPocty = { spici: 0, so: 0, ne: 0 };
    for (const r of rows) {
      if (r.termin_id !== t.id) continue;
      const blok = getBlok(r.blok);
      if (!blok) continue;
      if (blok.spi) pocty.spici++;
      if (blok.dny.includes("so")) pocty.so++;
      if (blok.dny.includes("ne")) pocty.ne++;
    }

    const bloky = {} as Record<PrespavkyBlokId, number>;
    for (const b of PRESPAVKY_BLOKY) bloky[b.id] = volnoPreBlok(b, pocty);

    out[t.id] = {
      spiciVolno: Math.max(0, KAPACITA_SPICI - pocty.spici),
      soVolno: Math.max(0, KAPACITA_DENNI - pocty.so),
      neVolno: Math.max(0, KAPACITA_DENNI - pocty.ne),
      bloky,
      plny: PRESPAVKY_BLOKY.every((b) => bloky[b.id] <= 0),
    };
  }

  return NextResponse.json(out);
}
