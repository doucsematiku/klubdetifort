/**
 * Denní keep-alive ping na Supabase, aby projekt nepausenul na free planu.
 * Supabase free plan: 7 dní bez DB aktivity → automatický pause.
 *
 * Vercel Cron volá tento endpoint denně (viz vercel.json).
 * Endpoint udělá jednoduché SELECT na obě prohlídkové tabulky — to stačí
 * jako aktivita.
 *
 * Bezpečnost: chráněno přes `CRON_SECRET` v Authorization headeru (Vercel
 * Cron tento header automaticky přidává s hodnotou z env).
 */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Vercel Cron přidává Authorization header automaticky.
  // Z mimo Vercel Cron tento endpoint vrátí 401 — anti-abuse ochrana.
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== expectedAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: "missing_config" }, { status: 500 });
  }

  // SELECT count přes PostgREST — minimální query, ale počítá se jako aktivita.
  const results: Record<string, { ok: boolean; status: number; ms?: number }> = {};
  for (const table of ["prohlidky_rezervace", "prohlidky_alternativy"] as const) {
    const t0 = Date.now();
    try {
      const res = await fetch(`${url}/rest/v1/${table}?select=count`, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: "count=exact",
        },
        cache: "no-store",
      });
      results[table] = { ok: res.ok, status: res.status, ms: Date.now() - t0 };
    } catch (err) {
      console.error(`keepalive ${table} failed:`, err);
      results[table] = { ok: false, status: -1, ms: Date.now() - t0 };
    }
  }

  return NextResponse.json({
    ok: Object.values(results).every((r) => r.ok),
    timestamp: new Date().toISOString(),
    results,
  });
}
