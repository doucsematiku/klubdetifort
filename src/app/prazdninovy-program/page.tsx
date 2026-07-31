import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Proběhlé akce pro děti | Klub dětí Fořt",
  description:
    "Archiv akcí Klubu dětí Fořt — letní čtyřdenní program v přírodě BIO farmy Fořt (14.–17. 7. 2026) a fotky z něj.",
  alternates: { canonical: "https://klubdetifort.cz/prazdninovy-program" },
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

export default function ProbehleAkcePage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-beige">
        {/* ============ HLAVIČKA ============ */}
        <header className="bg-dark text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 sm:pt-36 sm:pb-20">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
            >
              ← Zpět na hlavní stránku
            </Link>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
              Archiv
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
              Proběhlé akce
            </h1>
            <div className="mt-5 h-px w-16 bg-orange" />
            <p className="mt-5 max-w-2xl text-white/70 leading-relaxed text-lg">
              Co jsme na farmě už zažili. Nové akce hlásíme na hlavní stránce
              a rodičům dětí z klubíku rovnou v aplikaci.
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          {/* ============ LÉTO 2026 ============ */}
          <article className="rounded-3xl bg-white p-6 sm:p-9 shadow-sm ring-1 ring-dark/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-forest-pale px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest">
                Proběhlo
              </span>
              <span className="text-sm text-dark/50">14.–17. 7. 2026</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-dark">
              Čtyři dny v přírodě pro tvořivé děti
            </h2>
            <p className="mt-1 text-sm text-orange font-semibold">
              s průvodkyní Lenkou Formánkovou
            </p>

            <div className="mt-5 space-y-4 text-dark/80 leading-relaxed">
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

            {/* pět fotek */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
              {FOTKY.map((f, i) => (
                <div
                  key={f.src}
                  className={`overflow-hidden rounded-xl ${
                    i === 0 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  <Image
                    src={f.src}
                    alt={f.alt}
                    width={520}
                    height={520}
                    className="h-32 w-full object-cover sm:h-36"
                  />
                </div>
              ))}
            </div>

            <Link
              href="/galerie"
              className="mt-5 inline-block font-semibold text-forest underline"
            >
              Prohlédnout celou galerii z akce →
            </Link>
          </article>

          {/* ============ CO DÁL ============ */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-dark/5">
            <h2 className="text-xl font-bold text-dark">
              Chcete být u toho příště?
            </h2>
            <p className="mt-2 text-brown leading-relaxed">
              Od září 2026 běží klubík pravidelně — v pondělí, úterý a ve středu.
              Přijďte se k nám nejdřív podívat, prohlídky domlouváme
              individuálně.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/#kontakt"
                className="inline-block rounded-full bg-orange hover:bg-orange-hover px-6 py-3 font-bold text-dark transition-colors"
              >
                Chci přihlásit dítě
              </Link>
              <Link
                href="/prohlidky"
                className="inline-block rounded-full border border-dark/15 px-6 py-3 font-semibold text-dark hover:border-dark/40 transition-colors"
              >
                Domluvit prohlídku
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
