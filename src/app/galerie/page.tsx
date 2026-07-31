import type { Metadata } from "next";
import Link from "next/link";
import Galerie from "@/components/Galerie";

export const metadata: Metadata = {
  title: "Galerie — letní akce pro děti | Klub Fořt",
  description:
    "Fotky z letní akce pro děti na BIO farmě Fořt — tvoření, výlety, potok a společné dny v přírodě.",
};

/** Vybrané fotky z letní akce. Ostatní necháváme stranou kvůli soukromí dětí. */
const FOTKY = [
  { src: "/images/klubik/klubik-01.jpg", alt: "Děti si hrají s barevnými šátky na louce" },
  { src: "/images/klubik/klubik-02.jpg", alt: "Děti na kamenném stole v parku farmy" },
  { src: "/images/klubik/klubik-05.jpg", alt: "Společné posezení ve svahu pod stromy" },
  { src: "/images/klubik/klubik-07.jpg", alt: "Tvoření z barevných papírů u dřevěného stolu" },
  { src: "/images/klubik/klubik-12.jpg", alt: "Děti vybírají materiál na společné dílo" },
  { src: "/images/klubik/klubik-13.jpg", alt: "Kvítek na stole mezi pomůckami na tvoření" },
  { src: "/images/klubik/klubik-18.jpg", alt: "Malovaná plachta s barevnými stuhami" },
  { src: "/images/klubik/klubik-21.jpg", alt: "Hotové společné dílo rozložené na trávě" },
  { src: "/images/klubik/klubik-22.jpg", alt: "Lapač z přírodních materiálů proti krajině" },
  { src: "/images/klubik/klubik-23.jpg", alt: "Ozdoba z drátu a kamínků zavěšená na sloupu" },
  { src: "/images/klubik/klubik-27.jpg", alt: "Krájení jablek na společnou svačinu" },
  { src: "/images/klubik/klubik-30.jpg", alt: "Připravená jablka na pečení v ohni" },
  { src: "/images/klubik/klubik-31.jpg", alt: "Hadovka z těsta opékaná nad ohněm" },
  { src: "/images/klubik/klubik-33.jpg", alt: "Barevné šátky rozložené na louce" },
  { src: "/images/klubik/klubik-42.jpg", alt: "Cesta na výlet mezi loukami" },
  { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi" },
  { src: "/images/klubik/klubik-45.jpg", alt: "Polní cesta lemovaná stromy" },
  { src: "/images/klubik/klubik-47.jpg", alt: "Brouzdání v potoce" },
  { src: "/images/klubik/klubik-48.jpg", alt: "Zkoumání potoka a jeho okolí" },
  { src: "/images/klubik/klubik-50.jpg", alt: "Děti u vody v lese" },
  { src: "/images/klubik/klubik-51.jpg", alt: "Společné zkoumání nálezu na dece" },
  { src: "/images/klubik/klubik-57.jpg", alt: "Obrázek z kamínků a barev — mořský svět" },
  { src: "/images/klubik/klubik-58.jpg", alt: "Dětské dílo s kameny a kresbou" },
  { src: "/images/klubik/klubik-63.jpg", alt: "Malovaný obraz s rybami a kamínky" },
];

export default function GaleriePage() {
  return (
    <main className="min-h-screen bg-beige">
      <header className="bg-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
            Léto 2026 na farmě Fořt
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Fotky z letní akce pro děti
          </h1>
          <div className="mt-5 h-px w-16 bg-orange" />
          <p className="mt-5 max-w-2xl text-white/70 leading-relaxed text-lg">
            V červenci jsme na farmě uspořádali několik dní pro děti — otevřených
            všem, nejen těm z klubíku. Tvořilo se z toho, co bylo po ruce, chodilo
            se k potoku a do krajiny a vařilo se na ohni. Takhle to u nás vypadá.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <Galerie fotky={FOTKY} />

        <p className="mt-8 text-sm text-dark/50 leading-relaxed max-w-2xl">
          Zveřejňujeme jen fotky, na kterých nejsou děti poznat, a jen se
          souhlasem rodičů. Pokud byste si přesto přáli některou fotku stáhnout,
          napište nám na reditel@doucse.cz a hned to uděláme.
        </p>

        <div className="mt-10 rounded-2xl bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-dark">
            Chcete, aby u nás bylo i vaše dítě?
          </h2>
          <p className="mt-2 text-brown leading-relaxed">
            Klubík funguje v pondělí, úterý a ve středu. Přijďte se k nám nejdřív
            podívat — prohlídky domlouváme individuálně.
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
        </div>
      </div>
    </main>
  );
}
