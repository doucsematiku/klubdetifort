import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrespavkyForm from "@/components/PrespavkyForm";
import { PRESPAVKY_BLOKY, PRESPAVKY_TERMINY, VEK_DO } from "@/lib/prespavky";

export const metadata: Metadata = {
  title: "Víkendové přespávačky na farmě | Klubík Fořt",
  description:
    "Víkendové přespávačky pro děti od předškoláků do 13 let na BIO farmě Fořt v Krkonoších. Tvoření, večerní oheň, zvířata a spaní na farmě — zatímco si rodiče užijí hory. Malá skupinka, jídlo v ceně.",
  alternates: { canonical: "https://klubdetifort.cz/prespavky" },
  openGraph: {
    title: "Víkendové přespávačky na farmě | Klubík Fořt",
    description:
      "Tematické víkendy pro děti 5–13 let na BIO farmě pod Krkonošemi — tvoření, oheň a spaní na farmě. Jídlo v ceně, malá skupinka.",
    url: "https://klubdetifort.cz/prespavky",
    type: "website",
  },
};

function fmtKc(n: number): string {
  return new Intl.NumberFormat("cs-CZ").format(n) + " Kč";
}

const HARMONOGRAM: { den: string; emoji: string; body: [string, string][] }[] = [
  {
    den: "Pátek",
    emoji: "🌅",
    body: [
      ["16:00", "příjezdy a uvítací kruh"],
      ["16:30", "procházka po farmě"],
      ["18:00", "oheň a večeře"],
      ["20:30", "večerní klid a usínání"],
    ],
  },
  {
    den: "Sobota",
    emoji: "🎨",
    body: [
      ["7:00", "vstávání, snídaně, kruh"],
      ["10:00", "hlavní program — tvoření"],
      ["12:00", "oběd z farmářské kuchyně"],
      ["13:00", "volná hra a procházka"],
      ["18:00", "oheň, kruh a usínání"],
    ],
  },
  {
    den: "Neděle",
    emoji: "🎒",
    body: [
      ["7:00", "vstávání, snídaně, kruh"],
      ["10:00", "dotváření výrobků"],
      ["12:00", "oběd z farmářské kuchyně"],
      ["13:00", "volná hra a rozloučení"],
      ["16:00", "vyzvedávání dětí"],
    ],
  },
];

const FOTKY: { src: string; alt: string }[] = [
  { src: "/images/klubik/klubik-07.jpg", alt: "Děti tvoří z barevných papírů" },
  { src: "/images/klubik/klubik-22.jpg", alt: "Výrobek z přírodnin" },
  { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi" },
  { src: "/images/klubik/klubik-30.jpg", alt: "Pečení jablek na ohni" },
];

const PODMINKY: [string, string][] = [
  [
    "🩺",
    "Dítě musí být zdravé — po tělesné i duševní stránce. Nemocné nebo výrazně nesvé dítě můžeme při předání nepřijmout.",
  ],
  [
    "📅",
    "Zrušení je zdarma do 7 dnů před akcí — vracíme vše. Později se platba nevrací, místo už neobsadíme.",
  ],
  ["🎂", `Věk od předškoláků (5 let) do ${VEK_DO} let.`],
  [
    "🎟️",
    "Místo je vázané na přihlášené dítě — po dohodě s námi ho ale lze předat jinému dítěti, které podmínky splňuje (v rodině či mezi známými), ať vám nepropadne.",
  ],
  ["✍️", "Dokumenty k pobytu a předání dítěte podepíšeme společně na místě při příjezdu."],
  [
    "⏰",
    "Vyzvedávejte prosím včas — za pozdní vyzvednutí účtujeme 200 Kč za každou započatou půlhodinu. Při nevyzvednutí a nedostupnosti rodičů i záložního kontaktu po dvou hodinách postupujeme podle zákona.",
  ],
  [
    "📵",
    "Děti u nás tráví čas spolu, ne u obrazovek — telefon s sebou mít mohou, po příjezdu si ho ale uloží do šuplíčku. Volat můžete kdykoli přímo průvodkyni.",
  ],
  [
    "💬",
    "Léky, alergie, diety a další zvláštnosti proberte prosím předem s Lenkou Formánkovou (detivpoho@gmail.com, 777 584 150) — stačí i poznámka v přihlášce.",
  ],
];

const SBALIT_DEN: string[] = [
  "batůžek a lahev na pití",
  "přezůvky",
  "oblečení podle počasí — ideálně ve vrstvách",
  "nepromokavá bunda nebo pláštěnka",
  "náhradní triko a ponožky",
  "čepice či kšiltovka podle sezóny",
];

const SBALIT_SPANI: string[] = [
  "vlastní spacák a polštářek",
  "pyžamo",
  "hygiena — kartáček, pasta, ručník",
  "kompletní náhradní oblečení",
  "baterka",
  "plyšák nebo oblíbená věc na usínání",
];

const PROSTORY: { src: string; popis: string }[] = [
  { src: "/images/klubik/prostor-badatelna-1.jpg", popis: "Badatelna — tady se tvoří" },
  { src: "/images/klubik/prostor-spolecenska-1.jpg", popis: "Společenská místnost" },
  { src: "/images/klubik/prostor-klidova-1.jpg", popis: "Klidová teráska" },
  { src: "/images/park2.png", popis: "BIO farma Fořt a krajina okolo" },
  { src: "/images/klubik/klubik-42.jpg", popis: "Badatelská procházka okolím farmy" },
];

export default function PrespavkyPage() {
  const zavadeci = PRESPAVKY_TERMINY.find((t) => t.zavadeci)!;
  const bezne = PRESPAVKY_TERMINY.find((t) => !t.zavadeci)!;

  return (
    <>
      <Header />
      <main className="pt-20 sm:pt-24 bg-white">
        {/* ============ HERO ============ */}
        <section className="relative">
          <div className="absolute inset-0">
            <Image
              src="/images/klubik/klubik-31.jpg"
              alt="Večerní oheň na farmě"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark/70 via-dark/55 to-dark/80" />
          </div>
          {/* noční dekorace — měsíček, hvězdy a spící medvídek */}
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            <span className="prespavky-moon absolute top-8 right-6 sm:top-12 sm:right-16 text-5xl sm:text-7xl opacity-70">
              🌙
            </span>
            <span className="prespavky-star absolute top-24 right-24 sm:top-32 sm:right-44 text-xl sm:text-2xl">
              ⭐
            </span>
            <span className="prespavky-star-2 absolute top-10 left-8 sm:top-16 sm:left-24 text-lg sm:text-xl">
              ✨
            </span>
            <span className="prespavky-star-3 absolute bottom-24 right-10 sm:bottom-28 sm:right-28 text-lg sm:text-xl">
              ⭐
            </span>
            <span className="prespavky-star-2 absolute bottom-16 left-10 sm:bottom-20 sm:left-24 text-lg sm:text-xl">
              ✨
            </span>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <p className="text-orange font-bold text-xs sm:text-sm tracking-[0.2em] uppercase mb-3">
              Novinka · podzim 2026
            </p>
            <h1 className="text-[1.9rem] leading-[1.15] sm:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto">
              Víkendové přespávačky
              <span className="text-orange"> na farmě</span>
            </h1>
            <p className="text-white/90 sm:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">
              Tvoření, večerní oheň, zvířata a spaní na BIO farmě pod
              Krkonošemi. Zatímco si užijete hory, děti prožijí víkend, na
              který se nezapomíná.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {["🎂 od předškoláků do 13 let", "👧 max 6 spících dětí", "🍲 jídlo v ceně"].map(
                (b) => (
                  <span
                    key={b}
                    className="bg-white/15 backdrop-blur text-white text-xs sm:text-sm font-semibold rounded-full px-3.5 py-1.5"
                  >
                    {b}
                  </span>
                )
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <a
                href="#prihlaska"
                className="bg-orange hover:bg-orange-hover text-dark font-bold px-8 py-4 rounded-full transition-colors text-base sm:text-lg"
              >
                Přihlásit dítě
              </a>
              <a
                href="#terminy"
                className="border-2 border-white/50 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-colors"
              >
                Termíny a ceny
              </a>
            </div>
          </div>
        </section>

        {/* ============ TERMÍNY ============ */}
        <section id="terminy" className="py-12 sm:py-20 bg-beige scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-forest font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                Čtyři víkendy · čtyři témata
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-dark">
                Vyberte si svůj víkend
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PRESPAVKY_TERMINY.map((t) => (
                <div
                  key={t.id}
                  className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                >
                  {t.zavadeci && (
                    <span className="absolute -top-2.5 right-4 text-[10px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-2.5 py-1 shadow-sm">
                      zaváděcí ceny
                    </span>
                  )}
                  <div className="text-3xl mb-2">{t.emoji}</div>
                  <p className="text-forest font-bold text-lg leading-snug">{t.label}</p>
                  <p className="font-semibold text-dark mt-1 mb-1.5">{t.tema}</p>
                  <p className="text-[13px] text-brown-light leading-relaxed">
                    {t.temaPopis}
                  </p>
                  <p className="mt-3 pt-3 border-t border-beige text-sm text-dark">
                    od <strong className="text-forest">{fmtKc(t.ceny.den)}</strong>
                    <span className="text-brown-light"> / dítě</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ JAK VÍKEND VYPADÁ ============ */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8 lg:gap-14 items-start">
              <div>
                <p className="text-forest font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                  Rytmus víkendu
                </p>
                <h2 className="text-2xl sm:text-4xl font-bold text-dark mb-4">
                  Jak to u nás o víkendu běží
                </h2>
                <p className="text-brown-light leading-relaxed mb-4">
                  Volně a venku — kruh, tvoření, zvířata, oheň. Program je
                  orientační: řídíme se počasím a tím, co děti zrovna táhne.
                </p>
                <div className="bg-forest-pale rounded-2xl p-4 sm:p-5">
                  <p className="text-sm text-dark leading-relaxed">
                    🍲 <strong>Jídlo je v ceně</strong> — snídaně, svačiny
                    a večeře u ohně od nás, obědy z farmářské kuchyně.
                    Diety a alergie vyřešíme po domluvě.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {HARMONOGRAM.map((d) => (
                  <div key={d.den} className="bg-beige rounded-2xl p-4 sm:p-5">
                    <p className="font-bold text-forest mb-3">
                      <span className="mr-1.5">{d.emoji}</span>
                      {d.den}
                    </p>
                    <ul className="space-y-2">
                      {d.body.map(([cas, co]) => (
                        <li key={cas + co} className="flex gap-2 text-[13px] leading-snug">
                          <span className="font-bold text-dark tabular-nums w-11 flex-shrink-0">
                            {cas}
                          </span>
                          <span className="text-brown-light">{co}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ FOTKY ============ */}
        <section className="pb-12 sm:pb-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {FOTKY.map((f, i) => (
                <div
                  key={f.src}
                  className={`rounded-2xl overflow-hidden ${i % 2 === 1 ? "mt-4 lg:mt-8" : ""}`}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={560}
                    height={420}
                    className="w-full h-40 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-brown-light mt-4">
              Fotky z letošního tvoření a výprav dětí u nás na farmě
            </p>
          </div>
        </section>

        {/* ============ KDE SE DĚTI BUDOU POHYBOVAT ============ */}
        <section className="py-12 sm:py-20 bg-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-forest font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                Zázemí a okolí
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-dark mb-2">
                Kde se děti budou pohybovat
              </h2>
              <p className="text-brown-light text-sm sm:text-base max-w-xl mx-auto">
                Tvoří se v badatelně, jí a hraje ve společenské místnosti,
                odpočívá na klidové terásce — a bádá po celé farmě i v krajině
                okolo.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {PROSTORY.map((f, i) => (
                <figure
                  key={f.src}
                  className={`rounded-2xl overflow-hidden bg-white shadow-sm ${
                    i === 3 ? "col-span-2 lg:col-span-1" : ""
                  }`}
                >
                  <Image
                    src={f.src}
                    alt={f.popis}
                    width={640}
                    height={480}
                    className="w-full h-40 sm:h-52 object-cover"
                  />
                  <figcaption className="px-3 py-2 text-xs sm:text-sm font-semibold text-dark">
                    {f.popis}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CENÍK ============ */}
        <section id="cenik" className="relative py-12 sm:py-20 bg-forest text-white scroll-mt-24 overflow-hidden">
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none">
            <span className="prespavky-star absolute top-8 left-[12%] text-lg">✨</span>
            <span className="prespavky-star-2 absolute top-16 right-[15%] text-xl">⭐</span>
            <span className="prespavky-star-3 absolute bottom-10 left-[20%] text-lg">⭐</span>
            <span className="prespavky-moon absolute -bottom-3 right-6 text-5xl opacity-25">🌙</span>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-10">
              <p className="text-orange font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                Ceny za dítě · jídlo v ceně
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold">Ceník</h2>
              <p className="text-white/75 mt-3 max-w-xl mx-auto text-sm sm:text-base">
                První víkend ({zavadeci.label}) je za <strong>zaváděcí ceny</strong> —
                od října platí běžné.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {PRESPAVKY_BLOKY.filter((b) => b.id !== "nedele" && b.id !== "nocpatek").map((b) => (
                <div key={b.id} className="bg-white rounded-2xl p-5 text-dark flex flex-col">
                  <p className="font-bold leading-snug">
                    {b.id === "sobota" ? "Jen jeden den" : b.id === "noc" ? "Jedna noc" : b.label}
                  </p>
                  <p className="text-xs text-brown-light mt-0.5 mb-4 leading-snug">
                    {b.id === "sobota" ? "sobota nebo neděle" : b.id === "noc" ? "pá–so nebo so–ne" : b.casy}
                  </p>
                  <p className="mt-auto">
                    <span className="block text-2xl font-bold text-forest">
                      {fmtKc(zavadeci.ceny[b.cenaKey])}
                    </span>
                    <span className="text-xs text-brown-light">
                      zaváděcí · pak {fmtKc(bezne.ceny[b.cenaKey])}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PODMÍNKY ============ */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-dark mb-2">
                Podmínky v kostce
              </h2>
              <p className="text-brown-light text-sm sm:text-base">
                Nic v drobném písmu — stejné body odsouhlasíte i v přihlášce.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PODMINKY.map(([ikona, text]) => (
                <div key={text} className="flex items-start gap-3 bg-beige rounded-xl p-4">
                  <span className="text-lg leading-none mt-0.5">{ikona}</span>
                  <p className="text-[13px] sm:text-sm text-dark leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <details id="podminky-uplne" className="mt-6 rounded-2xl bg-beige p-5 scroll-mt-24">
              <summary className="cursor-pointer font-bold text-forest">
                📄 Úplné podmínky přespávaček (rozkliknout)
              </summary>
              <div className="mt-4 space-y-3 text-sm text-dark leading-relaxed">
                <p>
                  <strong>Pořadatel:</strong> Vzdělávací centrum Doučse, z.s.,
                  Korunní 2569/108, 101 00 Praha 10, IČO 222 01 581. Akce se
                  koná na BIO farmě Fořt, Fořt 29, 543 44 Černý Důl.
                </p>
                <p>
                  <strong>Přihláška a platba:</strong> Přihláška je závazná
                  objednávka. Po odeslání obdržíte fakturu se splatností 7 dní;
                  při přihlášení méně než týden před akcí je splatnost kratší
                  tak, aby platba dorazila nejpozději před začátkem akce —
                  jinak místo nedržíme. Místo je závazně rezervované po
                  připsání platby. Přihlásit lze dítě od předškolního věku
                  (5 let) do 13 let.
                </p>
                <p>
                  <strong>Storno:</strong> Zrušení je zdarma nejpozději 7 dní
                  před začátkem akce — vracíme celou částku. Při pozdějším
                  zrušení nebo neúčasti se platba nevrací; po dohodě s námi lze
                  místo předat jinému dítěti, které splňuje podmínky účasti.
                  Pokud akci zrušíme my (např. pro malý počet dětí), vracíme
                  vše.
                </p>
                <p>
                  <strong>Předání a vyzvedávání:</strong> Dítě předávají
                  a vyzvedávají rodiče nebo osoby uvedené v dokumentech
                  vyplněných při příjezdu. Za pozdní vyzvednutí účtujeme
                  200 Kč za každou započatou půlhodinu péče navíc. Nepodaří-li
                  se nám spojit s rodiči ani se záložním kontaktem, jsme po
                  dvou hodinách povinni postupovat podle obecně závazných
                  předpisů (vyrozumět orgán sociálně-právní ochrany dětí,
                  případně Policii ČR).
                </p>
                <p>
                  <strong>Zdraví:</strong> Akce se může zúčastnit jen zdravé
                  dítě — po tělesné i duševní stránce. Vyhrazujeme si právo
                  nepřijmout dítě s projevy nemoci, případně požádat rodiče
                  o dřívější vyzvednutí. Léky dítěti podáváme jen po předchozí
                  domluvě.
                </p>
                <p>
                  <strong>Pojištění:</strong> Spolek má sjednáno pojištění
                  odpovědnosti za újmu. <strong>Úrazové pojištění dětí
                  sjednané nemáme</strong> — velmi doporučujeme, aby dítě mělo
                  vlastní úrazové pojištění (většina rodin ho už má; pokud ne,
                  jeho sjednání je otázka pár minut u vaší pojišťovny).
                </p>
                <p>
                  <strong>Technologie:</strong> Telefon může mít dítě s sebou,
                  po příjezdu ho ale ukládáme do šuplíčku — čas u nás děti
                  tráví spolu. Rodiče mohou kdykoli volat přímo průvodkyni.
                </p>
                <p>
                  <strong>Osobní údaje:</strong> Údaje z přihlášky zpracováváme
                  pro pořádání akce a vystavení faktury — podrobnosti v{" "}
                  <a href="/ochrana-osobnich-udaju" className="text-forest font-semibold underline">
                    Zásadách zpracování osobních údajů
                  </a>
                  . Fotografování dětí se řídí stejnými pravidly jako v klubu
                  (děti nefotíme identifikovatelně bez souhlasu).
                </p>
                <p>
                  <strong>Kontakt:</strong> Lenka Formánková,
                  detivpoho@gmail.com, 777 584 150.
                </p>
              </div>
            </details>
          </div>
        </section>

        {/* ============ CO SBALIT ============ */}
        <section id="sbalit" className="py-12 sm:py-20 bg-forest-pale scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-dark mb-2">
                🎒 Co dítěti sbalit
              </h2>
              <p className="text-brown-light text-sm sm:text-base">
                Všechno prosím podepište nebo označte jménem dítěte.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-bold text-forest mb-3">Na každý den</h3>
                <ul className="space-y-2">
                  {SBALIT_DEN.map((v) => (
                    <li key={v} className="flex items-start gap-2.5 text-sm text-dark">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-6">
                <h3 className="font-bold text-forest mb-3">Na přespání navíc 💤</h3>
                <ul className="space-y-2">
                  {SBALIT_SPANI.map((v) => (
                    <li key={v} className="flex items-start gap-2.5 text-sm text-dark">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
                      {v}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ LENKA ============ */}
        <section className="py-12 sm:py-20 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
              <div className="mx-auto">
                <Image
                  src="/images/pruvodkyne/lenka-1.jpg"
                  alt="Lenka Formánková, průvodkyně"
                  width={220}
                  height={220}
                  className="w-40 h-40 sm:w-52 sm:h-52 rounded-full object-cover shadow-md"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-forest font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                  Kdo bude s dětmi
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-dark mb-3">
                  Lenka Formánková
                </h2>
                <p className="text-brown-light leading-relaxed mb-4">
                  Přespávačky vede naše průvodkyně Lenka — sociální pedagožka,
                  maminka domškolačky a lektorka zážitkových a tvořivých kurzů
                  pro děti. S dětmi stráví celý víkend, od příjezdu po
                  vyzvednutí. Cokoliv budete potřebovat, napište jí na{" "}
                  <a href="mailto:detivpoho@gmail.com" className="text-forest font-semibold underline">
                    detivpoho@gmail.com
                  </a>{" "}
                  nebo volejte{" "}
                  <a href="tel:+420777584150" className="text-forest font-semibold underline">
                    777 584 150
                  </a>
                  .
                </p>
                <a
                  href="/pruvodkyne"
                  className="inline-block border-2 border-forest text-forest hover:bg-forest hover:text-white font-semibold px-6 py-3 rounded-full transition-colors text-sm"
                >
                  Přečíst si Lenčin medailonek →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PŘIHLÁŠKA ============ */}
        <section id="prihlaska" className="py-12 sm:py-20 bg-beige scroll-mt-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-forest font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                Přihláška
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold text-dark mb-3">
                Rezervujte dítěti místo
              </h2>
              <p className="text-brown-light text-sm sm:text-base max-w-xl mx-auto">
                Po odeslání přijde e-mailem potvrzení s fakturou se splatností
                7 dní; při přihlášení méně než týden před akcí je splatnost
                kratší tak, aby platba dorazila nejpozději před začátkem akce.
                Místo je závazně vaše po připsání platby. Sourozence můžete
                přihlásit v jedné přihlášce.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-5 sm:p-10 shadow-sm ring-1 ring-dark/5">
              <PrespavkyForm />
            </div>
          </div>
        </section>

        {/* ============ KONTAKT BOX ============ */}
        <section className="bg-forest text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 text-center">
            <p className="text-white/85 leading-relaxed text-sm sm:text-base">
              Máte otázku k přespávačkám? Napište Lence Formánkové na{" "}
              <a href="mailto:detivpoho@gmail.com" className="font-bold underline">
                detivpoho@gmail.com
              </a>{" "}
              nebo volejte{" "}
              <a href="tel:+420777584150" className="font-bold underline">
                777 584 150
              </a>{" "}
              — ráda vám víkend popíše do detailu.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
