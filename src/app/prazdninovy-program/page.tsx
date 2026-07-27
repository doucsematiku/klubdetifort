import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrazdninyForm from "@/components/PrazdninyForm";
import {
  getDayAvailability,
  MAX_KIDS_PER_DAY,
  type PrazdninyDayIso,
} from "@/lib/sheets-prazdniny";

// Live data — kapacita se přepočítá na každém requestu (sheet + offline env).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Letní prázdniny pro děti 14.–17. 7. 2026 | Klub dětí Fořt",
  description:
    "Čtyři dny v přírodě BIO farmy Fořt — Dřevo, Voda, Oheň a Země. Pro děti 6–12 let s průvodkyní Lenkou Formánkovou. 600 Kč/den, max 10 dětí, oběd s sebou.",
  alternates: { canonical: "https://klubdetifort.cz/prazdninovy-program" },
  openGraph: {
    title: "Letní prázdniny pro děti — Klub dětí Fořt (14.–17. 7. 2026)",
    description:
      "Čtyři dny v přírodě s Lenkou Formánkovou. Dřevo, voda, oheň, země. Krkonoše, BIO farma Fořt.",
    type: "website",
    locale: "cs_CZ",
  },
};

const dayCards = [
  {
    iso: "2026-07-14" as PrazdninyDayIso,
    label: "Úterý 14. 7.",
    element: "Dřevo",
    color: "bg-[#8B6F5E]",
    activity: "Výroba balanční tyče",
    detail:
      "Najdeme si tyč, společně ji obrábíme nožíkem, vyvrtáme dírky, protáhneme bavlnku. Pak se s tyčemi vydáme zkoušet různé hry — balanc, hod, štafety.",
  },
  {
    iso: "2026-07-15" as PrazdninyDayIso,
    label: "Středa 15. 7.",
    element: "Voda",
    color: "bg-[#4A7C42]",
    activity: "Malujeme vodou — společná tvorba obrazu",
    detail:
      "Děti namalují černými fixami na dlouhý pruh papíru, pak na něj zavěsíme krepové papíry a vodou je postříkáme — obraz se barevně rozeběhne. K tomu vodní hrátky: stříkačky na terč, obrysy listů, tisk.",
  },
  {
    iso: "2026-07-16" as PrazdninyDayIso,
    label: "Čtvrtek 16. 7.",
    element: "Oheň",
    color: "bg-orange",
    activity: "Hadi na ohni a pečené brambory",
    detail:
      "Každé dítě si podle nakresleného receptu zhněte vlastní těsto na hada a opeče ho nad ohněm. Také si můžeme upéct brambory a jablka se skořicí. Bezpečnost u ohně je samozřejmost.",
  },
  {
    iso: "2026-07-17" as PrazdninyDayIso,
    label: "Pátek 17. 7.",
    element: "Země / Kámen",
    color: "bg-forest",
    activity: "Obrázek z kamínků",
    detail:
      "Na malé plátno (10×10 cm) si děti namalují podklad temperami. Pak si v parku najdou větvičku a dva kamínky — z kamínků uděláme ptáčky, dokreslíme zobáček a nožky. Drobné dílo na památku.",
  },
];

const dayStructure = [
  { time: "9:00 – 10:00", what: "Povídání, seznamování s prostorem, hry" },
  { time: "10:00 – 11:00", what: "Nabídka tvoření (denní téma)" },
  { time: "11:00 – 12:00", what: "Volná hra / procházka do okolí" },
  { time: "12:00 – 12:30", what: "Oběd (rodiče připraví dítěti s sebou)" },
  { time: "12:30 – 13:00", what: "Volná hra, ukončení, vyzvedávání" },
];

const faqItems = [
  {
    q: "Pro jaký věk je program vhodný?",
    a: "Program je vhodný pro děti přibližně 6–12 let. Lenka má dlouholeté zkušenosti s prací s dětmi v širokém věkovém rozpětí — domškoláky vede kroužek Radovánky ve Vrchlabí.",
  },
  {
    q: "Můžu přihlásit dítě jen na vybrané dny?",
    a: "Ano. Ve formuláři si vyberete libovolnou kombinaci 1–4 dnů. Cena je 600 Kč za každý den. Faktura se vystaví na celkovou částku.",
  },
  {
    q: "Co dítě potřebuje s sebou?",
    a: "Hlavně oběd (svačinu a vodu), pohodlné oblečení do přírody, pláštěnku a pokrývku hlavy. Materiál na tvoření má průvodkyně zajištěný.",
  },
  {
    q: "Je v ceně oběd?",
    a: "Ne, oběd není v ceně 600 Kč. Připravte prosím dítěti hlavní jídlo na cca 12:00.",
  },
  {
    q: "Jak je to s úhradou?",
    a: "Po odeslání rezervace vám automaticky pošleme fakturu z Fakturoidu (vystavuje Vzdělávací centrum Doučse z.s.). Splatnost je 7 dní. Místo je rezervované po připsání platby — případně po dohodě e-mailem.",
  },
  {
    q: "Co když bude pršet?",
    a: "Farma má kryté zázemí (společenská místnost, sportovní hala, altán). Program běží za každého počasí. Pršiplášť a náhradní oblečení s sebou.",
  },
  {
    q: "Co když musíme rezervaci zrušit?",
    a: "Při zrušení více než 7 dní před začátkem vrátíme plnou částku. Při zrušení 3–7 dní vracíme 50 %. Při zrušení později nebo neúčasti se cena bohužel nevrací — místo už nelze obsadit.",
  },
];

export default async function PrazdninovyProgramPage() {
  // Live kapacita — sečte webové rezervace (Sheet) + offline (env var).
  const taken = await getDayAvailability();
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative min-h-[80vh] flex items-center pt-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/park.png"
              alt="Park BIO farmy Fořt — staré stromy a louky v Krkonoších"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/60 to-dark/40" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <p className="inline-block bg-orange text-dark font-extrabold text-sm sm:text-base px-4 py-1.5 rounded-full mb-5 tracking-wide">
                LETNÍ PRÁZDNINY · 14.–17. 7. 2026
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Čtyři dny v přírodě
                <br />
                pro <span className="text-orange">tvořivé</span> děti
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-4">
                Dřevo, voda, oheň, země. Čtyři dny, čtyři živly, jedna průvodkyně —
                <strong className="text-white"> Lenka Formánková</strong>, která dlouhodobě
                pracuje s dětmi v Krkonoších.
              </p>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Na BIO farmě Fořt u Vrchlabí. Pro děti přibližně 6–12 let.
                Max 10 dětí na den, abychom si všichni stačili.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#rezervace"
                  className="bg-orange hover:bg-orange-hover text-dark font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-colors text-center text-base sm:text-lg"
                >
                  Rezervovat místo
                </a>
                <a
                  href="#program"
                  className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-colors text-center"
                >
                  Co děti čeká
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ INFO PRUH ============ */}
        <section className="bg-orange py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-dark">600 Kč</p>
                <p className="text-xs sm:text-sm text-dark/80">na dítě a den</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-dark whitespace-nowrap">9–13 h</p>
                <p className="text-xs sm:text-sm text-dark/80">čtyři hodiny denně</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-dark">max 10</p>
                <p className="text-xs sm:text-sm text-dark/80">dětí na den</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-dark whitespace-nowrap">6–12 let</p>
                <p className="text-xs sm:text-sm text-dark/80">doporučený věk</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ O LENCE ============ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 sm:h-[460px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/park3.png"
                  alt="Ohnišťě v parku farmy Fořt — místo společných setkání"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                  Průvodkyně programu
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                  Lenka Formánková
                </h2>
                <p className="text-lg text-brown leading-relaxed mb-4">
                  Lenka dlouhodobě pracuje s dětmi v okolí Vrchlabí — vede například
                  kroužek <strong>Radovánky</strong> a má bohaté zkušenosti
                  s&nbsp;domškoláky i dětmi v běžné docházce.
                </p>
                <p className="text-lg text-brown leading-relaxed mb-4">
                  Její přístup je klidný, respektující a inspirovaný přírodou. Děti
                  vede k tvořivosti, samostatnosti a vnímání světa kolem sebe.
                  Učí je pracovat s materiálem — dřevem, vodou, ohněm i kamenem —
                  s úctou a beze spěchu.
                </p>
                <p className="text-base text-brown-light leading-relaxed mb-5">
                  Program je inspirovaný čtyřmi živly a klidným rytmem dne.
                  Není to tábor s pevně daným plánem — je to prostor pro hru,
                  tvoření a objevování.
                </p>
                <a
                  href="https://www.detivpoho.cz/kontakt2/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-forest font-semibold hover:underline"
                >
                  Více o Lence na detivpoho.cz
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ ČTYŘI DNY ============ */}
        <section id="program" className="py-20 sm:py-24 bg-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                Co děti čeká
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                Čtyři dny, čtyři živly
              </h2>
              <p className="text-lg text-brown leading-relaxed">
                Každý den má svoje téma — inspiraci, podle které tvoříme.
                Přihlásit se dá na jednotlivé dny, nebo na celý čtyřdenní turnus.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dayCards.map((day) => {
                const used = taken[day.iso] ?? 0;
                const free = Math.max(0, MAX_KIDS_PER_DAY - used);
                const soldOut = free === 0;
                return (
                  <div
                    key={day.label}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className={`${day.color} px-6 py-5`}>
                      <p className="text-white/80 text-sm font-medium">{day.label}</p>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                        Inspirace: {day.element}
                      </h3>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <p className="font-bold text-dark mb-2">{day.activity}</p>
                      <p className="text-brown leading-relaxed text-sm mb-5">{day.detail}</p>

                      {/* Kapacita */}
                      <div className="mt-auto pt-3 border-t border-beige-dark text-sm">
                        {soldOut ? (
                          <span className="text-red-600 font-semibold">
                            Plně obsazeno
                          </span>
                        ) : free <= 2 ? (
                          <span className="text-red-600 font-semibold">
                            🔥 {free === 1 ? "Poslední volné místo!" : `Poslední ${free} volná místa!`}
                          </span>
                        ) : free <= 5 ? (
                          <span className="text-orange-hover font-semibold">
                            Volných míst: {free} / {MAX_KIDS_PER_DAY}
                          </span>
                        ) : (
                          <span className="text-forest font-medium">
                            Volných míst: {free} / {MAX_KIDS_PER_DAY}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ STRUKTURA DNE ============ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                Rytmus dne
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Jak vypadá den
              </h2>
              <p className="text-lg text-brown">
                Struktura je orientační — necháváme prostor pro to, co děti přinesou.
              </p>
            </div>

            <div className="space-y-3">
              {dayStructure.map((row) => (
                <div
                  key={row.time}
                  className="flex items-center gap-6 p-5 bg-forest-pale rounded-xl"
                >
                  <p className="text-forest font-bold text-base sm:text-lg whitespace-nowrap min-w-[120px] sm:min-w-[140px]">
                    {row.time}
                  </p>
                  <p className="text-brown">{row.what}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRAKTICKÉ INFO ============ */}
        <section className="py-20 sm:py-24 bg-forest-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                  Praktické informace
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                  Co je potřeba vědět
                </h2>

                <div className="space-y-5">
                  <div>
                    <h3 className="font-bold text-dark mb-1">Cena</h3>
                    <p className="text-brown leading-relaxed">
                      <strong>600 Kč za dítě a den</strong>{" "}— fakturujeme přes
                      Vzdělávací centrum Doučse z.s. Faktura přijde automaticky
                      po odeslání rezervace, splatnost 7 dní.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-dark mb-1">Oběd s sebou</h3>
                    <p className="text-brown leading-relaxed">
                      Oběd <strong>není v ceně</strong>{" "}— připravte prosím dítěti
                      hlavní jídlo na cca 12:00. K tomu lahev vody a svačinu.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-dark mb-1">Kapacita</h3>
                    <p className="text-brown leading-relaxed">
                      Max <strong>10 dětí na den</strong>. Když je den plný,
                      formulář to ukáže a nedovolí se přihlásit.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-dark mb-1">Co s sebou</h3>
                    <p className="text-brown leading-relaxed">
                      Pohodlné oblečení do přírody, pláštěnka, pokrývka
                      hlavy, krém na opalování, náhradní triko. Materiál na tvoření
                      máme my.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-dark mb-1">Místo konání</h3>
                    <p className="text-brown leading-relaxed">
                      BIO farma Fořt — <strong>Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí</strong>.
                      Park, společenská místnost, kryté zázemí pro tvoření.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-beige-dark">
                <iframe
                  src="https://frame.mapy.cz/?x=15.6928&y=50.5972&z=14&l=0&m=firm&p=50.5972%2C15.6928"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="h-[360px] sm:h-[460px]"
                  title="Mapa — BIO farma Fořt, Černý Důl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="py-20 sm:py-24 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-12 text-center">
              Časté otázky
            </h2>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group bg-beige rounded-2xl p-5 sm:p-6 cursor-pointer"
                >
                  <summary className="font-bold text-dark list-none flex justify-between items-center gap-4">
                    <span>{item.q}</span>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-lg group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="text-brown leading-relaxed mt-3 text-sm sm:text-base">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============ REZERVACE / FORMULÁŘ ============ */}
        <section id="rezervace" className="py-20 sm:py-24 bg-beige">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                Rezervace místa
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Přihlaste své dítě
              </h2>
              <p className="text-lg text-brown max-w-2xl mx-auto">
                Vyberte dny, vyplňte krátký formulář a my vám obratem pošleme
                potvrzení rezervace a fakturu k úhradě.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
              <PrazdninyForm />
            </div>

            <p className="text-center text-sm text-brown-light mt-8 max-w-xl mx-auto">
              Máte otázky před přihlášením? Ozvěte se nám na{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-forest font-semibold hover:underline"
              >
                reditel@doucse.cz
              </a>{" "}
              nebo na{" "}
              <a
                href="tel:+420775917363"
                className="text-forest font-semibold hover:underline"
              >
                775 917 363
              </a>
              . Rádi vám poradíme.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
