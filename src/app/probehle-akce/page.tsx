import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Droplets, Flame, Images, Mountain, TreePine } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hory from "@/components/design/Hory";

export const metadata: Metadata = {
  title: "Proběhlé akce pro děti | Klub dětí Fořt",
  description:
    "Archiv akcí Klubu dětí Fořt — letní čtyřdenní program v přírodě BIO farmy Fořt (14.–17. 7. 2026) a fotky z něj.",
  alternates: { canonical: "https://klubdetifort.cz/probehle-akce" },
  openGraph: {
    title: "Proběhlé akce — Klub dětí Fořt",
    description:
      "Ohlédnutí za letní akcí pro děti na BIO farmě Fořt v Krkonoších.",
    type: "website",
    locale: "cs_CZ",
  },
};

/** Pět fotek do ohlédnutí. Celá galerie je na /galerie. */
const FOTKY = [
  { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi" },
  { src: "/images/klubik/klubik-21.jpg", alt: "Společné dílo dětí rozložené na trávě" },
  { src: "/images/klubik/klubik-48.jpg", alt: "Zkoumání potoka" },
  { src: "/images/klubik/klubik-31.jpg", alt: "Hadovka z těsta opékaná nad ohněm" },
  { src: "/images/klubik/klubik-12.jpg", alt: "Tvoření z barevných papírů na trávě" },
];

/** Čtyři živly akce — jen dekorativní ikonky (text je v odstavci). */
const ZIVLY = [
  { ikona: TreePine, styl: "bg-forest-pale text-forest" },
  { ikona: Droplets, styl: "bg-sky-100 text-sky-700" },
  { ikona: Flame, styl: "bg-sun text-orange-hover" },
  { ikona: Mountain, styl: "bg-beige-dark text-brown" },
];

export default function ProbehleAkcePage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream">
        {/* ============ HLAVIČKA ============ */}
        <header className="relative overflow-hidden bg-forest-deep text-white">
          <div aria-hidden="true" className="dot-grid absolute inset-0" />
          <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-28">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/20 transition"
            >
              ← Zpět na hlavní stránku
            </Link>
            <p className="hero-in eyebrow flex w-fit text-orange mt-10 sm:mt-12">
              Archiv
            </p>
            <h1 className="hero-in [animation-delay:120ms] mt-4 text-[2.75rem] leading-[1.02] sm:text-7xl font-extrabold">
              Proběhlé <span className="text-orange">akce</span>
            </h1>
            <p className="hero-in [animation-delay:240ms] mt-6 max-w-2xl text-lg text-white/75 leading-relaxed">
              Co jsme na farmě už zažili. Nové akce hlásíme na hlavní stránce
              a rodičům dětí z klubíku rovnou v aplikaci.
            </p>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-cream" />
          </div>
        </header>

        <div className="relative grain">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
            {/* ============ ČASOVÁ OSA ============ */}
            <div className="relative sm:pl-20">
              {/* osa a uzel — jen dekorace */}
              <div aria-hidden="true" className="absolute bottom-0 left-7 top-6 hidden w-0.5 bg-[repeating-linear-gradient(to_bottom,rgb(45_90_39/0.28)_0_8px,transparent_8px_16px)] sm:block" />
              <div aria-hidden="true" className="absolute left-0 top-6 hidden sm:block">
                <span className="icon-bubble h-14 w-14 rounded-2xl bg-orange text-dark shadow-glow ring-4 ring-cream">
                  <Flame className="h-7 w-7" aria-hidden="true" />
                </span>
              </div>

              {/* ============ LÉTO 2026 ============ */}
              <article className="reveal overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-dark/5 lg:grid lg:grid-cols-[1.05fr_1fr]">
                {/* fotky — bento */}
                <div className="relative grid grid-cols-4 auto-rows-[5.25rem] gap-2 p-2 sm:auto-rows-[7rem] sm:gap-2.5 sm:p-2.5 lg:grid-cols-2 lg:auto-rows-[8.75rem]">
                  {FOTKY.map((f, i) => (
                    <div
                      key={f.src}
                      className={`group relative overflow-hidden rounded-[1.4rem] bg-beige ${
                        i === 0 ? "col-span-4 row-span-2 lg:col-span-2" : ""
                      }`}
                    >
                      <Image
                        src={f.src}
                        alt={f.alt}
                        width={i === 0 ? 1000 : 520}
                        height={i === 0 ? 750 : 520}
                        sizes={i === 0 ? "(min-width: 1024px) 480px, 100vw" : "(min-width: 1024px) 240px, 25vw"}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </div>
                  ))}
                  {/* štítky přes velkou fotku */}
                  <div className="pointer-events-none absolute left-5 top-5 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-forest shadow-soft">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                      Proběhlo
                    </span>
                    <span className="rounded-full bg-forest-deep/80 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">14.–17. 7. 2026</span>
                  </div>
                </div>

                <div className="p-6 sm:p-9 lg:p-10 lg:pl-8">
                  <h2 className="text-[1.9rem] leading-[1.08] sm:text-4xl font-extrabold text-dark">
                    Čtyři dny v přírodě pro tvořivé děti
                  </h2>
                  <p className="mt-2 font-hand text-2xl leading-tight text-brown">
                    s průvodkyní Lenkou Formánkovou
                  </p>

                  <div aria-hidden="true" className="mt-5 flex gap-2">
                    {ZIVLY.map(({ ikona: Ikona, styl }, i) => (
                      <span key={i} className={`icon-bubble h-10 w-10 rounded-xl ${styl}`}>
                        <Ikona className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 space-y-4 text-brown leading-relaxed">
                    <p>
                      Čtyři dny, čtyři živly — dřevo, voda, oheň a země. Děti si
                      vyrobily balanční tyče, malovaly obří společnou plachtu,
                      brouzdaly se v potoce, pekly nad ohněm a chodily do krajiny
                      kolem farmy. Akce byla otevřená všem dětem, nejen těm
                      z klubíku.
                    </p>
                    <p>
                      Moc jsme si to užili. Děti byly skvělá parta — zvědavé,
                      kamarádské a ochotné zkoušet věci, které předtím nikdy
                      nedělaly. Díky všem, kdo nám je svěřili.
                    </p>
                  </div>

                  <Link
                    href="/galerie"
                    className="btn btn-forest mt-7 w-full px-5 text-[0.95rem] sm:w-auto sm:px-7 sm:text-base"
                  >
                    <Images className="h-5 w-5 shrink-0" aria-hidden="true" />
                    Prohlédnout celou galerii z akce →
                  </Link>
                </div>
              </article>

              {/* konec osy */}
              <div aria-hidden="true" className="absolute -bottom-2 left-[1.5625rem] hidden h-2.5 w-2.5 rounded-full bg-forest/30 sm:block" />
            </div>

            {/* ============ CO DÁL ============ */}
            <section className="reveal relative isolate mt-14 overflow-hidden rounded-[2rem] bg-forest-deep p-6 text-white shadow-lift sm:mt-20 sm:p-10 lg:p-12">
              <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
              <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-orange/25 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -left-10 -z-10 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
              <div className="max-w-2xl">
                <h2 className="text-[1.9rem] leading-[1.08] sm:text-4xl font-extrabold">
                  Chcete být u toho příště?
                </h2>
                <p className="mt-4 text-white/75 leading-relaxed">
                  Od září 2026 běží klubík pravidelně — v pondělí, úterý a ve středu.
                  Co děti zažívají, sepisujeme v{" "}
                  <Link href="/ze-zivota-klubiku" className="font-semibold text-orange underline decoration-orange/50 underline-offset-4 hover:decoration-orange">
                    deníku Ze života klubíku
                  </Link>
                  . Přijďte se k nám nejdřív podívat, prohlídky domlouváme
                  individuálně.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link
                    href="/#kontakt"
                    className="btn btn-sun btn-shine"
                  >
                    Chci přihlásit dítě
                  </Link>
                  <Link
                    href="/prohlidky"
                    className="btn btn-glass"
                  >
                    Domluvit prohlídku
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
