import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Blocks,
  CalendarDays,
  Camera,
  DraftingCompass,
  Footprints,
  Leaf,
  Sprout,
  Tractor,
  TreePine,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hory from "@/components/design/Hory";
import SnapRadek from "@/components/design/SnapRadek";
import Maskot from "@/components/maskot/Maskot";

export const metadata: Metadata = {
  title: "Ze života klubíku: září 2026 | Klub dětí Fořt",
  description:
    "Co zažily děti v klubu pro děti na individuálním vzdělávání (domškoláky) na BIO farmě Fořt v září 2026: houby a měření v lese, klíčení semínek, kružnice, divadlo a farma.",
  alternates: { canonical: "https://klubdetifort.cz/ze-zivota-klubiku" },
  openGraph: {
    title: "Ze života klubíku — Klub dětí Fořt",
    description:
      "První měsíc klubu pro domškoláky na BIO farmě Fořt: houby, kořínky a kružnice.",
    type: "article",
    locale: "cs_CZ",
    images: [{ url: "/images/ze-zivota/2026-09/bedla-a-klacik.jpg", width: 900, height: 1125 }],
  },
};

/** `sirka`/`vyska` = poměr stran fotky, když není na výšku 4 : 5 */
type Fotka = { src: string; alt: string; sirka?: number; vyska?: number };

const D = "/images/ze-zivota/2026-09";

/** Natočení polaroidů — ať skupina působí jako fotky vlepené do deníku. */
const NATOCENI = [
  "sm:-rotate-2",
  "sm:rotate-[1.5deg] sm:translate-y-5",
  "sm:-rotate-1 sm:-translate-y-1",
  "sm:rotate-2 sm:translate-y-4",
];

/**
 * Fotky k jedné části článku. Fotky jsou vybrané tak, aby nebyly vidět
 * tváře dětí. Na telefonu posuvný řádek polaroidů, od 640 px „rozbitá"
 * mřížka, která přesahuje sloupec textu.
 */
function Fotky({ fotky }: { fotky: Fotka[] }) {
  const siroka = fotky.findIndex((f) => (f.sirka ?? 4) > (f.vyska ?? 5));
  const cols =
    fotky.length === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : fotky.length === 2
        ? "sm:grid-cols-2"
        : siroka >= 0
          ? "sm:grid-cols-2 lg:grid-cols-4"
          : "sm:grid-cols-3";
  const presah = fotky.length === 2 ? "sm:mx-auto sm:max-w-xl" : "lg:-mx-28";
  return (
    <div className={`mt-8! mb-2! sm:mt-12! sm:mb-6! ${presah}`}>
      <SnapRadek className={`items-start pt-3 sm:pt-0 sm:gap-6 ${cols}`}>
        {fotky.map((f, i) => (
          <div
            key={f.src}
            className={`polaroid group max-sm:basis-[72%] transition duration-500 sm:hover:rotate-0 sm:hover:scale-[1.03] ${
              NATOCENI[i % NATOCENI.length]
            } ${i === siroka ? "sm:col-span-2" : ""}`}
          >
            <div
              className="overflow-hidden rounded-[0.35rem] bg-beige"
              style={{ aspectRatio: `${f.sirka ?? 4} / ${f.vyska ?? 5}` }}
            >
              <Image
                src={f.src}
                alt={f.alt}
                width={600}
                height={Math.round((600 * (f.vyska ?? 5)) / (f.sirka ?? 4))}
                sizes={i === siroka ? "(min-width: 640px) 60vw, 85vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 40vw, 85vw"}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </SnapRadek>
    </div>
  );
}

/** Dekorativní předěl mezi částmi článku (lístky a slunce). */
function Predel() {
  return (
    <div aria-hidden="true" className="mb-12 flex items-center justify-center gap-3 text-moss sm:mb-16">
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-moss/70 sm:w-28" />
      <Leaf className="h-4 w-4 -rotate-45" aria-hidden="true" />
      <span className="h-2 w-2 rounded-full bg-orange" />
      <Leaf className="h-4 w-4 rotate-[135deg]" aria-hidden="true" />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-moss/70 sm:w-28" />
    </div>
  );
}

function Cast({
  nadpis,
  ikona: Ikona,
  prvni = false,
  children,
}: {
  nadpis: string;
  ikona: LucideIcon;
  prvni?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="reveal">
      {!prvni && <Predel />}
      <div className="flex items-center gap-3.5">
        <span aria-hidden="true" className="icon-bubble h-11 w-11 rounded-2xl bg-forest-pale text-forest sm:h-12 sm:w-12">
          <Ikona className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
        </span>
        <h3 className="text-[1.6rem] leading-[1.1] sm:text-[2rem] font-extrabold text-dark">{nadpis}</h3>
      </div>
      <div className="mt-5 space-y-5 text-[1.0625rem] leading-[1.75] text-dark/85 sm:text-lg sm:leading-[1.8]">
        {children}
      </div>
    </section>
  );
}

export default function ZeZivotaKlubikuPage() {
  return (
    <>
      <Header />

      <main className="flex-1 bg-cream">
        {/* ============ HLAVIČKA ============ */}
        <header className="relative overflow-hidden bg-forest-deep text-white">
          <div aria-hidden="true" className="dot-grid absolute inset-0" />
          <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
          <TreePine aria-hidden="true" className="sway pointer-events-none absolute -right-4 bottom-14 h-40 w-40 text-white/[0.06] sm:right-[8%] sm:h-64 sm:w-64" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-28">
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/20 transition"
            >
              ← Zpět na hlavní stránku
            </Link>
            <p className="hero-in eyebrow flex w-fit text-orange mt-10 sm:mt-12">
              Deník klubíku
            </p>
            <h1 className="hero-in [animation-delay:120ms] mt-4 text-[2.75rem] leading-[1.02] sm:text-7xl font-extrabold">
              Ze života <span className="text-orange">klubíku</span>
            </h1>
            <p className="hero-in [animation-delay:240ms] mt-6 max-w-2xl text-lg sm:text-xl text-white/80 leading-relaxed">
              Klubík na BIO farmě Fořt je klub pro děti na individuálním
              vzdělávání (domškoláky), od předškoláků do 5.&nbsp;třídy.
              Scházíme se v&nbsp;pondělí, v&nbsp;úterý a ve středu od 8 do 16
              hodin. Tady sepisujeme, co děti opravdu zažily, podle zápisů
              našich průvodkyň.
            </p>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-cream" />
          </div>
        </header>

        <div className="relative grain">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
            {/* ============ ZÁŘÍ 2026 ============ */}
            <article className="mx-auto max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-soft">
                  <CalendarDays className="h-3.5 w-3.5 text-orange" aria-hidden="true" />
                  Září 2026
                </span>
                <span className="text-sm font-medium text-brown-light">první měsíc klubíku</span>
              </div>

              <h2 className="mt-5 text-[2.35rem] leading-[1.04] sm:text-6xl font-extrabold text-dark">
                Houby, kořínky a <span className="squiggle text-forest">kružnice</span>
              </h2>

              {/* obálka — tři polaroidy z článku, jen dekorace */}
              <div aria-hidden="true" className="relative mt-10 flex justify-center sm:mt-12">
                <div className="polaroid w-[34%] max-w-44 -rotate-6 translate-y-3">
                  <Image src={`${D}/naklicena-seminka.jpg`} alt="" width={352} height={440} className="aspect-[4/5] w-full rounded object-cover" />
                </div>
                <div className="polaroid relative z-10 -mx-3 w-[38%] max-w-48 rotate-2">
                  <Image src={`${D}/bedla-a-klacik.jpg`} alt="" width={384} height={480} className="aspect-[4/5] w-full rounded object-cover" />
                </div>
                <div className="polaroid w-[34%] max-w-44 rotate-[7deg] translate-y-4">
                  <Image src={`${D}/kloboucky-hub.jpg`} alt="" width={352} height={440} className="aspect-[4/5] w-full rounded object-cover" />
                </div>
                <Sprout className="float-slow absolute -top-5 left-[6%] h-9 w-9 text-moss sm:left-[12%]" aria-hidden="true" />
              </div>

              <div className="mt-16 space-y-14 sm:mt-20 sm:space-y-16">
                <Cast nadpis="První dny" ikona={Footprints} prvni>
                  <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1.5 first-letter:font-display first-letter:text-[4.4rem] first-letter:font-extrabold first-letter:leading-[0.78] first-letter:text-forest sm:first-letter:text-[5rem]">
                    Hned první den jsme vyrazili zkoumat okolí a objevem dne byl
                    slimák největší. Děti si ještě ten den hrály na obchůdek
                    a vystavovaly vlastní faktury. Druhý den je zaujalo kružítko,
                    poznávaly stromy na zahradě a na kmeni jednoho z&nbsp;nich jsme
                    našli sírovec žlutooranžový. Druhý týden jsme si nad mapou
                    Evropy a světa povídali o tom, kde kdo byl o prázdninách,
                    a vyrazili na procházku k&nbsp;potůčku.
                  </p>
                </Cast>

                <Cast nadpis="Semínka a kořínky" ikona={Sprout}>
                  <p>
                    Na začátku září si děti ustřihly odnož rymovníku, daly ji do
                    vody a tipovaly, kdy pustí kořínky. Po týdnu měla jedna
                    rostlinka kořínek dlouhý 1,5&nbsp;cm, a tak jsme se potkali
                    s&nbsp;centimetrem a milimetrem.
                  </p>
                  <p>
                    Pak přišla semínka: čtyři druhy jsme zasadili do vlhké vaty
                    i do hlíny. Pod vatou se nejlépe dařilo hrachu, v&nbsp;hlíně
                    čočce. Klíčky jsme měřili i ochutnali, povídali si, co rostlina
                    potřebuje k&nbsp;růstu, a na hlínu jsme položili bramboru,
                    jestli z&nbsp;očka vyroste výhonek.
                  </p>
                  <Fotky
                    fotky={[
                      { src: `${D}/rostlina-na-parapetu.jpg`, alt: "Rostlina v květináči na parapetu" },
                      { src: `${D}/naklicena-seminka.jpg`, alt: "Naklíčená semínka hrachu" },
                      { src: `${D}/tabule-co-rostlina-potrebuje.jpg`, alt: "Tabule: rozmnožování rostlin hlízami a co rostlina potřebuje" },
                    ]}
                  />
                </Cast>

                <Cast nadpis="Houby jako velké téma" ikona={TreePine}>
                  <p>
                    V&nbsp;polovině září začal náš houbový projekt. Nejdřív trocha
                    teorie: podhoubí, tělo houby, výtrusy a to, že každá houba
                    roste u nějakého stromu. V&nbsp;lese jsme pak potkali kozáka
                    březového u břízy, hřib smrkový u smrku i klouzka u modřínu
                    a podhoubí si prohlédli kapesním mikroskopem.
                  </p>
                  <p>
                    U vybraných hub si děti označily výšku a do tabulky zapisujeme,
                    o kolik vyrostly. Kreslili jsme tělo houby s&nbsp;popisky,
                    listovali atlasem hub a každý si vymyslel vlastní houbu, třeba
                    Mráčko Pink, která vás pošle cestovat v&nbsp;čase. Při jedné
                    z&nbsp;kontrol přišel nápad na nový pokus: shodí rostoucí bedla
                    klacík?
                  </p>
                  <Fotky
                    fotky={[
                      { src: `${D}/tabule-telo-houby.jpg`, alt: "Nákres těla houby na tabuli s tabulkou pro měření růstu", sirka: 780, vyska: 412 },
                      { src: `${D}/bedla-a-klacik.jpg`, alt: "Bedla v lese pod položeným klacíkem" },
                      { src: `${D}/mracko-pink.jpg`, alt: "Dětský příběh o vymyšlené houbě Mráčko Pink" },
                    ]}
                  />
                </Cast>

                <Cast nadpis="Matematika u tabule i na trávě" ikona={DraftingCompass}>
                  <p>
                    K&nbsp;houbám patří i měření. Děti si navzájem zadávaly
                    předměty, které měl někdo jiný najít, změřit a zapsat, a tipovaly
                    délky, které jsme pak porovnali se skutečností.
                  </p>
                  <p>
                    Pak přišlo na řadu kružítko: tři kružnice se třemi různými
                    poloměry, vystřihnout, slepit do tvaru kloboučku a vybarvit,
                    někdo podle skutečné houby z&nbsp;atlasu, někdo po svém. U tabule pak každý
                    nakreslil kruh, označil střed a zapsal poloměr. Venku jsme si
                    udělali kružítko z&nbsp;klacků a z&nbsp;kruhu bylo hned hřiště
                    pro hru na policajta a zloděje šišek.
                  </p>
                  <Fotky
                    fotky={[
                      { src: `${D}/tabule-polomer.jpg`, alt: "Dítě zezadu u tabule zapisuje poloměr kružnice" },
                      { src: `${D}/kloboucky-hub.jpg`, alt: "Barevné papírové kloboučky hub" },
                    ]}
                  />
                </Cast>

                <Cast nadpis="Návody, lego a divadlo" ikona={Blocks}>
                  <p>
                    Jedno ráno jsme podle návodu složili židli. Pak děti postavily
                    z&nbsp;lega malé projekty a napsaly k&nbsp;nim vlastní návody na
                    sestavení. V&nbsp;polovině září vzniklo spontánní divadlo: děti
                    samy postavily kulisy, srovnaly židle pro diváky, přidaly
                    hudební nástroje, nachystaly občerstvení a zahrály představení
                    pro rodiče. A&nbsp;jindy si vymyslely rovnou čtyři divadelní
                    příběhy.
                  </p>
                  <Fotky
                    fotky={[
                      { src: `${D}/lego-a-navod.jpg`, alt: "Stavba z lega a dětský návod na zahradní terasu" },
                      { src: `${D}/cedule-divadlo.jpg`, alt: "Ručně psaná cedule Divadlo" },
                    ]}
                  />
                </Cast>

                <Cast nadpis="Farma kolem nás" ikona={Tractor}>
                  <p>
                    Majitelka farmy nás provedla areálem: pastviny, zázemí pro
                    zvířata, slepice, krávy i koně, a nakoukli jsme i do prostor
                    zámečku. Hodně času trávíme venku, v&nbsp;lese, na zahradě
                    i u potůčku.
                  </p>
                  <p>
                    Obědy nám vaří kuchyně BIO farmy Fořt a u jídla si zkoušíme
                    povídat anglicky (English lunch). Jednou jsme obědvali venku
                    a stolem nám byl velký kmen.
                  </p>
                  <Fotky
                    fotky={[
                      { src: `${D}/kone-a-pes.jpg`, alt: "Kůň ve výběhu a bílý pes, děti zezadu" },
                      { src: `${D}/kravy.jpg`, alt: "Děti zezadu u pastviny s kravami" },
                      { src: `${D}/obed-u-kmene.jpg`, alt: "Oběd na stole z velkého kmene: ratatouille, rýže a salát" },
                      { src: `${D}/les-na-dece.jpg`, alt: "Děti zezadu na dece v lese" },
                    ]}
                  />
                </Cast>
              </div>

              <p className="mt-14 flex items-start gap-3 rounded-2xl bg-white/70 p-4 text-sm leading-relaxed text-brown ring-1 ring-dark/5 sm:mt-16">
                <span aria-hidden="true" className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sun text-brown">
                  <Camera className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="pt-1.5">
                  Fotky vybíráme tak, aby na nich nebyly vidět tváře dětí.
                </span>
              </p>
            </article>

            {/* ============ CO DÁL ============ */}
            <section className="reveal relative isolate mx-auto mt-16 max-w-4xl overflow-hidden rounded-[2rem] bg-forest-deep p-6 text-white shadow-lift sm:mt-24 sm:p-10 lg:p-12">
              <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
              <div aria-hidden="true" className="absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-orange/25 blur-3xl" />
              <div aria-hidden="true" className="absolute -bottom-24 -left-10 -z-10 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
              <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto]">
                <div>
                  <h2 className="text-[1.9rem] leading-[1.08] sm:text-4xl font-extrabold">
                    Chcete, aby u toho bylo i vaše dítě?
                  </h2>
                  <p className="mt-4 max-w-xl text-white/75 leading-relaxed">
                    Klubík je pro děti na individuálním vzdělávání (domškoláky), od
                    předškoláků do 5.&nbsp;třídy, a pár míst ještě máme. Přijďte se
                    k&nbsp;nám nejdřív podívat, prohlídky domlouváme individuálně.
                  </p>
                  <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link
                      href="/prohlidky"
                      className="btn btn-sun btn-shine"
                    >
                      Domluvit prohlídku
                    </Link>
                    <Link
                      href="/#kontakt"
                      className="btn btn-glass"
                    >
                      Chci přihlásit dítě
                    </Link>
                  </div>
                </div>
                <div aria-hidden="true" className="relative mx-auto hidden h-56 w-48 md:block">
                  <div className="polaroid float-slow absolute inset-x-0 top-0 rotate-[5deg]">
                    <Image src={`${D}/les-na-dece.jpg`} alt="" width={384} height={480} className="aspect-[4/5] w-full rounded object-cover" />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      {/* Fořťáček — maskot v pravém dolním rohu */}
      <Maskot />
    </>
  );
}
