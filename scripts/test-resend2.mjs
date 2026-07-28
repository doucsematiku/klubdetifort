/**
 * Test Resend s precizním ořezáním klíče.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.production.local");
const raw = readFileSync(envPath, "utf-8");
const m = raw.match(/^RESEND_API_KEY=(.+)$/m);
let key = m[1];
if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);

console.log("Before clean — length:", key.length, "last 6 codes:", [...key].slice(-6).map(c => c.charCodeAt(0)).join(" "));

// Odstraň literal backslash+n na konci
if (key.endsWith("\\n")) {
  key = key.slice(0, -2);
}
// Odstraň jakýkoliv whitespace
key = key.replace(/[\s\r\n]+$/g, "").trim();

console.log("After clean  — length:", key.length, "last 6 codes:", [...key].slice(-6).map(c => c.charCodeAt(0)).join(" "));
console.log("Prefix:", key.slice(0, 10));
console.log();

// Test
console.log("=== Test send ===");
const t0 = Date.now();
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Klub Fořt <noreply@klubdetifort.cz>",
    to: "reditel@doucse.cz",
    subject: "TEST Resend — diagnostika z node skriptu",
    html: `<p>Pokud vidíte tento email, klíč po očištění funguje. ${new Date().toISOString()}</p>`,
  }),
});
const t1 = Date.now();
console.log(`HTTP ${res.status}  trvalo ${t1 - t0}ms`);
console.log(await res.text());
