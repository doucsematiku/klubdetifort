// Heartbeat do doucse-centrum: [OK] maily záloh jsou vypnuté (chodí jen chyby),
// tichou smrt cronu hlídá Velín přes tabulku system_heartbeats.
// Best-effort — selhání heartbeatu nesmí shodit vlastní cron.

const HEARTBEAT_URL = "https://doucse-centrum.vercel.app/api/system-heartbeat";
const SYSTEM = "fort-klub-web";

export async function sendHeartbeat(
  kind: string,
  status: "ok" | "warn" | "fail",
  detail?: string,
): Promise<void> {
  const token = process.env.HEARTBEAT_TOKEN;
  if (!token) {
    console.warn("[heartbeat] HEARTBEAT_TOKEN not set — skipping");
    return;
  }
  try {
    const res = await fetch(HEARTBEAT_URL, {
      method: "POST",
      headers: { "content-type": "application/json", "x-heartbeat-token": token },
      body: JSON.stringify({ system: SYSTEM, kind, status, detail }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error(`[heartbeat] ${kind}: HTTP ${res.status}`);
  } catch (err) {
    console.error(`[heartbeat] ${kind} failed:`, err);
  }
}
