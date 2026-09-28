import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, MapPin, Phone, Sprout, Users } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProhlidkyForm from "@/components/ProhlidkyForm";
import Hory from "@/components/design/Hory";

export const metadata: Metadata = {
  title: "Domluvte si prohlídku areálu | Klub dětí Farma Fořt",
  description:
    "Domluvte si individuální prohlídku areálu Vzdělávacího klubu Farma Fořt. Navrhněte nám termíny, které vám vyhovují, a my se ozveme s konkrétním časem.",
  alternates: {
    canonical: "https://klubdetifort.cz/prohlidky",
  },
  openGraph: {
    title: "Domluvte si prohlídku areálu | Klub dětí Farma Fořt",
    description:
      "Individuální prohlídky areálu Klubu dětí Farma Fořt — navrhněte termín, který vám vyhovuje.",
    url: "https://klubdetifort.cz/prohlidky",
    type: "website",
  },
};

/** Ikona místo odrážky — znak „•" zůstává pro čtečky, oko vidí ikonu. */
function Odrazka({ ikona: Ikona }: { ikona: typeof Users }) {
  return (
    <span className="relative mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-forest-pale text-forest">
      <span className="sr-only">•</span>
      <Ikona aria-hidden="true" className="h-5 w-5" />
    </span>
  );
}

export default function ProhlidkyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-beige">
        {/* ── úvodní pás ── */}
        <section className="relative isolate overflow-hidden bg-forest-deep text-white">
          <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-20 -z-10 h-72 w-72 rounded-full bg-orange/25 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-10 -left-16 -z-10 h-56 w-56 rounded-full bg-moss/25 blur-3xl"
          />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-28">
            <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="max-w-2xl">
                <p className="hero-in eyebrow text-orange mb-4">
                  Individuální prohlídky areálu
                </p>
                <h1 className="hero-in [animation-delay:120ms] text-[2.5rem] leading-[1.05] sm:text-6xl font-extrabold mb-6">
                  Přijďte se podívat na <span className="text-orange squiggle">farmu</span>
                </h1>
                <p className="hero-in [animation-delay:220ms] text-base sm:text-lg text-white/75 leading-relaxed [&_strong]:text-white">
                  Pomalu otevíráme dveře BIO farmy Fořt rodinám, které uvažují,
                  že by jejich děti mohly být součástí našeho klubu. Prohlídky
                  děláme <strong>individuálně</strong>{" "}— napište nám termíny, které
                  by vám vyhovovaly, a&nbsp;my se vám ozveme a&nbsp;domluvíme
                  konkrétní čas. Přijďte klidně i&nbsp;s&nbsp;dětmi.
                </p>
              </div>

              {/* fotka farmy — jen dekorace (na počítači) */}
              <div
                aria-hidden="true"
                className="hero-in [animation-delay:300ms] relative mx-auto hidden aspect-square w-full max-w-[28rem] lg:block"
              >
                <svg
                  viewBox="0 0 200 200"
                  className="spin-slow absolute inset-0 text-white/25"
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="96"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeDasharray="0.1 7"
                  />
                  <circle cx="100" cy="4" r="4.5" fill="#FFB72B" />
                  <circle cx="10" cy="130" r="3" fill="#9CB77F" />
                </svg>
                <div className="absolute right-[4%] top-[6%] h-[30%] w-[30%] rounded-full bg-orange shadow-glow" />
                <div className="blob blob-morph absolute inset-[9%] overflow-hidden shadow-lift ring-[6px] ring-white/90">
                  <Image
                    src="/images/park2.png"
                    alt=""
                    fill
                    sizes="28rem"
                    className="object-cover kenburns"
                  />
                </div>
                <div className="float-slow absolute -bottom-2 left-0 w-[42%]">
                  <div className="polaroid -rotate-[6deg]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[0.35rem]">
                      <Image
                        src="/images/klubik/prostor-park.jpg"
                        alt=""
                        fill
                        sizes="12rem"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
                <span className="icon-bubble absolute right-[2%] bottom-[14%] rotate-[8deg] bg-sun text-brown shadow-soft">
                  <Sprout className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0">
            <Hory className="text-beige" />
          </div>
        </section>

        {/* ── informace + formulář ── */}
        <section className="grain pt-6 pb-24 sm:pt-10 sm:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-10 xl:gap-14">
              {/* Info card */}
              <div className="lg:sticky lg:top-28">
                <div className="card relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
                  <div
                    aria-hidden="true"
                    className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-sun blur-2xl"
                  />
                  <h2 className="relative text-[1.6rem] leading-tight sm:text-[1.85rem] font-extrabold text-dark mb-6">
                    Jak to bude vypadat?
                  </h2>
                  <ul className="relative space-y-5 text-brown text-[0.95rem] leading-relaxed [&_strong]:text-dark">
                    <li className="flex gap-3.5">
                      <Odrazka ikona={Users} />
                      <span>
                        Prohlídku domlouváme <strong>individuálně</strong>. Provedeme vás
                        areálem, ukážeme zázemí a&nbsp;v&nbsp;klidu zodpovíme vaše otázky.
                      </span>
                    </li>
                    <li className="flex gap-3.5">
                      <Odrazka ikona={CalendarDays} />
                      <span>
                        Ve formuláři níže navrhněte <strong>termíny, které vám vyhovují</strong>.
                        Ozveme se vám s&nbsp;konkrétním návrhem.
                      </span>
                    </li>
                    <li className="flex gap-3.5">
                      <Odrazka ikona={Phone} />
                      <span>
                        Máte raději telefon? Zavolejte na{" "}
                        <a
                          href="tel:+420775917363"
                          className="text-forest font-bold underline decoration-forest/30 underline-offset-4 hover:decoration-forest whitespace-nowrap"
                        >
                          775 917 363
                        </a>{" "}
                        nebo napište na{" "}
                        <a
                          href="mailto:reditel@doucse.cz"
                          className="text-forest font-bold underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
                        >
                          reditel@doucse.cz
                        </a>
                        .
                      </span>
                    </li>
                    <li className="flex gap-3.5">
                      <Odrazka ikona={MapPin} />
                      <span>
                        Adresa:{" "}
                        <strong>Fořt 29, 543 44 Černý Důl – Rudník u&nbsp;Vrchlabí</strong>.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* polaroidy z farmy — jen dekorace (na počítači) */}
                <div aria-hidden="true" className="relative mt-8 hidden h-56 lg:block">
                  <div className="polaroid absolute left-2 top-2 w-44 -rotate-[5deg]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem]">
                      <Image
                        src="/images/klubik/klubik-44.jpg"
                        alt=""
                        fill
                        sizes="11rem"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="polaroid absolute right-4 top-10 w-40 rotate-[4deg]">
                    <div className="relative aspect-square overflow-hidden rounded-[0.35rem]">
                      <Image
                        src="/images/klubik/klubik-03.jpg"
                        alt=""
                        fill
                        sizes="10rem"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <ProhlidkyForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
