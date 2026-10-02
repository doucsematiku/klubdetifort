import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Backpack, Check, ChevronDown, Moon, MoonStar, Plus, Star } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrespavkyForm from "@/components/PrespavkyForm";
import PrespavkyJiskry from "@/components/PrespavkyJiskry";
import Hory from "@/components/design/Hory";
import SnapRadek from "@/components/design/SnapRadek";
import StickyCta from "@/components/design/StickyCta";
import { PRESPAVKY_AKTIVNI, PRESPAVKY_BLOKY, PRESPAVKY_TERMINY, VEK_DO, terminProsel } from "@/lib/prespavky";
import Maskot from "@/components/maskot/Maskot";

// Stránka je statická — obnovuje se každou hodinu, aby se termín, který
// právě začal, sám přepnul na „proběhlo".
export const revalidate = 3600;

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

/** Bento mřížka zázemí — první fotka velká, farma přes dva sloupce. */
const PROSTORY_BENTO = [
  "col-span-2 h-60 sm:h-80 lg:col-span-2 lg:row-span-2 lg:h-auto",
  "h-44 sm:h-56 lg:h-auto",
  "h-44 sm:h-56 lg:h-auto",
  "h-44 sm:h-56 lg:col-span-2 lg:h-auto",
  "h-44 sm:h-56 lg:h-auto",
];

/** Natočení polaroidů v koláži fotek. */
const POLAROID_ROT = [
  "-rotate-[3deg]",
  "rotate-[2.5deg] translate-y-6 lg:translate-y-10",
  "-rotate-[1.5deg]",
  "rotate-[3deg] translate-y-6 lg:translate-y-10",
];

/** Tečky hvězd na noční obloze: [vlevo, nahoře, velikost px, varianta blikání] */
const TECKY: [string, string, number, number][] = [
  ["6%", "18%", 2, 0],
  ["14%", "8%", 1.5, 1],
  ["22%", "30%", 2, 2],
  ["31%", "12%", 1.5, 0],
  ["44%", "22%", 2.5, 1],
  ["52%", "6%", 1.5, 2],
  ["63%", "16%", 2, 0],
  ["71%", "34%", 1.5, 1],
  ["79%", "10%", 2, 2],
  ["88%", "26%", 1.5, 0],
  ["95%", "14%", 2, 1],
  ["38%", "40%", 1.5, 2],
  ["9%", "44%", 1.5, 1],
  ["58%", "48%", 2, 0],
  ["84%", "52%", 1.5, 2],
];
const BLIKANI = ["prespavky-star", "prespavky-star-2", "prespavky-star-3"];

/** Noční obloha — jen tečky hvězd, žádný text. */
function NocniNebe({ className = "inset-0" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      {TECKY.map(([left, top, s, v], i) => (
        <span
          key={i}
          className={`${BLIKANI[v]} absolute rounded-full bg-white`}
          style={{
            left,
            top,
            width: s,
            height: s,
            boxShadow: s >= 2 ? "0 0 6px rgb(255 255 255 / 0.8)" : undefined,
          }}
        />
      ))}
    </div>
  );
}

/** Čtyřcípá hvězdička (třpyt) — dekorace. */
function Trpyt({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0c.7 6 2.9 8.6 12 12-9.1 3.4-11.3 6-12 12-.7-6-2.9-8.6-12-12C9.1 8.6 11.3 6 12 0Z" />
    </svg>
  );
}

export default function PrespavkyPage() {
  // Vypnuté přespávačky (src/lib/prespavky.ts): dočasné přesměrování na úvod,
  // ať staré odkazy (příspěvky, letáky, vyhledávání) nekončí chybou 404.
  if (!PRESPAVKY_AKTIVNI) redirect("/");

  // zaváděcí (zářijový) víkend už proběhl — ceník ukazuje běžné ceny
  const bezne = PRESPAVKY_TERMINY.find((t) => !t.zavadeci)!;
  // nadcházející víkendy napřed, proběhlé na konec (a zašedlé)
  const terminy = [
    ...PRESPAVKY_TERMINY.filter((t) => !terminProsel(t)),
    ...PRESPAVKY_TERMINY.filter((t) => terminProsel(t)),
  ];

  return (
    <>
      <Header />
      <main className="bg-white">
        {/* ============ HERO — noc u ohně ============ */}
        <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-white lg:items-center">
          {/* fotka ohně — na telefonu přes celou plochu, na počítači jako
              klenuté „okno do noci" vpravo */}
          <div className="absolute inset-0 -z-10 overflow-hidden lg:inset-auto lg:right-[4%] lg:top-[calc(50%+3rem)] lg:h-[min(36rem,66svh)] lg:w-[19rem] lg:-translate-y-1/2 lg:rounded-b-[2.5rem] lg:rounded-t-full lg:shadow-[0_0_0_10px_rgb(255_255_255/0.04),0_40px_90px_-30px_rgb(0_0_0/0.9)] lg:ring-1 lg:ring-white/15 xl:right-[8%] xl:w-[25rem]">
            <Image
              src="/images/klubik/klubik-31.jpg"
              alt="Večerní oheň na farmě"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="kenburns object-cover object-[88%_100%] lg:object-[62%_70%]"
            />
            {/* denní fotku „ponoříme do noci" — modrý tón a tma odshora */}
            <div className="absolute inset-0 bg-night/40 mix-blend-multiply lg:bg-night/25" />
            <div className="absolute inset-0 bg-gradient-to-b from-night via-night/80 via-55% to-night/10 lg:from-night/55 lg:via-night/5 lg:via-45% lg:to-night/25" />
            {/* pod textem vlevo dole ještě trochu tmy, oheň vpravo zůstane vidět */}
            <div className="absolute inset-0 bg-gradient-to-tr from-night/70 via-night/20 via-45% to-transparent lg:hidden" />
          </div>

          {/* záře ohně */}
          <div
            aria-hidden="true"
            className="prespavky-star-2 pointer-events-none absolute -bottom-10 -right-20 -z-10 h-72 w-72 rounded-full bg-orange/40 blur-3xl lg:-z-20 lg:bottom-[2%] lg:right-[1%] lg:h-[26rem] lg:w-[30rem] lg:bg-orange/30 xl:right-[5%]"
          />

          {/* noční dekorace — měsíček, hvězdy a jiskry od ohně */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
            <NocniNebe className="inset-x-0 top-0 h-1/2 lg:left-[62%] lg:h-full" />
            <div className="absolute right-6 top-[8.25rem] sm:right-20 sm:top-40 lg:right-[calc(4%+16rem)] lg:top-40 xl:right-[calc(8%+21.5rem)]">
              <div className="absolute -inset-14 rounded-full bg-sun/15 blur-2xl" />
              <span className="prespavky-moon relative block text-5xl drop-shadow-[0_0_22px_rgb(255_241_207/0.65)] sm:text-7xl">
                🌙
              </span>
            </div>
            <span className="prespavky-star absolute right-[7.5rem] top-[10.5rem] text-sm sm:right-52 sm:top-56 sm:text-xl lg:right-[calc(4%+21rem)] lg:top-[19rem] xl:right-[calc(8%+27rem)]">
              ⭐
            </span>
            <span className="prespavky-star-2 absolute left-[62%] top-[7.75rem] text-sm sm:left-[46%] sm:top-36 sm:text-lg">
              ✨
            </span>
            <span className="prespavky-star-3 absolute right-10 top-[15rem] text-xs sm:right-[30%] sm:top-72 sm:text-base lg:right-[2.5%] lg:top-36">
              ⭐
            </span>
            <span className="prespavky-star-2 absolute right-[42%] top-[13rem] text-xs sm:right-[18%] sm:top-[26rem] sm:text-lg lg:right-[calc(4%+20.5rem)] lg:top-[31rem] xl:right-[calc(8%+26.5rem)]">
              ✨
            </span>
            <Trpyt className="prespavky-star-3 absolute left-[48%] top-[10rem] h-3 w-3 text-sun sm:h-4 sm:w-4" />
            <Trpyt className="prespavky-star absolute right-[35%] top-[9rem] h-2.5 w-2.5 text-white sm:top-48 sm:h-3.5 sm:w-3.5 lg:right-[1.5%] lg:top-[24rem]" />
            <PrespavkyJiskry className="bottom-0 right-0 h-2/3 w-1/2 lg:bottom-[10%] lg:right-[4%] lg:h-[75%] lg:w-[19rem] xl:right-[8%] xl:w-[25rem]" />
          </div>

          {/* polaroid u okna na velké obrazovce — jen dekorace */}
          <div
            aria-hidden="true"
            className="polaroid float-slow pointer-events-none absolute bottom-[13%] right-[calc(8%+19rem)] hidden w-48 -rotate-[7deg] [--r:-7deg] xl:block"
          >
            <Image
              src="/images/klubik/klubik-30.jpg"
              alt=""
              width={384}
              height={384}
              className="aspect-square w-full rounded object-cover"
            />
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-20 sm:pt-44 sm:pb-32 lg:py-40">
            <div className="max-w-2xl lg:max-w-[min(42rem,calc(100%-21rem))]">
              <p className="hero-in mb-5 inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[0.75rem] font-bold uppercase tracking-[0.14em] text-orange ring-1 ring-white/20 backdrop-blur-md sm:text-sm">
                <span className="live-dot" aria-hidden="true" />
                Novinka · podzim 2026
              </p>
              <h1 className="hero-in [animation-delay:120ms] mb-5 text-[2.6rem] leading-[1.02] font-extrabold text-white sm:text-6xl lg:text-7xl">
                Víkendové přespávačky{" "}
                <span className="squiggle text-orange">na farmě</span>
              </h1>
              <p className="hero-in [animation-delay:220ms] mb-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                Tvoření, večerní oheň, zvířata a spaní na BIO farmě pod
                Krkonošemi. Zatímco si užijete hory, děti prožijí víkend, na
                který se nezapomíná.
              </p>
              <div className="hero-in [animation-delay:300ms] mb-8 flex flex-wrap gap-2">
                {["🎂 od předškoláků do 13 let", "👧 max 6 spících dětí", "🍲 jídlo v ceně"].map(
                  (b) => {
                    const [ikona, ...zbytek] = b.split(" ");
                    return (
                      <span
                        key={b}
                        className="inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-[13px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-md sm:text-sm"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-[0.95rem] leading-none">
                          {ikona}
                        </span>{" "}
                        {zbytek.join(" ")}
                      </span>
                    );
                  }
                )}
              </div>
              <div className="hero-in [animation-delay:380ms] flex flex-col gap-3 sm:flex-row">
                <a href="#prihlaska" className="btn btn-sun btn-shine text-base sm:px-8 sm:text-lg">
                  Přihlásit dítě
                </a>
                <a href="#terminy" className="btn btn-glass">
                  Termíny a ceny
                </a>
              </div>
            </div>
          </div>

          {/* nápověda „posuňte dolů" */}
          <div aria-hidden="true" className="absolute bottom-16 left-1/2 hidden -translate-x-1/2 sm:block lg:bottom-24">
            <span className="bounce-soft flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur">
              <ChevronDown className="h-5 w-5" />
            </span>
          </div>

          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-beige" />
          </div>
        </section>

        {/* ============ TERMÍNY ============ */}
        <section id="terminy" className="relative bg-beige grain py-16 sm:py-24 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-14">
              <p className="eyebrow text-forest mb-4">
                Čtyři víkendy · čtyři témata
              </p>
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark">
                Vyberte si svůj víkend
              </h2>
            </div>
            <SnapRadek className="sm:grid-cols-2 lg:grid-cols-4">
              {terminy.map((t) => {
                const prosel = terminProsel(t);
                return (
                <div
                  key={t.id}
                  className={`card relative flex h-full flex-col overflow-hidden p-6 ${
                    prosel ? "bg-white/60 opacity-70 grayscale-[0.6]" : "card-lift"
                  }`}
                >
                  {prosel && (
                    <span className="absolute right-[-2.9rem] top-8 w-48 rotate-45 bg-dark py-1.5 text-center text-[12px] font-bold uppercase tracking-[0.08em] text-white">
                      proběhlo
                    </span>
                  )}
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-sun text-[2rem] leading-none shadow-[inset_0_-5px_0_rgb(255_183_43/0.3)]">
                    {t.emoji}
                  </div>
                  <p className="font-display text-[1.75rem] font-extrabold leading-none tracking-tight text-forest">
                    {t.label}
                  </p>
                  <p className="mt-2.5 font-display text-lg font-bold leading-snug text-dark">{t.tema}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-brown">
                    {t.temaPopis}
                  </p>
                  {!prosel && (
                    <div className="mt-auto pt-5">
                      <p className="border-t-2 border-dashed border-beige-dark pt-4 text-sm text-brown-light">
                        od <strong className="font-display text-2xl font-extrabold text-forest">{fmtKc(t.ceny.den)}</strong>
                        <span className="text-brown-light"> / dítě</span>
                      </p>
                    </div>
                  )}
                </div>
                );
              })}
            </SnapRadek>
          </div>
        </section>

        {/* ============ JAK VÍKEND VYPADÁ ============ */}
        <section className="relative bg-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal mb-10 grid grid-cols-1 items-end gap-x-14 sm:mb-12 lg:grid-cols-2">
              <div>
                <p className="eyebrow text-forest mb-4">
                  Rytmus víkendu
                </p>
                <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl lg:text-[3.4rem] font-extrabold text-dark mb-5 lg:mb-0">
                  Jak to u nás o víkendu běží
                </h2>
              </div>
              <div>
                <p className="text-brown text-[1.05rem] leading-relaxed mb-6">
                  Venku i v teple uvnitř — kruh, tvoření, zvířata, oheň.
                  Když je zima nebo prší, přesouváme se do vytopené badatelny
                  a společenské místnosti. Program je orientační: řídíme se
                  počasím a tím, co děti zrovna táhne.
                </p>
                <p className="flex items-start gap-4 rounded-[1.75rem] bg-sun p-5 text-[15px] leading-relaxed text-brown">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl leading-none shadow-soft">
                    🍲
                  </span>{" "}
                  <span>
                    <strong className="text-dark">Jídlo je v ceně</strong> — snídaně, svačiny
                    a večeře u ohně od nás, obědy z farmářské kuchyně.
                    Diety a alergie vyřešíme po domluvě.
                  </span>
                </p>
              </div>
            </div>
            <SnapRadek className="sm:grid-cols-3 lg:gap-6">
              {HARMONOGRAM.map((d, i) => {
                const noc = i === 0;
                return (
                  <div
                    key={d.den}
                    className={`relative h-full overflow-hidden rounded-[1.75rem] p-5 sm:p-6 ${
                      noc ? "bg-night text-white shadow-lift" : "bg-cream ring-1 ring-beige-dark/70"
                    }`}
                  >
                    {noc && (
                      <>
                        <NocniNebe className="right-0 top-0 h-16 w-2/5" />
                        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-orange/25 blur-2xl" />
                      </>
                    )}
                    <p className={`relative mb-5 flex items-center gap-3 font-display text-xl font-bold ${noc ? "text-white" : "text-forest"}`}>
                      <span
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-xl leading-none ${
                          noc ? "bg-white/10 ring-1 ring-white/15" : "bg-white shadow-soft"
                        }`}
                      >
                        {d.emoji}
                      </span>
                      {d.den}
                    </p>
                    <ul
                      className={`relative space-y-3.5 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:border-l-2 before:border-dashed ${
                        noc ? "before:border-white/20" : "before:border-forest/20"
                      }`}
                    >
                      {d.body.map(([cas, co]) => {
                        const vecer = parseInt(cas, 10) >= 18;
                        return (
                          <li key={cas + co} className="relative flex gap-3 pl-6 text-sm leading-snug">
                            <span
                              aria-hidden="true"
                              className={`absolute left-0 top-[0.2rem] h-3 w-3 rounded-full ring-4 ${
                                noc ? "ring-night" : "ring-cream"
                              } ${
                                vecer
                                  ? "bg-orange shadow-[0_0_10px_2px_rgb(255_183_43/0.55)]"
                                  : noc ? "bg-moss" : "bg-forest"
                              }`}
                            />
                            <span className={`w-11 flex-shrink-0 font-bold tabular-nums ${noc ? "text-white" : "text-dark"}`}>
                              {cas}
                            </span>
                            <span className={noc ? "text-white/75" : "text-brown"}>{co}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </SnapRadek>
          </div>
        </section>

        {/* ============ FOTKY — koláž polaroidů ============ */}
        <section className="relative overflow-hidden bg-white pt-4 pb-20 sm:pb-28">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-1 sm:gap-x-8 lg:grid-cols-4">
              {FOTKY.map((f, i) => (
                <div
                  key={f.src}
                  className={`group reveal polaroid relative transition-[rotate,scale] duration-500 hover:rotate-0 hover:scale-[1.03] ${POLAROID_ROT[i]}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 -rotate-[4deg] rounded-[3px] bg-[#FFE3A0]/90 shadow-[0_1px_3px_rgb(58_54_45/0.18)]"
                  />
                  <div className="overflow-hidden rounded">
                    <Image
                      src={f.src}
                      alt={f.alt}
                      width={560}
                      height={560}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-12 text-center font-hand text-2xl leading-tight text-brown sm:mt-16 sm:text-[1.7rem]">
              Fotky z letošního tvoření a výprav dětí u nás na farmě
            </p>
          </div>
        </section>

        {/* ============ KDE SE DĚTI BUDOU POHYBOVAT ============ */}
        <section className="relative bg-cream grain pt-16 pb-24 sm:pt-24 sm:pb-36">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-12">
              <p className="eyebrow text-forest mb-4">
                Zázemí a okolí
              </p>
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-4">
                Kde se děti budou pohybovat
              </h2>
              <p className="text-brown text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Tvoří se v badatelně, jí a hraje ve společenské místnosti,
                odpočívá na klidové terásce — a bádá po celé farmě i v krajině
                okolo.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:auto-rows-[15rem]">
              {PROSTORY.map((f, i) => (
                <figure
                  key={f.src}
                  className={`group reveal relative overflow-hidden rounded-[1.5rem] bg-beige-dark shadow-soft ${PROSTORY_BENTO[i]}`}
                >
                  <Image
                    src={f.src}
                    alt={f.popis}
                    fill
                    sizes={i === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 50vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-dark/85 via-dark/35 to-transparent" />
                  <figcaption className={`absolute inset-x-0 bottom-0 p-3.5 font-semibold leading-snug text-white sm:p-5 ${i === 0 ? "text-base sm:text-xl font-display" : "text-[13px] sm:text-base"}`}>
                    {f.popis}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-night" />
          </div>
        </section>

        {/* ============ CENÍK ============ */}
        <section id="cenik" className="relative isolate overflow-hidden bg-night pt-14 pb-24 text-white scroll-mt-24 sm:pt-20 sm:pb-36">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
            <NocniNebe className="inset-x-0 top-0 h-14" />
            <NocniNebe className="inset-x-0 bottom-0 h-1/2" />
            <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-forest/40 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-orange/15 blur-3xl" />
            <span className="prespavky-star absolute top-8 left-[12%] text-lg">✨</span>
            <span className="prespavky-star-2 absolute top-5 right-[7%] text-lg sm:top-16 sm:right-[15%] sm:text-xl">⭐</span>
            <span className="prespavky-star-3 absolute bottom-20 left-[20%] text-lg">⭐</span>
            <span className="prespavky-moon absolute bottom-16 right-6 text-5xl opacity-40 sm:right-16 sm:text-6xl">🌙</span>
            <Trpyt className="prespavky-star-2 absolute left-[30%] top-24 h-3 w-3 text-sun" />
            <Trpyt className="prespavky-star-3 absolute right-[28%] top-10 h-2.5 w-2.5 text-white" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-14">
              <p className="eyebrow text-orange mb-4">
                Ceny za dítě · jídlo v ceně
              </p>
              <h2 className="text-[2.6rem] leading-[1] sm:text-6xl font-extrabold">Ceník</h2>
            </div>
            <div className="reveal grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 max-w-5xl mx-auto">
              {PRESPAVKY_BLOKY.filter((b) => b.id !== "nedele" && b.id !== "nocpatek").map((b, i) => (
                <div
                  key={b.id}
                  className={`relative flex flex-col rounded-[1.5rem] bg-white text-dark shadow-[0_24px_48px_-20px_rgb(0_0_0/0.65)] ${
                    i === 0 ? "ring-2 ring-orange shadow-glow" : ""
                  }`}
                >
                  <div className="flex-1 p-4 pb-4 sm:p-6 sm:pb-5">
                    <p className="font-display text-[1.05rem] font-bold leading-snug sm:text-lg">
                      {b.id === "sobota" ? "Jen jeden den" : b.id === "noc" ? "Jedna noc" : b.label}
                    </p>
                    <p className="text-[13px] text-brown-light mt-1 leading-snug">
                      {b.id === "sobota" ? "sobota nebo neděle" : b.id === "noc" ? "pá–so nebo so–ne" : b.casy}
                    </p>
                  </div>
                  {/* perforace vstupenky */}
                  <div aria-hidden="true" className="relative mx-4 border-t-2 border-dashed border-beige-dark sm:mx-6">
                    <span className="absolute -left-[26px] -top-[11px] h-5 w-5 rounded-full bg-night sm:-left-[34px]" />
                    <span className="absolute -right-[26px] -top-[11px] h-5 w-5 rounded-full bg-night sm:-right-[34px]" />
                  </div>
                  <p className="p-4 pt-4 sm:p-6 sm:pt-5">
                    <span className="block font-display text-[1.6rem] font-extrabold leading-none tracking-tight text-forest sm:text-[2rem]">
                      {fmtKc(bezne.ceny[b.cenaKey])}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-white" />
          </div>
        </section>

        {/* ============ PODMÍNKY ============ */}
        <section className="relative bg-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-12">
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-4">
                Podmínky v kostce
              </h2>
              <p className="text-brown text-base sm:text-lg">
                Nic v drobném písmu — stejné body odsouhlasíte i v přihlášce.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {PODMINKY.map(([ikona, text]) => (
                <div key={text} className="reveal flex items-start gap-4 rounded-[1.5rem] bg-cream p-4 sm:p-5 ring-1 ring-beige-dark/60">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[1.35rem] leading-none shadow-soft">
                    {ikona}
                  </span>
                  <p className="text-[15px] text-dark leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <details id="podminky-uplne" className="faq group mt-6 rounded-[1.75rem] bg-beige scroll-mt-24 transition-shadow open:bg-white open:shadow-lift open:ring-1 open:ring-beige-dark/60">
              <summary className="flex items-center justify-between gap-4 p-5 sm:p-6">
                <span className="flex items-center gap-3.5 font-display text-[1.05rem] font-bold leading-snug text-forest sm:text-lg">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl leading-none shadow-soft">
                    📄
                  </span>{" "}
                  <span>Úplné podmínky přespávaček (rozkliknout)</span>
                </span>
                <span aria-hidden="true" className="faq-chevron flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-pale text-forest group-open:bg-orange group-open:text-dark">
                  <Plus className="h-5 w-5" />
                </span>
              </summary>
              <div className="space-y-3 px-5 pb-6 text-[15px] text-dark leading-relaxed sm:px-7 sm:pb-8">
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
                  200 Kč za každou započatou půlhodinu péče navíc;
                  nepodaří-li se nám spojit s rodiči ani se záložním
                  kontaktem, jsme po dvou hodinách povinni postupovat podle
                  obecně závazných předpisů.
                </p>
                <p>
                  <strong>Zdraví:</strong> Akce se může zúčastnit jen zdravé
                  dítě — po tělesné i duševní stránce. U dítěte s výraznými
                  projevy nemoci si vyhrazujeme právo je nepřijmout, případně
                  vás poprosíme o dřívější vyzvednutí. Léky dítěti podáváme jen
                  po předchozí domluvě.
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
                  <a href="/ochrana-osobnich-udaju" className="text-forest font-semibold underline decoration-orange decoration-2 underline-offset-2">
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
        <section id="sbalit" className="relative overflow-hidden bg-forest-pale py-16 sm:py-24 scroll-mt-24">
          <div aria-hidden="true" className="dot-grid-dark absolute inset-0" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-12">
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-4">
                <span className="inline-block -rotate-6">🎒</span> Co dítěti sbalit
              </h2>
              <p className="text-brown text-base sm:text-lg">
                Všechno prosím podepište nebo označte jménem dítěte.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="reveal card p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3.5">
                  <span aria-hidden="true" className="icon-bubble bg-sun text-brown">
                    <Backpack className="h-6 w-6" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-forest">Na každý den</h3>
                </div>
                <ul className="space-y-3.5">
                  {SBALIT_DEN.map((v) => (
                    <li key={v} className="flex items-start gap-3 text-[15px] leading-snug text-dark">
                      <span aria-hidden="true" className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-forest text-white">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="pt-0.5">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="reveal relative isolate overflow-hidden rounded-[1.75rem] bg-night p-6 text-white shadow-lift sm:p-8">
                <NocniNebe className="right-0 top-0 -z-10 h-8 w-1/2" />
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 -z-10 h-48 w-48 rounded-full bg-sun/10 blur-2xl" />
                <div className="mb-6 flex items-center gap-3.5">
                  <span aria-hidden="true" className="icon-bubble bg-white/10 text-sun ring-1 ring-white/15">
                    <Moon className="h-6 w-6" fill="currentColor" />
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-sun">Na přespání navíc 💤</h3>
                </div>
                <ul className="space-y-3.5">
                  {SBALIT_SPANI.map((v) => (
                    <li key={v} className="flex items-start gap-3 text-[15px] leading-snug text-white/90">
                      <span aria-hidden="true" className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange text-dark">
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      <span className="pt-0.5">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ LENKA ============ */}
        <section className="relative overflow-hidden bg-white py-16 sm:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-12 sm:gap-16 items-center">
              <div className="relative isolate mx-auto h-56 w-56 sm:h-64 sm:w-64">
                <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-sun/70 blur-2xl" />
                {/* oběžná dráha s hvězdičkou */}
                <div aria-hidden="true" className="spin-slow absolute -inset-5 rounded-full border-2 border-dashed border-moss/60">
                  <Star className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 text-orange" fill="currentColor" />
                  <span className="absolute -bottom-1.5 left-[18%] h-3 w-3 rounded-full bg-forest" />
                </div>
                <div className="reveal-zoom blob blob-morph relative h-full w-full overflow-hidden shadow-lift">
                  <Image
                    src="/images/pruvodkyne/lenka-1.jpg"
                    alt="Lenka Formánková, průvodkyně"
                    width={512}
                    height={512}
                    className="h-full w-full object-cover object-[50%_25%]"
                  />
                </div>
                <span aria-hidden="true" className="float-slow icon-bubble absolute -bottom-3 -right-3 h-14 w-14 rotate-[8deg] rounded-2xl bg-night text-sun shadow-lift [--r:8deg]">
                  <MoonStar className="h-7 w-7" />
                </span>
              </div>
              <div className="reveal text-center sm:text-left">
                <p className="eyebrow text-forest mb-4">
                  Kdo bude s dětmi
                </p>
                <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-4">
                  Lenka Formánková
                </h2>
                <p className="text-brown text-[1.05rem] leading-relaxed mb-6">
                  Přespávačky vede naše průvodkyně Lenka — sociální pedagožka,
                  maminka domškolačky a lektorka zážitkových a tvořivých kurzů
                  pro děti. S dětmi stráví celý víkend, od příjezdu po
                  vyzvednutí. Cokoliv budete potřebovat, napište jí na{" "}
                  <a href="mailto:detivpoho@gmail.com" className="text-forest font-semibold underline decoration-orange decoration-2 underline-offset-2">
                    detivpoho@gmail.com
                  </a>{" "}
                  nebo volejte{" "}
                  <a href="tel:+420777584150" className="text-forest font-semibold underline decoration-orange decoration-2 underline-offset-2 whitespace-nowrap">
                    777 584 150
                  </a>
                  .
                </p>
                <a
                  href="/pruvodkyne"
                  className="btn btn-outline"
                >
                  Přečíst si Lenčin medailonek →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PŘIHLÁŠKA ============ */}
        <section id="prihlaska" className="relative overflow-hidden bg-beige grain py-16 sm:py-24 scroll-mt-24">
          <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-40 h-72 w-72 rounded-full bg-orange/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-40 h-80 w-80 rounded-full bg-moss/20 blur-3xl" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-12 sm:mb-14">
              <p className="eyebrow text-forest mb-4">
                Přihláška
              </p>
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-4">
                Rezervujte dítěti místo
              </h2>
              <p className="text-brown text-[15px] sm:text-base leading-relaxed max-w-2xl mx-auto">
                Po odeslání přijde e-mailem potvrzení s fakturou se splatností
                7 dní; při přihlášení méně než týden před akcí je splatnost
                kratší tak, aby platba dorazila nejpozději před začátkem akce.
                Místo je závazně vaše po připsání platby. Sourozence můžete
                přihlásit v jedné přihlášce.
              </p>
            </div>
            <div className="relative">
              <span aria-hidden="true" className="icon-bubble absolute -top-7 left-1/2 z-10 h-14 w-14 -translate-x-1/2 rounded-2xl bg-night text-sun shadow-lift ring-4 ring-beige">
                <MoonStar className="h-7 w-7" />
              </span>
              <div className="card rounded-[2rem] p-5 pt-12 shadow-lift ring-1 ring-dark/5 sm:p-10 sm:pt-14">
                <PrespavkyForm />
              </div>
            </div>
          </div>
        </section>

        {/* ============ KONTAKT BOX ============ */}
        <section className="relative isolate overflow-hidden bg-night text-white">
          <NocniNebe className="inset-x-0 top-0 -z-10 h-2/5" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-6 -z-10 h-40 w-40 -translate-x-1/2 rounded-full bg-sun/15 blur-2xl" />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-16 sm:pb-28 lg:pb-32 text-center">
            <span aria-hidden="true" className="icon-bubble mb-5 bg-white/10 text-sun ring-1 ring-white/15">
              <Moon className="h-6 w-6" fill="currentColor" />
            </span>
            <p className="text-white/85 leading-relaxed text-base sm:text-lg">
              Máte otázku k přespávačkám? Napište Lence Formánkové na{" "}
              <a href="mailto:detivpoho@gmail.com" className="font-bold text-white underline decoration-orange decoration-2 underline-offset-4 hover:text-orange">
                detivpoho@gmail.com
              </a>{" "}
              nebo volejte{" "}
              <a href="tel:+420777584150" className="font-bold text-white underline decoration-orange decoration-2 underline-offset-4 hover:text-orange whitespace-nowrap">
                777 584 150
              </a>{" "}
              — ráda vám víkend popíše do detailu.
            </p>
          </div>
        </section>
      </main>
      <Footer />
      {/* Fořťáček — maskot v pravém dolním rohu */}
      <Maskot varianta="prespavky" />

      {/* lepicí tlačítka na telefonu — stejné texty i cíle jako v úvodu */}
      <StickyCta
        akce={[
          { label: "Termíny a ceny", href: "#terminy" },
          { label: "Přihlásit dítě", href: "#prihlaska", hlavni: true },
        ]}
        schovatU={["prihlaska"]}
      />
    </>
  );
}
