/**
 * Minimální Supabase server klient — REST API přes fetch.
 * Žádný @supabase/supabase-js → menší bundle pro Vercel functions.
 *
 * Používá service_role klíč → obejde RLS. NIKDY ho nedávat na klienta.
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function supabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

/**
 * Insert jednoho rowu do tabulky. Vrací insertovaný row nebo null při chybě.
 * Při chybě loguje detail do console.error, ale nevyhazuje exception
 * — formulářové submity by neměly zmizet kvůli DB problému (Calendar
 * a Sheet jsou paralelní zápisy).
 */
export async function supabaseInsert<T extends Record<string, unknown>>(
  table: string,
  row: T
): Promise<T | null> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("supabaseInsert: missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${encodeURIComponent(table)}`, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(row),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`supabaseInsert(${table}) HTTP ${res.status}: ${text}`);
      return null;
    }

    const data = (await res.json()) as T[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`supabaseInsert(${table}) network error:`, msg);
    return null;
  }
}
