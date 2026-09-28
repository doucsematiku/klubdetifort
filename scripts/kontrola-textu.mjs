// Kontrola „jen design": porovná texty, odkazy, pole formulářů a alt texty
// stránek mezi produkcí a lokální verzí.
//   node kontrola.mjs [lokalniUrl] [cesty...]
// Výstup: rozdíly v textech (multimnožina textových uzlů), odkazech, polích, altech.
import { createRequire } from "module";
const require = createRequire("C:/Users/Uživatel/Vývoje_claude/fajnsprava-sync/package.json");
const { chromium } = require("playwright");

const PROD = "https://klubdetifort.cz";
const [, , LOCAL = "http://localhost:3099", ...rest] = process.argv;
const CESTY = rest.length
  ? rest
  : ["/", "/prespavky", "/pruvodkyne", "/prohlidky", "/galerie", "/ze-zivota-klubiku", "/probehle-akce", "/pro-nove-rodice", "/dekujeme", "/ochrana-osobnich-udaju"];

async function vytez(page, url) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(1200);
  return page.evaluate(() => {
    const skip = (el) => el.closest("script,style,noscript,[data-kontrola='duplikat']");
    const norm = (s) => s.replace(/\s+/g, " ").trim();
    const texty = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode;
      if (skip(n.parentElement)) continue;
      const t = norm(n.textContent || "");
      if (t) texty.push(t);
    }
    // celý text (spojený) — odolný vůči tomu, jak se text rozdělí do uzlů
    const cely = norm(texty.join(" "));
    const odkazy = [...document.querySelectorAll("a[href]")]
      .filter((a) => !skip(a))
      .map((a) => a.getAttribute("href"));
    const pole = [...document.querySelectorAll("input,select,textarea,button")]
      .filter((e) => !skip(e))
      .map((e) => `${e.tagName.toLowerCase()}[name=${e.getAttribute("name") ?? ""}][type=${e.getAttribute("type") ?? ""}]`);
    const alty = [...document.querySelectorAll("img[alt]")]
      .filter((i) => !skip(i))
      .map((i) => i.getAttribute("alt"))
      .filter(Boolean);
    const ariaLabels = [...document.querySelectorAll("[aria-label]")]
      .filter((e) => !skip(e))
      .map((e) => e.getAttribute("aria-label"));
    return { texty, cely, odkazy, pole, alty, ariaLabels };
  });
}

function rozdilMulti(a, b) {
  const m = new Map();
  for (const x of a) m.set(x, (m.get(x) || 0) + 1);
  for (const x of b) m.set(x, (m.get(x) || 0) - 1);
  const chybi = [], navic = [];
  for (const [k, v] of m) {
    if (v > 0) chybi.push(`${k}${v > 1 ? ` (×${v})` : ""}`);
    if (v < 0) navic.push(`${k}${v < -1 ? ` (×${-v})` : ""}`);
  }
  return { chybi, navic };
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.addInitScript(() => { try { localStorage.setItem("klubik-souhlas-mereni", "ne"); } catch {} });
let chyb = 0;
for (const cesta of CESTY) {
  const p1 = await ctx.newPage();
  const p2 = await ctx.newPage();
  const [a, b] = await Promise.all([vytez(p1, PROD + cesta), vytez(p2, LOCAL + cesta)]);
  await p1.close(); await p2.close();
  const out = [];
  if (a.cely !== b.cely) {
    // najdi první místo, kde se spojený text liší
    let i = 0;
    while (i < a.cely.length && a.cely[i] === b.cely[i]) i++;
    const t = rozdilMulti(a.texty, b.texty);
    const slovaA = a.cely.split(" ").sort().join(" "), slovaB = b.cely.split(" ").sort().join(" ");
    if (slovaA === slovaB) {
      out.push(`  ~ text stejný, jen jiné pořadí bloků (první rozdíl u: …${a.cely.slice(Math.max(0, i - 40), i + 40)}…)`);
    } else {
      out.push(`  ✗ TEXT se liší u: PROD «…${a.cely.slice(Math.max(0, i - 50), i + 60)}…»`);
      out.push(`                     LOCAL «…${b.cely.slice(Math.max(0, i - 50), i + 60)}…»`);
      if (t.chybi.length) out.push("    chybí: " + t.chybi.slice(0, 15).map((x) => JSON.stringify(x)).join(" | "));
      if (t.navic.length) out.push("    navíc: " + t.navic.slice(0, 15).map((x) => JSON.stringify(x)).join(" | "));
      chyb++;
    }
  }
  for (const [nazev, klic] of [["odkazy", "odkazy"], ["pole", "pole"], ["alt", "alty"], ["aria-label", "ariaLabels"]]) {
    const r = rozdilMulti(a[klic], b[klic]);
    if (r.chybi.length || r.navic.length) {
      const zavazne = klic !== "ariaLabels";
      out.push(`  ${zavazne ? "✗" : "~"} ${nazev}: chybí [${r.chybi.join(", ")}] navíc [${r.navic.join(", ")}]`);
      if (zavazne) chyb++;
    }
  }
  console.log(`${out.some((l) => l.includes("✗")) ? "✗" : "✓"} ${cesta}`);
  out.forEach((l) => console.log(l));
}
await browser.close();
console.log(chyb ? `\nNALEZENO ${chyb} rozdílů` : "\nOK — texty, odkazy, pole i alty sedí");
process.exit(chyb ? 1 : 0);
