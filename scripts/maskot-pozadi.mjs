/**
 * Maskot Fořťáček (kravička z loga klubíku): z vygenerovaného obrázku na
 * bílém pozadí udělá dva průhledné WebP soubory do `public/maskot/`
 * (postava + kulatý avatar).
 *
 *   node scripts/maskot-pozadi.mjs scripts/maskot-zdroj/fortacek-kling.png [--nahled]
 *
 * Převzato ze skriptu Jurťáčka (jurtyujezirka.cz), ten zase z maskota
 * půjčovny SKI Rental. Úpravy pro kravičku:
 *  - Ucho překrývá levý dolní roh cedule. Dřevo se proto pozná nejen
 *    podle teplé barvy, ale i podle sytosti (oranžové ucho je sytější)
 *    a odstínu (růžové ucho nemá zelenou nad modrou).
 *  - Pod postavou nejsou botky, ale bílé nožičky a tmavě hnědá kopýtka —
 *    „podlaha" začíná až u kopýtek a tmavé body k postavě patří.
 *
 * Postup, prahy a náhledy (`--nahled`) jsou jinak stejné jako u Jurťáčka:
 *  1) cedule se z obrázku vymaže (na webu ji nahradí deska z HTML),
 *  2) pozadí se vyplní od okrajů (jen skoro bílé body navazující na okraj),
 *  3) stín pod kopýtky, 4) vyhlazená hrana, 5) ořez a export WebP.
 *
 * Zdroj: Kling (IMAGE 3.0, 2K HD, 3:4, 28. 9. 2026), jen textové zadání —
 * uložený bezeztrátově v scripts/maskot-zdroj/fortacek-kling.png. Zadání
 * v kostce: přátelský 3D kreslený maskot, roztomilé bílé telátko se
 * slunečně žlutými skvrnami (jako kravička v logu), černá absolventská
 * čepička se zlatým střapcem, zelený šátek, jednou rukou mává, v druhé
 * drží prázdnou dřevěnou cedulku na tyčce, čistě bílé pozadí, bez textu.
 * Obrázek je 1760 × 2336 px; na jiný obrázek je potřeba znovu naladit
 * BOARD_BOX, BOARD_SEED, FLOOR_Y a AVATAR_CROP.
 */

import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'public', 'maskot')

const src = process.argv[2]
const withPreview = process.argv.includes('--nahled')
if (!src) {
  console.error('Použití: node scripts/maskot-pozadi.mjs <zdroj.png> [--nahled]')
  process.exit(1)
}

/* ------------------------------------------------------------------ */
/* Nastavení — laděné na vybraný obrázek (Kling, 1760 × 2336 px).      */
/* ------------------------------------------------------------------ */

/** Bod na prázdné desce cedule (podíl šířky a výšky obrázku), mimo hřebíky. */
const BOARD_SEED = { x: 0.72, y: 0.17 }
/** Výřez, ve kterém deska leží — dál výplň nesmí (tyčka vede do ruky). */
const BOARD_BOX = { x0: 0.57, x1: 0.998, y0: 0.015, y1: 0.33 }
/** Dřevo desky i tmavší spáry mezi prkny: teplá barva (R − B) a ne úplná tma. */
const BOARD_WARM = 30
const BOARD_MIN_R = 70
/** Dřevo je méně syté než oranžové ucho (0,45–0,55 proti 0,69)… */
const BOARD_MAX_SAT = 0.6
/** …a má zelenou nad modrou, růžové ucho ne (G − B 48–51 proti 19). */
const BOARD_MIN_GB = 35
/** O kolik px zdroje roztáhnout vymazanou oblast desky (hrana, tloušťka). */
const BOARD_MARGIN = 14
/** Spodní hrana desky: pod ní pokračuje tyčka, okraj menší. */
const BOARD_MARGIN_BOTTOM = 10
/** Jak daleko pod deskou ještě hledat uzavřenou bílou mezeru (px zdroje). */
const ENCLOSED_REACH = 40
/** Menší souvislé kousky „postavy" jsou jen smetí po ořezu (px zdroje). */
const MIN_ISLAND = 4000

/** Pozadí: nejtmavší kanál musí být aspoň takhle světlý… */
const BG_MIN = 236
/** …a bod skoro bez barvy (rozdíl nejsvětlejšího a nejtmavšího kanálu). */
const BG_CHROMA = 14
/** Největší povolený skok mezi sousedy (součet rozdílů kanálů). */
const BG_STEP = 20

/** Dolní pruh se stínem pod botami (podíl výšky od spodního okraje). */
/** Jen pás pod kopýtky — výš je krémové bříško, které by prošlo jako stín. */
const SHADOW_ZONE = 0.085
const SHADOW_MIN = 120
const SHADOW_CHROMA = 10
/** Stín je plynulý přechod — menší krok, ať výplň nepřeleze přes okraj plátna. */
const SHADOW_STEP = 24
/** Stín vrhaný doleva je modravý (B ≥ R); na postavě nic modrého není. */
const SHADOW_COOL_MIN = 80

/** Podlaha pod spodní obrubou jurty (podíl výšky) — níž jsou už jen nožičky a botky. */
const FLOOR_Y = 0.935
/**
 * Pod obrubou patří k postavě jen sytě hnědé body (nožičky, botky, podrážky):
 * buď hodně teplé (R − B), nebo teplé a syté. Kontaktní stín pod podrážkou je
 * taky hnědavý, ale nesytý (sytost kolem 0,35, botky 0,6–0,75).
 */
const FLOOR_FIGURE_WARM = 70
const FLOOR_FIGURE_SAT = 0.5
/** Díry v botkách (tmavší záhyby) do této velikosti se vrátí postavě (px zdroje). */
const FLOOR_HOLE_MAX = 2500
/** Kopýtka jsou tmavá — pod tímhle jasem (a s hnědým nádechem) patří postavě. */
const FLOOR_HOOF_LUM = 115

/** Cílová výška celé postavy a strana čtvercového avataru v px. */
const FIGURE_HEIGHT = 560
const AVATAR_SIZE = 192
/** Výřez avataru (střecha s obličejem) v podílech zdroje: střed a strana. */
const AVATAR_CROP = { cx: 0.405, cy: 0.3, size: 0.38 }

/* ------------------------------------------------------------------ */

const { data: rgb, info } = await sharp(src)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
const W = info.width
const H = info.height
const N = W * H

const at = (i) => [rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]]
const diff = (a, b) =>
  Math.abs(rgb[a * 3] - rgb[b * 3]) +
  Math.abs(rgb[a * 3 + 1] - rgb[b * 3 + 1]) +
  Math.abs(rgb[a * 3 + 2] - rgb[b * 3 + 2])

/** 0 = postava, 1 = pozadí, 2 = vymazaná cedule */
const kind = new Uint8Array(N)

/* 1) Cedule --------------------------------------------------------- */

/** Rohy původní desky [x, y] ve zdroji: levý horní, pravý horní, pravý dolní, levý dolní. */
let boardQuad = []
/** Horní hrana vymazané desky i s okrajem — co je výš, se do ořezu nepočítá. */
let boardRegionTop = 0

const seed = Math.round(BOARD_SEED.y * H) * W + Math.round(BOARD_SEED.x * W)
{
  // Průměrná barva desky kolem výchozího bodu — jeden bod by mohl padnout
  // zrovna na tmavší letokruh.
  let r = 0, g = 0, b = 0, n = 0
  const sx = seed % W, sy = (seed / W) | 0
  for (let dy = -6; dy <= 6; dy++)
    for (let dx = -6; dx <= 6; dx++) {
      const [pr, pg, pb] = at((sy + dy) * W + sx + dx)
      r += pr; g += pg; b += pb; n++
    }
  const mean = [r / n, g / n, b / n]

  // Průměr jen pro kontrolu, že výchozí bod leží na dřevě.
  if (mean[0] - mean[2] < BOARD_WARM) throw new Error(`BOARD_SEED neleží na desce (průměr ${mean.map(Math.round)})`)
  const bx0 = Math.round(BOARD_BOX.x0 * W), bx1 = Math.round(BOARD_BOX.x1 * W)
  const by0 = Math.round(BOARD_BOX.y0 * H), by1 = Math.round(BOARD_BOX.y1 * H)
  const isWood = (j) => {
    const [pr, , pb] = at(j)
    return pr - pb >= BOARD_WARM && pr >= BOARD_MIN_R
  }

  const face = new Uint8Array(N)
  const stack = [seed]
  face[seed] = 1
  while (stack.length) {
    const i = stack.pop()
    const x = i % W, y = (i / W) | 0
    for (const j of [x > bx0 ? i - 1 : -1, x < bx1 ? i + 1 : -1, y > by0 ? i - W : -1, y < by1 ? i + W : -1]) {
      if (j < 0 || face[j]) continue
      if (isWood(j)) {
        face[j] = 1
        stack.push(j)
      }
    }
  }

  // Čtyři rohy desky (krajní body podle součtu a rozdílu souřadnic) —
  // jen pro komponentu, aby věděla, kam položit desku z HTML.
  let tl = [0, 0, Infinity], br = [0, 0, -Infinity], tr = [0, 0, -Infinity], bl = [0, 0, Infinity]
  // Nejnižší bod desky v každém sloupci — co je pod ním, je „pod deskou".
  const faceBottom = new Int32Array(W).fill(-1)
  for (let i = 0; i < N; i++) {
    if (!face[i]) continue
    const x = i % W, y = (i / W) | 0
    if (x + y < tl[2]) tl = [x, y, x + y]
    if (x + y > br[2]) br = [x, y, x + y]
    if (x - y > tr[2]) tr = [x, y, x - y]
    if (x - y < bl[2]) bl = [x, y, x - y]
    if (y > faceBottom[x]) faceBottom[x] = y
  }
  const quad = [tl, tr, br, bl].map(([x, y]) => [x, y])

  // Deska se roztáhne o okraj (tmavší hrana, přechod do pozadí). Nafouknutí
  // masky místo posouvání rohů — zaoblené rohy desky by jinak nechaly
  // na krajích tenkou čárku.
  const dist = new Uint8Array(N).fill(255)
  let frontier = []
  for (let i = 0; i < N; i++) if (face[i]) { dist[i] = 0; frontier.push(i) }
  for (let d = 1; d <= BOARD_MARGIN && frontier.length; d++) {
    const next = []
    for (const i of frontier) {
      const x = i % W, y = (i / W) | 0
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy
          if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue
          const j = ny * W + nx
          if (dist[j] !== 255) continue
          dist[j] = d
          next.push(j)
        }
    }
    frontier = next
  }

  for (let i = 0; i < N; i++) {
    if (dist[i] === 255) continue
    const x = i % W, y = (i / W) | 0
    const below = faceBottom[x] >= 0 && y > faceBottom[x]
    if (below) {
      if (dist[i] > BOARD_MARGIN_BOTTOM) continue
      // Pod deskou pokračuje tyčka. Šedé a tmavé body necháme; dřevo,
      // jeho oranžovou hranu i světlý přechod do pozadí smažeme.
      const [r, g, bb] = at(i)
      const lum = 0.299 * r + 0.587 * g + 0.114 * bb
      const warm = r - bb
      if (warm < 30 || (lum < 90 && warm < 45)) continue
    }
    kind[i] = 2
  }

  // Nad deskou je už jen konec tyčky — smazat všechno nad horní hranou.
  const [[qx0, qy0], [qx1, qy1]] = [quad[0], quad[1]]
  const topEdgeY = (x) => qy0 + ((qy1 - qy0) * (x - qx0)) / (qx1 - qx0) - BOARD_MARGIN
  for (let x = Math.max(0, qx0 - BOARD_MARGIN); x <= Math.min(W - 1, qx1 + BOARD_MARGIN); x++) {
    for (let y = 0; y < topEdgeY(x); y++) kind[y * W + x] = 2
  }

  boardQuad = quad
  boardRegionTop = Math.max(0, Math.min(quad[0][1], quad[1][1]) - BOARD_MARGIN)
}

/* 2) + 3) Pozadí ---------------------------------------------------- */

const shadowTop = Math.round(H * (1 - SHADOW_ZONE))
const isBg = (i) => {
  const [r, g, b] = at(i)
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b)
  return mn >= BG_MIN && mx - mn <= BG_CHROMA
}
const isShadow = (i) => {
  const [r, g, b] = at(i)
  const mn = Math.min(r, g, b), mx = Math.max(r, g, b)
  if (b >= r && mn >= SHADOW_COOL_MIN) return true
  return mn >= SHADOW_MIN && mx - mn <= SHADOW_CHROMA
}

{
  const stack = []
  const push = (i) => {
    if (kind[i] === 0 && isBg(i)) {
      kind[i] = 1
      stack.push(i)
    }
  }
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x) }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1) }

  // Mezery mezi střechou, tyčkou a rukou můžou být po vymazání desky
  // uzavřené. Proto výplň startuje i z bílých bodů kousek pod deskou.
  {
    let ring = []
    const seen = new Uint8Array(N)
    for (let i = 0; i < N; i++) if (kind[i] === 2) { seen[i] = 1; ring.push(i) }
    for (let d = 0; d < ENCLOSED_REACH && ring.length; d++) {
      const next = []
      for (const i of ring) {
        const x = i % W, y = (i / W) | 0
        for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
          if (j < 0 || seen[j]) continue
          seen[j] = 1
          next.push(j)
          push(j)
        }
      }
      ring = next
    }
  }

  while (stack.length) {
    const i = stack.pop()
    const x = i % W, y = (i / W) | 0
    for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
      if (j < 0 || kind[j] !== 0) continue
      const jy = (j / W) | 0
      const step = diff(i, j)
      const ok =
        (isBg(j) && step <= BG_STEP) ||
        (jy >= shadowTop && isShadow(j) && step <= SHADOW_STEP)
      if (ok) {
        kind[j] = 1
        stack.push(j)
      }
    }
  }
}

/* 3b) Podlaha pod jurtou ------------------------------------------- */

// Pod obrubou je podlaha světlá, teplá, neutrální i modravá a u podrážek
// přechází do tmavého kontaktního stínu, který barvou výplň nezastaví ani
// nepustí. Tady proto rozhoduje barva postavy: nožičky, botky, podrážky
// i konec tyčky jsou sytě hnědé, podlaha a stíny ne.
{
  const floorTop = Math.round(H * FLOOR_Y)
  for (let i = floorTop * W; i < N; i++) {
    if (kind[i] !== 0) continue
    const [r, g, b] = at(i)
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b)
    const sat = mx > 0 ? (mx - mn) / mx : 0
    const lum = 0.299 * r + 0.587 * g + 0.114 * b
    // tmavě hnědá kopýtka (jas kolem 65) patří postavě, šedý stín ne
    const hoof = lum < FLOOR_HOOF_LUM && r - b >= 12
    const figure = hoof || r - b >= FLOOR_FIGURE_WARM || (r - b >= 25 && sat >= FLOOR_FIGURE_SAT)
    if (!figure) kind[i] = 1
  }

  // Tmavší záhyby botek tím vypadly jako díry. Malé kusy „podlahy", které
  // se nedotýkají okraje obrázku, vrátíme postavě.
  const seen = new Uint8Array(N)
  for (let s0 = floorTop * W; s0 < N; s0++) {
    if (kind[s0] !== 1 || seen[s0]) continue
    const members = [s0]
    seen[s0] = 1
    let touchesBorder = false
    for (let k = 0; k < members.length; k++) {
      const i = members[k]
      const x = i % W, y = (i / W) | 0
      if (x === 0 || x === W - 1 || y === H - 1) touchesBorder = true
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > floorTop ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j < 0 || seen[j] || kind[j] !== 1) continue
        seen[j] = 1
        members.push(j)
      }
    }
    if (!touchesBorder && members.length < FLOOR_HOLE_MAX) for (const i of members) kind[i] = 0
  }
}

// Drobné ostrůvky mimo postavu (zbytek hrany desky, smítko ve stínu)
// pryč. Postava je jeden velký souvislý kus, ostrůvky mají pár set bodů.
{
  const label = new Int32Array(N).fill(-1)
  const parts = []
  for (let s = 0; s < N; s++) {
    if (kind[s] !== 0 || label[s] !== -1) continue
    const id = parts.length
    const members = [s]
    label[s] = id
    for (let k = 0; k < members.length; k++) {
      const i = members[k]
      const x = i % W, y = (i / W) | 0
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j < 0 || kind[j] !== 0 || label[j] !== -1) continue
        label[j] = id
        members.push(j)
      }
    }
    parts.push(members)
  }
  for (const m of parts) if (m.length < MIN_ISLAND) for (const i of m) kind[i] = 1
}

/* 4) Hrana ---------------------------------------------------------- */

// Maska postavy stažená o 1 px — krajní body bývají napůl bílé.
const solid = new Uint8Array(N)
for (let i = 0; i < N; i++) {
  if (kind[i] !== 0) continue
  const x = i % W, y = (i / W) | 0
  const edge =
    (x > 0 && kind[i - 1] !== 0) ||
    (x < W - 1 && kind[i + 1] !== 0) ||
    (y > 0 && kind[i - W] !== 0) ||
    (y < H - 1 && kind[i + W] !== 0)
  solid[i] = edge ? 0 : 255
}

const alpha = await sharp(Buffer.from(solid), { raw: { width: W, height: H, channels: 1 } })
  .blur(1.2)
  // sharp by jinak z jednoho kanálu udělal tři (RGB) a indexy by nesedaly.
  .extractChannel(0)
  .raw()
  .toBuffer()

const rgba = Buffer.alloc(N * 4)
const neighbours8 = [-W - 1, -W, -W + 1, -1, 1, W - 1, W, W + 1]
for (let i = 0; i < N; i++) {
  // Rozmazání jen dovnitř postavy: body pozadí zůstanou úplně průhledné,
  // jinak by kolem postavy zbyl bílý lem.
  const a = kind[i] === 0 ? alpha[i] : 0
  let from = i
  if (a > 0 && solid[i] === 0) {
    // Krajní bod je napůl smíchaný s bílou. Barvu si vezme od souseda
    // zevnitř postavy — na tmavém pozadí pak okraj nesvítí.
    for (const d of neighbours8) {
      const j = i + d
      if (j >= 0 && j < N && solid[j] === 255) {
        from = j
        break
      }
    }
  }
  rgba[i * 4] = rgb[from * 3]
  rgba[i * 4 + 1] = rgb[from * 3 + 1]
  rgba[i * 4 + 2] = rgb[from * 3 + 2]
  rgba[i * 4 + 3] = a
}

/* 5) Ořez, zmenšení, export ---------------------------------------- */

// Ořez podle postavy, ale tak, aby se do obrázku vešla i vymazaná deska —
// překryv z HTML pak leží uvnitř obrázku a nic nepřečnívá mimo rámeček.
let x0 = W, y0 = H, x1 = 0, y1 = 0
for (let i = 0; i < N; i++) {
  const x = i % W, y = (i / W) | 0
  if (rgba[i * 4 + 3] < 8 && kind[i] !== 2) continue
  // Vymazaný konec tyčky nad deskou do ořezu nepatří — nahoře by zbylo prázdno.
  if (kind[i] === 2 && y < boardRegionTop) continue
  if (x < x0) x0 = x
  if (x > x1) x1 = x
  if (y < y0) y0 = y
  if (y > y1) y1 = y
}
const pad = 6
x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad)
x1 = Math.min(W - 1, x1 + pad); y1 = Math.min(H - 1, y1 + pad)
const cw = x1 - x0 + 1
const ch = y1 - y0 + 1

mkdirSync(OUT_DIR, { recursive: true })
const full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } })

const figW = Math.round((cw / ch) * FIGURE_HEIGHT)
const figureBuf = await full
  .clone()
  .extract({ left: x0, top: y0, width: cw, height: ch })
  .resize({ height: FIGURE_HEIGHT, kernel: 'lanczos3' })
  .webp({ quality: 85, alphaQuality: 90, effort: 6, smartSubsample: true })
  .toBuffer()
writeFileSync(join(OUT_DIR, 'fortacek-postava.webp'), figureBuf)

const side = Math.round(AVATAR_CROP.size * H)
const ax = Math.round(AVATAR_CROP.cx * W - side / 2)
const ay = Math.round(AVATAR_CROP.cy * H - side / 2)
const avatarBuf = await full
  .clone()
  .extract({ left: ax, top: ay, width: side, height: side })
  .resize({ width: AVATAR_SIZE, height: AVATAR_SIZE, kernel: 'lanczos3' })
  .webp({ quality: 85, alphaQuality: 90, effort: 6, smartSubsample: true })
  .toBuffer()
writeFileSync(join(OUT_DIR, 'fortacek-avatar.webp'), avatarBuf)

// Poloha desky v procentech výsledného obrázku — pro komponentu.
const q = boardQuad.map(([x, y]) => [
  +(((x - x0) / cw) * 100).toFixed(2),
  +(((y - y0) / ch) * 100).toFixed(2),
])
const geometry = {
  figure: { width: figW, height: FIGURE_HEIGHT, bytes: figureBuf.length },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, bytes: avatarBuf.length },
  boardQuadPercent: { tl: q[0], tr: q[1], br: q[2], bl: q[3] },
}
console.log(JSON.stringify(geometry, null, 2))

if (withPreview) {
  const dir = dirname(resolve(src))
  for (const [name, bg] of [
    ['svetle', { r: 255, g: 255, b: 255 }],
    ['tmave', { r: 14, g: 39, b: 57 }],
    ['kontrola', { r: 255, g: 0, b: 200 }],
  ]) {
    const fig = await sharp(figureBuf).png().toBuffer()
    const av = await sharp(avatarBuf).png().toBuffer()
    await sharp({ create: { width: figW + AVATAR_SIZE + 60, height: FIGURE_HEIGHT + 40, channels: 3, background: bg } })
      .composite([
        { input: fig, left: 20, top: 20 },
        { input: av, left: figW + 40, top: 20 },
      ])
      .png()
      .toFile(join(dir, `nahled-${name}.png`))
  }
  // Maska ve zdrojovém rozlišení, zmenšená — kontrola úniků do proužků.
  const maskVis = Buffer.alloc(N * 3)
  for (let i = 0; i < N; i++) {
    const col = kind[i] === 0 ? at(i) : kind[i] === 1 ? [255, 0, 200] : [0, 200, 255]
    maskVis[i * 3] = col[0]; maskVis[i * 3 + 1] = col[1]; maskVis[i * 3 + 2] = col[2]
  }
  await sharp(maskVis, { raw: { width: W, height: H, channels: 3 } })
    .resize({ height: 1400 })
    .png()
    .toFile(join(dir, 'nahled-maska.png'))
}
