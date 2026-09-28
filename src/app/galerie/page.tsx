import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { History, Images, Sun } from "lucide-react";
import Galerie from "@/components/Galerie";
import Hory from "@/components/design/Hory";

export const metadata: Metadata = {
  title: "Galerie — letní akce pro děti | Klub Fořt",
  description:
    "Fotky z letní akce pro děti na BIO farmě Fořt — tvoření, výlety, potok a společné dny v přírodě.",
};

/** Vybrané fotky z letní akce. Ostatní necháváme stranou kvůli soukromí dětí. */
const FOTKY = [
  { src: "/images/klubik/klubik-01.jpg", alt: "Děti si hrají s barevnými šátky na louce", naSirku: true },
  { src: "/images/klubik/klubik-02.jpg", alt: "Děti na kamenném stole v parku farmy", naSirku: true },
  { src: "/images/klubik/klubik-05.jpg", alt: "Společné posezení ve svahu pod stromy", naSirku: true },
  { src: "/images/klubik/klubik-07.jpg", alt: "Tvoření z barevných papírů u dřevěného stolu" },
  { src: "/images/klubik/klubik-12.jpg", alt: "Děti vybírají materiál na společné dílo" },
  { src: "/images/klubik/klubik-13.jpg", alt: "Kvítek na stole mezi pomůckami na tvoření" },
  { src: "/images/klubik/klubik-18.jpg", alt: "Malovaná plachta s barevnými stuhami" },
  { src: "/images/klubik/klubik-21.jpg", alt: "Hotové společné dílo rozložené na trávě" },
  { src: "/images/klubik/klubik-22.jpg", alt: "Lapač z přírodních materiálů proti krajině", naSirku: true },
  { src: "/images/klubik/klubik-23.jpg", alt: "Ozdoba z drátu a kamínků zavěšená na sloupu" },
  { src: "/images/klubik/klubik-27.jpg", alt: "Krájení jablek na společnou svačinu" },
  { src: "/images/klubik/klubik-30.jpg", alt: "Připravená jablka na pečení v ohni" },
  { src: "/images/klubik/klubik-31.jpg", alt: "Hadovka z těsta opékaná nad ohněm" },
  { src: "/images/klubik/klubik-33.jpg", alt: "Barevné šátky rozložené na louce" },
  { src: "/images/klubik/klubik-42.jpg", alt: "Cesta na výlet mezi loukami" },
  { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi", naSirku: true },
  { src: "/images/klubik/klubik-45.jpg", alt: "Polní cesta lemovaná stromy" },
  { src: "/images/klubik/klubik-47.jpg", alt: "Brouzdání v potoce" },
  { src: "/images/klubik/klubik-48.jpg", alt: "Zkoumání potoka a jeho okolí", naSirku: true },
  { src: "/images/klubik/klubik-50.jpg", alt: "Děti u vody v lese" },
  { src: "/images/klubik/klubik-51.jpg", alt: "Společné zkoumání nálezu na dece" },
  { src: "/images/klubik/klubik-57.jpg", alt: "Obrázek z kamínků a barev — mořský svět" },
  { src: "/images/klubik/klubik-60.jpg", alt: "Dětské dílo s kameny a kresbou" },
  { src: "/images/klubik/klubik-63.jpg", alt: "Malovaný obraz s rybami a kamínky" },
];

export default function GaleriePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ============ ÚVODNÍ PÁS ============ */}
      <header className="relative overflow-hidden bg-forest-deep text-white">
        <div aria-hidden="true" className="dot-grid absolute inset-0" />
        <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />

        {/* polaroidy z akce — jen dekorace na velké obrazovce */}
        <div aria-hidden="true" className="pointer-events-none absolute right-[5%] top-1/2 hidden h-80 w-[26rem] -translate-y-[45%] lg:block">
          <div className="polaroid float-slow absolute right-2 top-0 w-52 rotate-[7deg]">
            <Image src="/images/klubik/klubik-47.jpg" alt="" width={416} height={416} className="aspect-square w-full rounded object-cover" />
          </div>
          <div className="polaroid float-slow absolute left-0 top-16 w-48 -rotate-6 [animation-delay:1.4s]">
            <Image src="/images/klubik/klubik-18.jpg" alt="" width={384} height={384} className="aspect-square w-full rounded object-cover" />
          </div>
          <div className="polaroid float-slow absolute bottom-0 right-24 w-40 rotate-3 [animation-delay:2.8s]">
            <Image src="/images/klubik/klubik-31.jpg" alt="" width={320} height={320} className="aspect-square w-full rounded object-cover" />
          </div>
          <Sun className="spin-slow absolute -left-6 -top-8 h-14 w-14 text-orange/70" aria-hidden="true" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-12 sm:pb-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 hover:bg-white/20 transition min-h-11 ring-1 ring-white/10 backdrop-blur"
          >
            ← Zpět na hlavní stránku
          </Link>
          <div className="mt-10 sm:mt-14 max-w-2xl lg:max-w-[40rem] xl:max-w-2xl">
            <p className="hero-in eyebrow text-orange">
              Léto 2026 na farmě Fořt
            </p>
            <h1 className="hero-in [animation-delay:120ms] mt-4 text-[2.5rem] leading-[1.05] sm:text-6xl font-extrabold">
              Fotky z letní akce pro <span className="squiggle">děti</span>
            </h1>
            <p className="hero-in [animation-delay:240ms] mt-6 text-white/75 leading-relaxed text-lg">
              V červenci jsme na farmě uspořádali několik dní pro děti — otevřených
              všem, nejen těm z klubíku. Tvořilo se z toho, co bylo po ruce, chodilo
              se k potoku a do krajiny a vařilo se na ohni. Takhle to u nás vypadá.
            </p>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-px">
          <Hory className="text-cream" />
        </div>
      </header>

      {/* ============ GALERIE ============ */}
      <section className="relative grain bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 sm:pt-12 sm:pb-24">
          <div aria-hidden="true" className="mb-6 flex items-center gap-3 text-forest/60 sm:mb-8">
            <span className="icon-bubble h-10 w-10 rounded-xl bg-forest-pale text-forest">
              <Images className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-forest/25 to-transparent" />
          </div>

          <Galerie fotky={FOTKY} />

          <p className="mt-8 sm:mt-10">
            <Link
              href="/probehle-akce"
              className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 font-semibold text-forest shadow-soft ring-1 ring-dark/5 transition hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sun text-brown transition group-hover:bg-orange group-hover:text-dark">
                <History className="h-4 w-4" aria-hidden="true" />
              </span>
              Ohlédnutí za akcí a další proběhlé akce →
            </Link>
          </p>

          {/* ============ CTA ============ */}
          <div className="reveal relative isolate mt-12 overflow-hidden rounded-[2rem] bg-forest-deep text-white shadow-lift sm:mt-16">
            <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
            <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-orange/25 blur-3xl" />
            <div className="grid grid-cols-1 items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.4fr_1fr] lg:p-14">
              <div>
                <h2 className="text-[1.9rem] leading-[1.08] sm:text-4xl font-extrabold">
                  Chcete, aby u nás bylo i vaše dítě?
                </h2>
                <p className="mt-4 text-white/75 leading-relaxed max-w-xl">
                  Klubík funguje v pondělí, úterý a ve středu. Přijďte se k nám nejdřív
                  podívat — prohlídky domlouváme individuálně.
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
              {/* dvojice polaroidů — jen dekorace */}
              <div aria-hidden="true" className="relative mx-auto hidden h-64 w-72 sm:block">
                <div className="polaroid absolute left-0 top-2 w-44 -rotate-6">
                  <Image src="/images/klubik/klubik-30.jpg" alt="" width={352} height={352} className="aspect-square w-full rounded object-cover" />
                </div>
                <div className="polaroid float-slow absolute bottom-0 right-0 w-44 rotate-[5deg]">
                  <Image src="/images/klubik/klubik-43.jpg" alt="" width={352} height={352} className="aspect-square w-full rounded object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
