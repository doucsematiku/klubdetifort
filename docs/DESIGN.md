# Design webu klubdetifort.cz (redesign 9/2026)

Zadání Ivana (27. 9. 2026): **jen design** — moderní, „top", hlavně na telefonu.
**Nesmí se měnit texty, funkce ani sitemapa** (URL, odkazy, formuláře, API, měření).

## Data, podle kterých se ladí
GA4 (property 531044652, 1. 6.–26. 9. 2026): mobil 74 %, desktop 21 %, tablet 4 %.
Prohlížeče: Chrome 46 %, Safari 22 %, **Android Webview 21 %** (in-app prohlížeč FB/IG).
Placené návštěvy (fb/ig/an paid, google cpc) odcházejí během 0–11 s → rozhoduje první obrazovka.
Zobrazení v září: `/` 60 %, `/prespavky` 22 %, `/pruvodkyne` 10 %, `/galerie`, `/probehle-akce`, `/prohlidky`.

## Značka
- Barvy (`src/app/globals.css`, `@theme`): `forest` #2D5A27, `forest-light`, `forest-pale`, `forest-deep` #1B3617 (tmavé plochy, patička),
  `moss` #9CB77F (dekorace), `orange` #FFB72B (slunce z loga, hlavní CTA), `sun` #FFF1CF (světlá žlutá plocha),
  `beige` #F5F0E8, `beige-dark`, `cream` #FBF8F2 (hlavička, papír), `brown`, `brown-light`, `dark` #3A362D, `night` #16263A (přespávačky).
- Písma: nadpisy `font-display` (Bricolage Grotesque; h1–h3 ho mají automaticky), text Inter,
  `font-hand` (Caveat) jen na motto a drobné akcenty — nikdy na delší text.
- Nálada: příroda, klid, řemeslo, Krkonoše; moderní, ale ne korporátní. Žádné stock/AI fotky — jen fotky, které už na webu jsou.

## Stavebnice (globals.css → `@layer components`)
| Třída | Použití |
|---|---|
| `btn` + `btn-sun` / `btn-forest` / `btn-dark` / `btn-outline` / `btn-glass` | tlačítka (min. 52 px na výšku); `btn-shine` = přejíždějící odlesk jen u hlavního CTA |
| `eyebrow` | štítek nad nadpisem (čárka + verzálky), barvu dej `text-*` |
| `card`, `card-lift` | bílá karta se stínem, zvednutí při najetí |
| `icon-bubble` | čtverec 48 px pro ikonu (lucide-react), barvu pozadí dej utilitou |
| `blob`, `blob-2`, `blob-morph` | organický tvar fotky („kámen z potoka"), pomalé přelévání |
| `polaroid` | fotka v bílém rámečku; natočení utilitou `rotate-[…]` |
| `grain` | zrnitost papíru na béžových plochách (pseudo-element, rodič dostane isolation) |
| `dot-grid` / `dot-grid-dark` | rastr teček na tmavé / světlé ploše |
| `squiggle` / `squiggle-forest` | ručně tažená čára pod slovem |
| `live-dot` | pulzující tečka („živě") |
| `reveal` / `reveal-zoom` / `parallax-img` | CSS scroll-driven animace (jen posun, bez blednutí; Safari je ukáže staticky) |
| `hero-in` + `[animation-delay:…]` | nástup prvků úvodní obrazovky |
| `kenburns`, `float-slow`, `spin-slow`, `sway`, `nudge-x`, `bounce-soft`, `fade-in` | drobný pohyb (float-slow jen posouvá — natočení dej utilitou `rotate-*`) |
| `marquee` + `marquee-track` | nekonečný pás (komponenta `FotoPas`) |
| `snap-row` | posuvný řádek karet na telefonu → od 640 px mřížka (komponenta `SnapRadek` přidá tečky) |
| `faq` na `<details>` + `faq-chevron` | rozbalovací otázky s plynulou animací |
| `shadow-soft` / `shadow-lift` / `shadow-glow` | stíny (Tailwind utility z tokenů) |

## Komponenty (`src/components/design/`)
- `Hory` — silueta krkonošského hřebene jako přechod mezi sekcemi (`text-*` = barva, `otocit` = visí shora).
- `StickyCta` — lišta s tlačítky dole na telefonu; jen texty/odkazy CTA, které už na stránce jsou; schová se u formuláře a při liště souhlasu.
- `SnapRadek` — posuvný řádek + tečky.
- `FotoPas` — pás fotek (dekorace, `alt=""`, `aria-hidden`).
- Ikony: `lucide-react` (vždy `aria-hidden="true"`).

## Maskot Fořťáček (`src/components/maskot/`)
Kravička z loga (bílé telátko se žlutými skvrnami, absolventská čepička, zelený šátek) v pravém dolním rohu —
stejný princip jako Jurťáček (jurtyujezirka.cz) a Jirka (skiverleih.cz). Na počítači celá postava s cedulkou
a bublinou s tipy, na telefonu kulatý avatar nad lepicí lištou (StickyCta), bublina po klepnutí.
- Texty a tlačítka: `texty.ts` — varianta `klub` (hlavní, průvodkyně, galerie, deník, archiv → Domluvit prohlídku)
  a `prespavky` (→ Přihlásit dítě, telefon Lenky). Tipy jen pravdivé věci, které jsou i jinde na webu.
- Obrázky: `public/maskot/fortacek-postava.webp` + `fortacek-avatar.webp` ze zdroje
  `scripts/maskot-zdroj/fortacek-kling.png` (Kling IMAGE 3.0, 28. 9. 2026) skriptem
  `node scripts/maskot-pozadi.mjs scripts/maskot-zdroj/fortacek-kling.png --nahled`.
  Cedulka je z HTML — poloha v `Maskot.module.css` (.board/.stub) podle výstupu skriptu.
- Uklidí se u formulářů (#kontakt, #prihlaska), u patičky na počítači a dokud je otevřená lišta souhlasu.

## Pravidla
1. Texty 1:1 — ani čárka, ani pomlčka, ani emoji. Nové prvky jsou jen dekorace bez textu
   (ikony, tvary, fotky s `alt=""`). Kontrola: `node scripts/kontrola-textu.mjs http://localhost:3099 [/cesta…]`
   porovná texty, odkazy, pole formulářů a alty s produkcí (Playwright bere z `Vývoje_claude/fajnsprava-sync`);
   screenshoty mobil/desktop: `node scripts/screenshoty.mjs <url> <složka> mobile|desktop [/cesta…]`.
   Pozn.: na /prespavky se liší odpočet v souhlasech („ještě 3 s" × „4 s") — je to časování, ne změna textu.
2. Funkce beze změny: odkazy (`href`), formuláře (názvy polí, logika, API), měření (CookieConsent, ConversionEvent).
3. Mobil první (390 px): žádný vodorovný scroll stránky, cíle na klepnutí ≥ 44 px, text ≥ 13 px.
4. Pohyb jen v CSS, respektuje `prefers-reduced-motion`; obsah nesmí záviset na tom, jestli animace doběhne.
5. `overflow-x: clip` (ne `hidden`) — jinak se rozbije `position: sticky`.
