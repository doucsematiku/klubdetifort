/**
 * Vyčistí RESEND_API_KEY ve Vercel env a uloží zpět bez escape sekvence.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 1) Extract clean key
const envProdPath = join(__dirname, "..", ".env.production.local");
const raw = readFileSync(envProdPath, "utf-8");
const m = raw.match(/^RESEND_API_KEY=(.+)$/m);
if (!m) {
  console.error("RESEND_API_KEY nenalezen v .env.production.local");
  process.exit(1);
}
let key = m[1];
// Strip surrounding quotes
if (key.startsWith('"') && key.endsWith('"')) key = key.slice(1, -1);
// Strip literal backslash-n at the end (the bug!)
while (key.endsWith("\\n") || key.endsWith("\\r")) {
  key = key.slice(0, -2);
}
// Strip any trailing whitespace
key = key.replace(/[\s\r\n]+$/g, "").trim();

console.log("Cleaned key length:", key.length);
console.log("Prefix:", key.slice(0, 10));
console.log("Suffix:", key.slice(-4));
console.log("Last 4 codes:", [...key].slice(-4).map((c) => c.charCodeAt(0)).join(" "));
console.log();

// 2) Verify key works pro send (restricted klíče mají oprávnění jen na send)
console.log("=== Verify Resend works with cleaned key (send test) ===");
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from: "Klub Fořt <noreply@klubdetifort.cz>",
    to: "reditel@doucse.cz",
    subject: "TEST: Resend recovery key check",
    html: `<p>Tento email potvrzuje, že vyčištěný Resend klíč funguje. ${new Date().toISOString()}</p>`,
  }),
});
const respText = await res.text();
console.log("Resend HTTP:", res.status, "—", respText);
if (res.status !== 200) {
  console.error("Klíč selhal i po vyčištění. Stop.");
  process.exit(1);
}

// 3) Remove old broken env var
console.log();
console.log("=== Removing broken Vercel env var ===");
try {
  execSync("vercel env rm RESEND_API_KEY production --yes", {
    cwd: join(__dirname, ".."),
    stdio: "inherit",
  });
} catch (err) {
  console.error("Remove failed:", err.message);
}

// 4) Add cleaned key — write to temp file, pipe stdin
console.log();
console.log("=== Adding cleaned key to Vercel ===");
const tmpFile = join(__dirname, ".tmp-key");
writeFileSync(tmpFile, key, { encoding: "utf-8" });
try {
  execSync(`vercel env add RESEND_API_KEY production < "${tmpFile}"`, {
    cwd: join(__dirname, ".."),
    shell: process.platform === "win32" ? "C:\\Program Files\\Git\\bin\\bash.exe" : "/bin/bash",
    stdio: "inherit",
  });
  console.log("OK");
} catch (err) {
  console.error("Add failed:", err.message);
} finally {
  try {
    execSync(process.platform === "win32" ? `del "${tmpFile}"` : `rm "${tmpFile}"`);
  } catch {}
}

console.log();
console.log("=== Hotovo. Po deployi by emaily měly fungovat. ===");
