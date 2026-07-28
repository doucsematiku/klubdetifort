/**
 * Test Resend API + status domény klubdetifort.cz.
 * Spuštění: node scripts/test-resend.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");
for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
}

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) { console.error("Chybí RESEND_API_KEY"); process.exit(1); }

console.log("API key first 8:", apiKey.slice(0, 8));
console.log();

// 1) Domains list
console.log("=== Domény ===");
const domRes = await fetch("https://api.resend.com/domains", {
  headers: { Authorization: `Bearer ${apiKey}` },
});
const domains = await domRes.json();
for (const d of domains.data || []) {
  console.log(`  ${d.name}  status=${d.status}  region=${d.region}`);
}
console.log();

// 2) Send test email
console.log("=== Test send ===");
const t0 = Date.now();
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Klub Fořt <noreply@klubdetifort.cz>",
    to: "reditel@doucse.cz",
    subject: "TEST z fort-klub scripts/test-resend.mjs",
    html: `<p>Tohle je smoke test. Pokud vidíte tento mail, Resend funguje. Čas odeslání: ${new Date().toISOString()}</p>`,
  }),
});
const t1 = Date.now();
const body = await res.json();
console.log(`HTTP ${res.status}  trvalo ${t1 - t0} ms`);
console.log(JSON.stringify(body, null, 2));
