import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

type Fotka = { src: string; alt: string };

const D = "/images/ze-zivota/2026-09";

/** Mřížka fotek k jedné části článku. Fotky jsou vybrané tak, aby nebyly vidět tváře dětí. */
function Fotky({ fotky }: { fotky: Fotka[] }) {
  const cols =
    fotky.length === 4
      ? "grid-cols-2 sm:grid-cols-4"
      : fotky.length === 2
        ? "grid-cols-2"
        : "grid-cols-2 sm:grid-cols-3";
  return (
    <div className={`mt-5 grid gap-2 sm:gap-3 ${cols}`}>
      {fotky.map((f) => (
        <div key={f.src} className="overflow-hidden rounded-xl bg-beige">
          <Image
            src={f.src}
            alt={f.alt}
            width={600}
            height={750}
            className="h-48 w-full object-cover sm:h-60"
          />
        </div>
      ))}
    </div>
  );
}

function Cast({ nadpis, children }: { nadpis: string; children: ReactNode }) {
  return (
    <section className="border-t border-dark/10 pt-8 first:border-t-0 first:pt-0">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-dark">{nadpis}</h3>
      <div className="mt-3 space-y-4 text-dark/80 leading-relaxed">{children}</div>
    </section>
  );
}

export default function ZeZivotaKlubikuPage() {
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
              Deník klubíku
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
              Ze života klubíku
            </h1>
            <div className="mt-5 h-px w-16 bg-orange" />
            <p className="mt-5 max-w-2xl text-white/70 leading-relaxed text-lg">
              Klubík na BIO farmě Fořt je klub pro děti na individuálním
              vzdělávání (domškoláky), od předškoláků do 5.&nbsp;třídy.
              Scházíme se v&nbsp;pondělí, v&nbsp;úterý a ve středu od 8 do 16
              hodin. Tady sepisujeme, co děti opravdu zažily, podle zápisů
              našich průvodkyň.
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
          {/* ============ ZÁŘÍ 2026 ============ */}
          <article className="rounded-3xl bg-white p-6 sm:p-9 shadow-sm ring-1 ring-dark/5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-forest-pale px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest">
                Září 2026
              </span>
              <span className="text-sm text-dark/50">první měsíc klubíku</span>
            </div>

            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-dark">
              Houby, kořínky a kružnice
            </h2>

            <div className="mt-8 space-y-10">
              <Cast nadpis="První dny">
                <p>
                  Hned první den jsme vyrazili zkoumat okolí a objevem dne byl
                  slimák největší. Děti si ještě ten den hrály na obchůdek
                  a vystavovaly vlastní faktury. Druhý den je zaujalo kružítko,
                  poznávaly stromy na zahradě a na kmeni jednoho z&nbsp;nich jsme
                  našli sírovec žlutooranžový. Druhý týden jsme si nad mapou
                  Evropy a světa povídali o tom, kde kdo byl o prázdninách,
                  a vyrazili na procházku k&nbsp;potůčku.
                </p>
              </Cast>

              <Cast nadpis="Semínka a kořínky">
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

              <Cast nadpis="Houby jako velké téma">
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
                  Mráčko Pink, která vás pošle cestovat v&nbsp;čase. Při kontrole
                  23.&nbsp;září přišel nápad na nový pokus: shodí rostoucí bedla
                  klacík?
                </p>
                <Fotky
                  fotky={[
                    { src: `${D}/tabule-telo-houby.jpg`, alt: "Nákres těla houby na tabuli s tabulkou pro měření růstu" },
                    { src: `${D}/bedla-a-klacik.jpg`, alt: "Bedla v lese pod položeným klacíkem" },
                    { src: `${D}/mracko-pink.jpg`, alt: "Dětský příběh o vymyšlené houbě Mráčko Pink" },
                  ]}
                />
              </Cast>

              <Cast nadpis="Matematika u tabule i na trávě">
                <p>
                  K&nbsp;houbám patří i měření. Děti si navzájem zadávaly
                  předměty, které měl někdo jiný najít, změřit a zapsat, a tipovaly
                  délky, které jsme pak porovnali se skutečností.
                </p>
                <p>
                  Ve středu 23.&nbsp;září přišlo na řadu kružítko: tři kružnice se
                  třemi různými poloměry, vystřihnout, slepit do tvaru kloboučku
                  a vybarvit podle skutečné houby z&nbsp;atlasu. U tabule pak každý
                  nakreslil kruh, označil střed a zapsal poloměr. Venku jsme si
                  udělali kružítko z&nbsp;klacků a z&nbsp;kruhu bylo hned hřiště
                  pro hru na policajta a zloděje šišek.
                </p>
                <Fotky
                  fotky={[
                    { src: `${D}/tabule-polomer.jpg`, alt: "Dítě zezadu u tabule zapisuje poloměr kružnice" },
                    { src: `${D}/kloboucky-hub.jpg`, alt: "Papírové kloboučky hub vybarvené podle atlasu" },
                  ]}
                />
              </Cast>

              <Cast nadpis="Návody, lego a divadlo">
                <p>
                  Jedno ráno jsme podle návodu složili židli. Pak děti postavily
                  z&nbsp;lega malé projekty a napsaly k&nbsp;nim vlastní návody na
                  sestavení. V&nbsp;polovině září vzniklo spontánní divadlo: děti
                  samy postavily kulisy, srovnaly židle pro diváky, přidaly
                  hudební nástroje, nachystaly občerstvení a zahrály představení
                  pro rodiče. A&nbsp;ve středu 23.&nbsp;září si vymyslely rovnou
                  čtyři divadelní příběhy.
                </p>
                <Fotky
                  fotky={[
                    { src: `${D}/lego-a-navod.jpg`, alt: "Stavba z lega a dětský návod na zahradní terasu" },
                    { src: `${D}/cedule-divadlo.jpg`, alt: "Ručně psaná cedule Divadlo" },
                  ]}
                />
              </Cast>

              <Cast nadpis="Farma kolem nás">
                <p>
                  Majitelka farmy nás provedla areálem: pastviny, zázemí pro
                  zvířata, slepice, krávy i koně, a nakoukli jsme i do prostor
                  zámečku. Hodně času trávíme venku, v&nbsp;lese, na zahradě
                  i u potůčku.
                </p>
                <p>
                  Obědy nám vaří kuchyně BIO farmy Fořt a u jídla si zkoušíme
                  povídat anglicky (English lunch). Ve středu 23.&nbsp;září jsme
                  obědvali venku a stolem nám byl velký kmen.
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

            <p className="mt-8 text-sm text-dark/50">
              Fotky vybíráme tak, aby na nich nebyly vidět tváře dětí.
            </p>
          </article>

          {/* ============ CO DÁL ============ */}
          <section className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-dark/5">
            <h2 className="text-xl font-bold text-dark">
              Chcete, aby u toho bylo i vaše dítě?
            </h2>
            <p className="mt-2 text-brown leading-relaxed">
              Klubík je pro děti na individuálním vzdělávání (domškoláky), od
              předškoláků do 5.&nbsp;třídy, a pár míst ještě máme. Přijďte se
              k&nbsp;nám nejdřív podívat, prohlídky domlouváme individuálně.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/prohlidky"
                className="inline-block rounded-full bg-orange hover:bg-orange-hover px-6 py-3 font-bold text-dark transition-colors"
              >
                Domluvit prohlídku
              </Link>
              <Link
                href="/#kontakt"
                className="inline-block rounded-full border border-dark/15 px-6 py-3 font-semibold text-dark hover:border-dark/40 transition-colors"
              >
                Chci přihlásit dítě
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
