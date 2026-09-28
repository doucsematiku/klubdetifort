// Screenshoty stránek: node shot.mjs <baseUrl> <outDir> [mobile|desktop] [paths...]
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire("C:/Users/Uživatel/Vývoje_claude/fajnsprava-sync/package.json");
const { chromium } = require("playwright");

const [, , base, out, mode = "mobile", ...rest] = process.argv;
const paths = rest.length ? rest : ["/", "/prespavky", "/pruvodkyne", "/prohlidky", "/galerie", "/ze-zivota-klubiku", "/probehle-akce"];
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext(
  mode === "mobile"
    ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Mobile Safari/537.36" }
    : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }
);
// cookie lišta pryč — souhlas „jen nutné“, ať nezakrývá screenshoty
await ctx.addInitScript(() => {
  try { localStorage.setItem("klubik-souhlas-mereni", "ne"); } catch {}
});
for (const p of paths) {
  const page = await ctx.newPage();
  await page.goto(base + p, { waitUntil: "networkidle", timeout: 60000 });
  // projet stránku kvůli lazy obrázkům a scroll animacím
  await page.evaluate(async () => {
    // web má scroll-behavior: smooth — pro screenshoty skákat okamžitě
    document.documentElement.style.scrollBehavior = "auto";
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 180)); }
    // počkat, až se dotáhnou líně načítané obrázky
    await Promise.all([...document.images].map((i) => i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 8000); })));
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);
  const name = (p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "")) + "-" + mode;
  await page.screenshot({ path: path.join(out, name + "-fold.png") });
  await page.screenshot({ path: path.join(out, name + "-full.png"), fullPage: true });
  console.log("ok", p);
  await page.close();
}
await browser.close();
