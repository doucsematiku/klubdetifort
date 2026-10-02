import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  DoorOpen,
  Flame,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Mail,
  MapPin,
  Moon,
  Palette,
  Phone,
  Plus,
  Salad,
  Smile,
  Sparkles,
  Sprout,
  Sunrise,
  Trees,
  User,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import CooperationSection from "@/components/CooperationSection";
import ProstorKarta from "@/components/ProstorKarta";
import Hory from "@/components/design/Hory";
import StickyCta from "@/components/design/StickyCta";
import SnapRadek from "@/components/design/SnapRadek";
import FotoPas from "@/components/design/FotoPas";
import Maskot from "@/components/maskot/Maskot";
import { PRESPAVKY_AKTIVNI } from "@/lib/prespavky";

/** Hodnoty klubu — každá karta má vlastní ikonu a barvu (bento). */
const HODNOTY: { title: string; text: string; ikona: LucideIcon; styl: string; bublina: string; nadpis: string; popis: string }[] = [
  {
    title: "Dětství jako prožitek",
    text: "Štěstí není výkon. Dítě u nás má prostor pro hru, ticho i bezpečí — je přijímáno takové, jaké je.",
    ikona: Smile,
    styl: "bg-white",
    bublina: "bg-sun text-brown",
    nadpis: "text-forest",
    popis: "text-brown",
  },
  {
    title: "Respekt k rytmu",
    text: "Vnímáme přírodní cykly a biorytmy dětí. Každý potřebuje jiný čas na růst, na hru i na objevování.",
    ikona: Sunrise,
    styl: "bg-forest text-white",
    bublina: "bg-white/10 text-orange",
    nadpis: "text-white",
    popis: "text-white/80",
  },
  {
    title: "Péče o živé",
    text: "Prostředí farmy nás učí úctě k půdě, zvířatům i jídlu, které nás sytí.",
    ikona: Sprout,
    styl: "bg-sun",
    bublina: "bg-white text-forest",
    nadpis: "text-forest",
    popis: "text-brown",
  },
  {
    title: "Radost z poznání",
    text: "Podporujeme přirozenou zvídavost. Kvalitní materiály, které dětem dávají smysl a baví je.",
    ikona: Lightbulb,
    styl: "bg-forest-pale",
    bublina: "bg-white text-forest",
    nadpis: "text-forest",
    popis: "text-brown",
  },
  {
    title: "Srdce na pravém místě",
    text: "Vedeme děti k laskavosti, empatii a morálním hodnotám skrze každodenní společné prožitky.",
    ikona: HeartHandshake,
    styl: "bg-white",
    bublina: "bg-forest-pale text-forest",
    nadpis: "text-forest",
    popis: "text-brown",
  },
  {
    title: "Komunita a rodina",
    text: "Nejsme instituce. Jsme skupinka lidí, které spojuje touha objevovat a růst — děti i dospělí, každý svým tempem.",
    ikona: Users,
    styl: "bg-forest-deep text-white",
    bublina: "bg-orange text-dark",
    nadpis: "text-white",
    popis: "text-white/80",
  },
];

const JAK_TRAVIME: { title: string; text: React.ReactNode; ikona: LucideIcon }[] = [
  {
    title: "Život v přírodě",
    text: (
      <>
        Děti jsou v prostředí živé BIO farmy. Po domluvě s&nbsp;majiteli
        farmy se mohou občas připojit k&nbsp;jejímu dění — třeba
        pozorovat zvířata nebo růst plodin. Hlavní náplní programu je
        však klidná hra, tvoření a&nbsp;pobyt v&nbsp;přírodě.
      </>
    ),
    ikona: Trees,
  },
  {
    title: "Kvalitní strava",
    text: (
      <>
        Děti mají možnost obědvat plnohodnotnou bio stravu přímo
        z produkce farmy. Společný oběd v Demeter kvalitě je pro nás
        rituálem a zdravým palivem pro tělo i mysl.
      </>
    ),
    ikona: Salad,
  },
  {
    title: "Tvoření a ticho",
    text: (
      <>
        Čas na odpočinek, četbu, výtvarnou tvorbu, pohyb v hale
        nebo jen tiché bytí v přírodě. Bez spěchu, bez tlaku.
      </>
    ),
    ikona: Palette,
  },
];

const AKTIVITY: { title: string; text: string; ikona: LucideIcon; bublina: string }[] = [
  {
    title: "Výlety a expedice",
    text: "Poznávání okolní krajiny, orientace v terénu a úcta k regionu.",
    ikona: Compass,
    bublina: "bg-forest-pale text-forest",
  },
  {
    title: "Plavání a lyže",
    text: "Pravidelný plavecký výcvik a zimní kurzy v krkonošských střediscích.",
    ikona: Waves,
    bublina: "bg-sun text-brown",
  },
  {
    title: "Sezónní slavnosti",
    text: "Dožínky, slunovraty, masopust — slavíme rytmy roku společně s rodinami.",
    ikona: Sparkles,
    bublina: "bg-orange/20 text-brown",
  },
  {
    title: "Sport a pohyb",
    text: "Bruslení, atletika, cyklistika — podle zájmu a sezóny, v malé skupince.",
    ikona: Bike,
    bublina: "bg-forest text-white",
  },
];

/** Fotky do běžícího pásu — jen snímky, které už na webu jsou. */
const PAS_FOTEK = [
  "/images/klubik/klubik-18.jpg",
  "/images/klubik/klubik-43.jpg",
  "/images/klubik/klubik-12.jpg",
  "/images/klubik/klubik-31.jpg",
  "/images/klubik/klubik-57.jpg",
  "/images/klubik/klubik-47.jpg",
  "/images/klubik/klubik-30.jpg",
  "/images/klubik/klubik-33.jpg",
  "/images/klubik/klubik-38.jpg",
  "/images/klubik/klubik-22.jpg",
  "/images/klubik/klubik-07.jpg",
  "/images/klubik/klubik-60.jpg",
];

/** Zaškrtávací odrážka — ikona v kolečku místo tečky. */
function Odrazka({ children, tmava = false }: { children: React.ReactNode; tmava?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
          tmava ? "bg-orange text-dark" : "bg-forest text-white"
        }`}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
      <span className="text-brown leading-relaxed">{children}</span>
    </li>
  );
}

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative isolate min-h-[100svh] flex items-end lg:items-center overflow-hidden bg-forest-deep">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
              src="/images/park2.png"
              alt="Hlavní budova BIO farmy Fořt v parku"
              fill
              sizes="100vw"
              className="object-cover kenburns"
              priority
            />
            {/* na telefonu tmavne fotka odspodu (text je dole), na počítači zleva */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-forest-deep/70 to-dark/10 lg:bg-gradient-to-r lg:from-dark/80 lg:via-dark/50 lg:to-dark/5" />
            <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-dark/40 to-transparent" />
          </div>

          {/* sluneční záře */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-24 -z-10 h-80 w-80 rounded-full bg-orange/30 blur-3xl lg:right-10 lg:top-32 lg:h-[28rem] lg:w-[28rem]"
          />

          {/* polaroidy na velké obrazovce — jen dekorace */}
          <div aria-hidden="true" className="pointer-events-none absolute right-[4%] top-1/2 hidden h-[36rem] w-[30rem] -translate-y-[44%] xl:block">
            <div className="polaroid float-slow absolute right-6 top-0 w-64 [--r:6deg] rotate-6">
              <Image src="/images/klubik/klubik-43.jpg" alt="" width={512} height={512} className="aspect-square w-full rounded object-cover" />
            </div>
            <div className="polaroid float-slow absolute left-0 top-40 w-56 [--r:-7deg] -rotate-[7deg] [animation-delay:1.5s]">
              <Image src="/images/klubik/klubik-12.jpg" alt="" width={448} height={448} className="aspect-square w-full rounded object-cover" />
            </div>
            <div className="polaroid float-slow absolute right-16 top-[22rem] w-48 [--r:3deg] rotate-3 [animation-delay:3s]">
              <Image src="/images/klubik/klubik-30.jpg" alt="" width={384} height={384} className="aspect-square w-full rounded object-cover" />
            </div>
          </div>

          <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 sm:pb-32 lg:py-40">
            <div className="max-w-2xl">
              <p className="hero-in inline-flex items-center gap-2.5 rounded-full bg-white/10 px-3.5 py-1.5 text-orange font-bold text-[0.7rem] sm:text-sm tracking-[0.12em] uppercase mb-5 ring-1 ring-white/20 backdrop-blur-md">
                <span className="live-dot" aria-hidden="true" />
                Školní rok 2026/27 · přijímáme děti od předškoláků
              </p>
              <h1 className="hero-in [animation-delay:120ms] text-[2.7rem] leading-[1.02] sm:text-6xl lg:text-7xl font-extrabold text-white mb-5">
                Vzdělávací klub
                <br />
                na BIO farmě{" "}
                <span className="text-orange squiggle">Fořt</span>
              </h1>
              <p className="hero-in [animation-delay:220ms] font-hand text-[2rem] sm:text-4xl leading-none text-sun mb-5 -rotate-1 origin-left">
                „Pevné kořeny pro svobodný let."
              </p>
              <p className="hero-in [animation-delay:300ms] text-base sm:text-lg text-white/85 leading-relaxed mb-8 max-w-xl">
                Komunitní prostor pro děti na individuálním vzdělávání.
                Příroda Krkonoš, život na farmě a radost z poznávání —
                to vše v malé a bezpečné skupince.
              </p>
              <div className="hero-in [animation-delay:380ms] flex flex-col sm:flex-row gap-3">
                <a
                  href="#kontakt"
                  className="btn btn-sun btn-shine text-base sm:text-lg sm:px-8"
                >
                  Mám zájem — ozvěte se mi
                </a>
                <a
                  href="#o-nas"
                  className="btn btn-glass"
                >
                  Zjistit více
                </a>
              </div>
            </div>
          </div>

          {/* nápověda „posuňte dolů" */}
          <div aria-hidden="true" className="absolute bottom-12 sm:bottom-20 left-1/2 hidden -translate-x-1/2 sm:block">
            <span className="bounce-soft flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur">
              <ChevronDown className="h-5 w-5" />
            </span>
          </div>

          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-forest" />
          </div>
        </section>

        {/* ============ PROHLÍDKY — banner ============ */}
        <section id="prohlidky-banner" className="relative overflow-hidden bg-forest text-white">
          <div aria-hidden="true" className="dot-grid absolute inset-0" />
          <div aria-hidden="true" className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-moss/25 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 lg:gap-10 items-center">
              <span aria-hidden="true" className="icon-bubble h-14 w-14 rounded-2xl bg-white/10 text-orange ring-1 ring-white/15 sway">
                <DoorOpen className="h-7 w-7" />
              </span>
              <div className="reveal">
                <p className="eyebrow text-orange mb-3">
                  Otevíráme bránu — přijďte s dětmi
                </p>
                <h2 className="text-[1.9rem] sm:text-4xl lg:text-[2.6rem] font-extrabold leading-[1.08] mb-3">
                  Přijďte se podívat na farmu
                </h2>
                <p className="text-white/80 leading-relaxed max-w-2xl text-[0.95rem] sm:text-base">
                  Prohlídky areálu domlouváme <strong className="text-white">individuálně</strong>{" "}— ať máme
                  čas v&nbsp;klidu vás provést a&nbsp;odpovědět na vaše otázky. Napište
                  nám termíny, které by vám vyhovovaly, a&nbsp;my se vám ozveme.
                  Přijďte klidně i&nbsp;s&nbsp;dětmi nasát atmosféru BIO farmy Fořt.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/prohlidky"
                  className="btn btn-sun btn-shine text-base sm:text-lg whitespace-nowrap"
                >
                  Domluvit prohlídku →
                </Link>
                <p className="text-white/55 text-xs text-center">
                  Termíny navrhujete vy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PŘESPÁVAČKY — novinka ============ */}
        {/* jen se zapnutým vypínačem PRESPAVKY_AKTIVNI (src/lib/prespavky.ts) */}
        {PRESPAVKY_AKTIVNI && (
          <section id="prespavky" className="py-14 sm:py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="reveal relative isolate overflow-hidden rounded-[2rem] bg-night text-white shadow-lift grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
                {/* noční obloha — hvězdy a měsíček */}
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                  <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange/15 blur-3xl" />
                  <Moon className="prespavky-moon absolute right-5 top-5 h-9 w-9 text-sun/80 sm:right-8 sm:top-8 sm:h-12 sm:w-12" fill="currentColor" />
                  <span className="prespavky-star absolute right-24 top-10 h-1.5 w-1.5 rounded-full bg-white" />
                  <span className="prespavky-star-2 absolute right-40 top-20 h-1 w-1 rounded-full bg-white" />
                  <span className="prespavky-star-3 absolute right-14 top-28 h-1 w-1 rounded-full bg-sun" />
                  <span className="prespavky-star-2 absolute left-[48%] top-8 hidden h-1 w-1 rounded-full bg-white lg:block" />
                  <span className="prespavky-star absolute left-[60%] bottom-10 hidden h-1.5 w-1.5 rounded-full bg-white lg:block" />
                </div>
                <div className="relative min-h-[240px] sm:min-h-[300px] lg:min-h-0 overflow-hidden">
                  <Image
                    src="/images/klubik/klubik-31.jpg"
                    alt="Večerní oheň na farmě"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover parallax-img"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-night/10 lg:to-night" />
                  <div aria-hidden="true" className="absolute bottom-6 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-orange/40 blur-2xl" />
                </div>
                <div className="relative p-6 pt-2 sm:p-10 lg:p-12">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-3 py-1 mb-4 shadow-glow">
                    🔥 Novinka — podzim 2026
                  </span>
                  <h2 className="text-[1.9rem] leading-[1.08] sm:text-4xl font-extrabold text-white mb-4">
                    Víkendové přespávačky na farmě
                  </h2>
                  <p className="text-white/75 leading-relaxed mb-6 max-w-xl">
                    Čtyři tematické víkendy pro všechny děti{" "}
                    <strong className="text-white">od předškoláků do 13 let</strong> — tvoření, večerní
                    oheň, zvířata a spaní na farmě. Ideální pro rodiny na horách
                    i pro místní. Malá skupinka (max 6 spících dětí), jídlo
                    v ceně, od <strong className="text-sun">1 290 Kč</strong>.
                  </p>
                  <Link
                    href="/prespavky"
                    className="btn btn-sun btn-shine w-full sm:w-auto"
                  >
                    Termíny, ceny a přihláška →
                  </Link>
                  <Flame aria-hidden="true" className="absolute bottom-6 right-6 hidden h-16 w-16 text-orange/10 sm:block" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* běžící pás fotek — „život" hned po prvním scrollu; bez sekce
            přespávaček nad sebou si horní odsazení dá sám */}
        <FotoPas
          fotky={PAS_FOTEK}
          className={`bg-white pb-10 sm:pb-16 ${PRESPAVKY_AKTIVNI ? "" : "pt-10 sm:pt-16"}`}
        />

        {/* ============ O NÁS ============ */}
        <section id="o-nas" className="relative py-20 sm:py-28 bg-cream grain overflow-hidden">
          <Leaf aria-hidden="true" className="sway pointer-events-none absolute -left-6 top-16 h-28 w-28 text-moss/25 sm:left-10" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-[2.2rem] leading-[1.05] sm:text-5xl lg:text-6xl font-extrabold text-dark mb-6">
                Nejsme škola.{" "}
                <br className="sm:hidden" />
                <span className="text-forest">
                  Jsme <span className="squiggle">klubík</span>.
                </span>
              </h2>
              <p className="text-lg text-brown leading-relaxed">
                Věříme, že návrat k přírodě a ke klidnému tempu je tou nejlepší
                cestou pro rozvoj dětí. Náš klub vytváří bezpečný prostor, kde se
                děti učí rozumět světu kolem sebe — svým tempem, s radostí
                a&nbsp;v&nbsp;kontaktu s&nbsp;živou přírodou.
              </p>
            </div>

            <SnapRadek className="sm:grid-cols-2 lg:grid-cols-3">
              {HODNOTY.map((value) => {
                const Ikona = value.ikona;
                return (
                  <div
                    key={value.title}
                    className={`reveal card-lift h-full rounded-[1.75rem] p-6 sm:p-8 shadow-soft ${value.styl}`}
                  >
                    <span aria-hidden="true" className={`icon-bubble mb-5 ${value.bublina}`}>
                      <Ikona className="h-6 w-6" />
                    </span>
                    <h3 className={`text-xl font-bold mb-2 ${value.nadpis}`}>
                      {value.title}
                    </h3>
                    <p className={`text-[0.95rem] leading-relaxed ${value.popis}`}>
                      {value.text}
                    </p>
                  </div>
                );
              })}
            </SnapRadek>
          </div>
        </section>

        {/* ============ JAK TRÁVÍME ČAS ============ */}
        <section className="relative py-20 sm:py-28 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="reveal text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-12 sm:mb-16 text-center">
              Jak u nás trávíme čas
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-14 sm:mb-16">
              <div className="relative mx-auto w-full max-w-lg">
                <div aria-hidden="true" className="spin-slow absolute -inset-4 sm:-inset-6 rounded-full border-2 border-dashed border-moss/40" />
                <div className="reveal-zoom relative aspect-[4/5] sm:aspect-square overflow-hidden blob blob-morph shadow-lift">
                  <Image
                    src="/images/park.png"
                    alt="Kamenný stůl v parku farmy Fořt — venkovní zázemí"
                    fill
                    sizes="(min-width: 1024px) 40vw, 90vw"
                    className="object-cover parallax-img"
                  />
                </div>
                <div aria-hidden="true" className="polaroid float-slow absolute -bottom-6 -right-2 w-32 sm:w-40 [--r:5deg] rotate-[5deg]">
                  <Image src="/images/klubik/klubik-06.jpg" alt="" width={320} height={320} className="aspect-square w-full rounded object-cover" />
                </div>
              </div>

              <div className="relative">
                <span aria-hidden="true" className="absolute left-6 top-6 bottom-6 w-px border-l-2 border-dashed border-forest/20" />
              <ol className="relative space-y-8">
                {JAK_TRAVIME.map((polozka) => {
                  const Ikona = polozka.ikona;
                  return (
                    <li key={polozka.title} className="reveal relative flex gap-5">
                      <span aria-hidden="true" className="icon-bubble relative z-10 bg-forest text-white shadow-[0_0_0_6px_#fff]">
                        <Ikona className="h-6 w-6" />
                      </span>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">{polozka.title}</h3>
                        <p className="text-brown leading-relaxed">{polozka.text}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              </div>
            </div>

            <SnapRadek className="sm:grid-cols-3 sm:gap-6">
              {[
                { src: "/images/klubik/klubik-12.jpg", alt: "Děti tvoří z barevných papírů na trávě" },
                { src: "/images/klubik/klubik-06.jpg", alt: "Odpočinek na dece ve stínu stromů v parku farmy" },
                { src: "/images/klubik/klubik-21.jpg", alt: "Společné dílo dětí — malovaná plachta s barevnými stuhami" },
              ].map((photo, i) => (
                <div
                  key={photo.src}
                  className={`group reveal overflow-hidden rounded-[1.75rem] shadow-soft ${
                    i === 1 ? "sm:translate-y-8" : ""
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={640}
                    height={420}
                    className="w-full h-64 sm:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </SnapRadek>

            <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <p className="text-center text-brown">
                <Link href="/galerie" className="group inline-flex items-center justify-center gap-2 rounded-full bg-forest-pale px-5 py-3 font-semibold text-forest transition hover:bg-forest hover:text-white w-full sm:w-auto">
                  Podívejte se na fotky z letní akce pro děti →
                </Link>
              </p>
              <p className="text-center text-brown">
                <Link href="/ze-zivota-klubiku" className="group inline-flex items-center justify-center gap-2 rounded-full bg-sun px-5 py-3 font-semibold text-brown transition hover:bg-orange hover:text-dark w-full sm:w-auto">
                  Co děti v klubíku zažily v září →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ============ BIO STRAVA ============ */}
        <section className="relative py-20 sm:py-28 bg-beige grain overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="relative">
                <div aria-hidden="true" className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-orange/30 blur-2xl" />
                <div className="reveal-zoom relative overflow-hidden rounded-[2rem] rounded-tl-[6rem] shadow-lift">
                  <Image
                    src="/images/klubik/klubik-27.jpg"
                    alt="Děti krájí jablka na svačinu u venkovního stolu"
                    width={800}
                    height={530}
                    className="w-full h-80 sm:h-[460px] object-cover"
                  />
                </div>
                <span aria-hidden="true" className="float-slow icon-bubble absolute -bottom-5 right-6 h-16 w-16 rounded-3xl bg-forest text-white shadow-lift [--r:-8deg] -rotate-[8deg]">
                  <Leaf className="h-8 w-8" />
                </span>
              </div>
              <div className="reveal">
                <p className="eyebrow text-forest mb-4">
                  Přímo z farmy na talíř
                </p>
                <h2 className="text-[2rem] leading-[1.06] sm:text-5xl font-extrabold text-dark mb-6">
                  Lokální BIO strava z&nbsp;produkce farmy
                </h2>
                <p className="text-lg text-brown leading-relaxed mb-7">
                  Děti u nás obědvají plnohodnotnou stravu připravenou z&nbsp;čerstvých
                  surovin přímo z&nbsp;BIO farmy Fořt. Žádné polotovary, žádné
                  dodavatelské firmy — jídlo roste tam, kde se děti učí.
                </p>
                <ul className="space-y-3.5 mb-8">
                  {[
                    "Zelenina, ovoce a bylinky z vlastních políček farmy",
                    "Mléčné výrobky a vejce od farmářských zvířat",
                    "Strava v Demeter kvalitě — nejvyšší BIO standard",
                    "Společný oběd jako denní rituál a příležitost k setkání",
                    "Děti se podílejí na přípravě — učí se odkud jídlo pochází",
                  ].map((item) => (
                    <Odrazka key={item} tmava>
                      {item}
                    </Odrazka>
                  ))}
                </ul>
                <div className="flex items-start gap-4 rounded-3xl bg-white/80 p-5 shadow-soft">
                  <span aria-hidden="true" className="icon-bubble h-11 w-11 bg-sun text-brown">
                    <Salad className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-brown-light leading-relaxed">
                    Farma Fořt je certifikovaný BIO producent. Děti tak dostávají
                    to nejlepší, co krajina Krkonoš nabízí — čerstvé, sezónní
                    a s&nbsp;příběhem. Oběd stojí 60–80&nbsp;Kč podle věku dítěte.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROGRAM ============ */}
        <section id="program" className="relative py-20 sm:py-28 pb-28 sm:pb-40 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="reveal">
                <p className="eyebrow text-forest mb-4">
                  Pro koho jsme
                </p>
                <h2 className="text-[2.2rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-6">
                  Program <span className="text-forest squiggle">Badatelé</span>
                </h2>
                <p className="text-lg text-brown leading-relaxed mb-8">
                  Pro předškoláky a děti 1.–5. ročníku ZŠ. Školáci jsou
                  u nás v režimu individuálního vzdělávání: dítě zůstává
                  zapsáno na kmenové škole a my mu poskytujeme inspirativní
                  zázemí a průvodce na jeho cestě. Předškoláci se přidávají
                  ke skupince na stejný program.
                </p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    "Studijní zázemí v historické budově na farmě",
                    "Metodická podpora a individuální vedení",
                    "Prostor pro soustředěnou práci i volnou hru",
                    "Pomůžeme vám najít vhodnou kmenovou školu",
                  ].map((item) => (
                    <Odrazka key={item}>{item}</Odrazka>
                  ))}
                </ul>

                <div className="relative overflow-hidden rounded-3xl bg-forest-pale p-5 sm:p-6 mb-5">
                  <Sprout aria-hidden="true" className="absolute -right-3 -bottom-3 h-20 w-20 text-forest/10" />
                  <p className="relative text-brown leading-relaxed text-sm sm:text-[0.95rem]">
                    <span className="font-bold text-dark">A co po 5. třídě?</span>{" "}
                    Plánujeme postupné rozšíření až do 9. ročníku. Startujeme
                    s&nbsp;prvním stupněm, ale naším cílem je, aby děti mohly
                    zůstat spolu po celou dobu základního vzdělávání. Kamarádi
                    se nerozprchnou — rosteme společně.
                  </p>
                </div>

                <p className="inline-flex items-center gap-2.5 rounded-full bg-sun px-4 py-2 text-sm font-semibold text-brown mb-8">
                  <CalendarDays aria-hidden="true" className="h-4 w-4 text-orange-hover" />
                  Docházka 2&nbsp;dny v&nbsp;týdnu od&nbsp;2&nbsp;730&nbsp;Kč/měs.
                </p>

                <div>
                  <a
                    href="#kontakt"
                    className="btn btn-sun btn-shine w-full sm:w-auto"
                  >
                    Chci přihlásit dítě
                  </a>
                </div>
              </div>

              <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                <div aria-hidden="true" className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-sun blur-2xl" />
                <div className="group reveal-zoom relative col-span-2 overflow-hidden rounded-[2rem] rounded-br-[5rem] shadow-soft">
                  <Image
                    src="/images/klubik/klubik-38.jpg"
                    alt="Děti kreslí a zapisují si vlastní pozorování venku"
                    width={900}
                    height={600}
                    className="w-full h-60 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="group reveal relative overflow-hidden rounded-[2rem] rounded-tr-[4rem] shadow-soft">
                  <Image
                    src="/images/klubik/klubik-53.jpg"
                    alt="Průvodkyně a děti nad společnou prací"
                    width={600}
                    height={600}
                    className="w-full h-44 sm:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="group reveal relative overflow-hidden rounded-[2rem] rounded-bl-[4rem] shadow-soft sm:translate-y-6">
                  <Image
                    src="/images/klubik/klubik-51.jpg"
                    alt="Děti zkoumají nález venku v parku"
                    width={600}
                    height={600}
                    className="w-full h-44 sm:h-56 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* tmavé hory, ze kterých vyroste sekce Zázemí */}
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-forest-deep" />
          </div>
        </section>

        {/* ============ ZÁZEMÍ ============ */}
        <section id="zazemi" className="relative py-16 sm:py-24 pb-24 sm:pb-36 bg-forest-deep text-white overflow-hidden">
          <div aria-hidden="true" className="dot-grid absolute inset-0" />
          <div aria-hidden="true" className="absolute left-1/2 top-40 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-forest-light/25 blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-16">
              <h2 className="text-[2.3rem] leading-[1.02] sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
                Učebna <span className="text-orange">bez zdí</span>
              </h2>
              <p className="text-lg text-white/75 max-w-2xl mx-auto">
                Naše prostředí stimuluje zvídavost a umožňuje dětem pohyb
                v bezpečné náruči přírody Krkonoš.
              </p>
            </div>

            <SnapRadek className="sm:grid-cols-2 lg:grid-cols-3 lg:gap-6" tecky="bg-orange">
              {[
                {
                  title: "Badatelské prostory",
                  desc: "Klidná a vybavená místnost v historické budově pro soustředěné učení.",
                  fotky: [
                    { src: "/images/klubik/prostor-badatelna-3.jpg", alt: "Badatelská místnost s dřevěným stropem" },
                    { src: "/images/klubik/prostor-badatelna-1.jpg", alt: "Světlá místnost s kobercem a podsedáky" },
                    { src: "/images/klubik/prostor-badatelna-2.jpg", alt: "Místnost s mapou a policemi u okna" },
                    { src: "/images/klubik/klubik-35.jpg", alt: "Děti u tabule v badatelské místnosti" },
                  ],
                },
                {
                  title: "Společenská místnost",
                  desc: "Srdce naší farmy — kamna, velký stůl, společné tvoření a rituály dne.",
                  fotky: [
                    { src: "/images/klubik/prostor-spolecenska-1.jpg", alt: "Velký zelený stůl a průchod do kuchyně" },
                    { src: "/images/klubik/prostor-spolecenska-2.jpg", alt: "Posezení u kamen s pohovkou" },
                    { src: "/images/klubik/prostor-spolecenska-3.jpg", alt: "Jídelní kout u oken do zahrady" },
                    { src: "/images/klubik/prostor-spolecenska-4.jpg", alt: "Obrázky a zrcadlo na stěně místnosti" },
                  ],
                },
                {
                  title: "Klidová teráska na odpočinek",
                  desc: "Zastřešená teráska s výhledem na louky a pasoucí se krávy — místo na odpočinek, čtení a ticho.",
                  fotky: [
                    { src: "/images/klubik/prostor-klidova-1.jpg", alt: "Krytá teráska s lehátky a výhledem do krajiny" },
                    { src: "/images/klubik/prostor-klidova-2.jpg", alt: "Výhled z terásky na pastvinu s kravami" },
                    { src: "/images/klubik/prostor-klidova-3.jpg", alt: "Pohled z místnosti na terásku" },
                    { src: "/images/klubik/prostor-klidova-4.jpg", alt: "Dřevěná teráska s lehátky" },
                    { src: "/images/klubik/prostor-klidova-5.jpg", alt: "Teráska ze strany, zastřešená a s výhledem" },
                  ],
                },
                {
                  title: "Badatelské procházky v okolí farmy",
                  desc: "Vyrážíme do krajiny kolem farmy — k potoku, na louky a do lesa. Co děti cestou najdou, spolu prozkoumáme, a pak si to třeba i namalujeme.",
                  fotky: [
                    { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi" },
                    { src: "/images/klubik/klubik-48.jpg", alt: "Zkoumání potoka" },
                    { src: "/images/klubik/klubik-39.jpg", alt: "Malování venku na dece" },
                  ],
                },
                {
                  title: "Malí kulináři",
                  desc: "Krájíme, pečeme a opékáme z toho, co dá farma — od jablek po hadovku nad ohněm. Co si děti samy uchystají, chutná nejvíc.",
                  fotky: [
                    { src: "/images/klubik/klubik-29.jpg", alt: "Krájení jablek na svačinu" },
                    { src: "/images/klubik/klubik-31.jpg", alt: "Hadovka z těsta nad ohněm" },
                    { src: "/images/klubik/klubik-30.jpg", alt: "Nachystaná jablka k pečení" },
                    { src: "/images/klubik/prostor-kuchyne.jpg", alt: "Kuchyňský pult na farmě s kalendářem sezónních plodin" },
                  ],
                },
                {
                  title: "Park farmy a krajina",
                  desc: "Nádherný park s dávnými stromy a rozlehlé louky Krkonoš — přirozené hřiště, místo pro výlety a zkoumání přírody.",
                  fotky: [
                    { src: "/images/park.png", alt: "Kamenný stůl v parku farmy" },
                    { src: "/images/klubik/klubik-03.jpg", alt: "Děti na kamenném stole v parku" },
                    { src: "/images/park3.png", alt: "Ohniště s dřevěnými špalky" },
                    { src: "/images/klubik/klubik-06.jpg", alt: "Odpočinek na dece ve stínu stromů" },
                    { src: "/images/park4.png", alt: "Divoká zahrada na farmě" },
                    { src: "/images/klubik/klubik-11.jpg", alt: "Společné dílo rozvěšené mezi stromy" },
                    { src: "/images/klubik/klubik-14.jpg", alt: "Malování na plachtu v parku" },
                    { src: "/images/klubik/prostor-park.jpg", alt: "Pohled z okna farmy do parku" },
                  ],
                },
              ].map((space) => (
                <ProstorKarta key={space.title} prostor={space} />
              ))}
            </SnapRadek>

            <p className="mt-6 text-center text-sm text-white/55">
              U prostorů s víc fotkami klepněte na malé náhledy — velká fotka se
              vymění.
            </p>
          </div>
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-cream" />
          </div>
        </section>

        {/* ============ AKTIVITY ============ */}
        <section id="aktivity" className="relative py-20 sm:py-28 bg-cream grain overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal">
              <h2 className="text-[2.2rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-5 text-center">
                Život v <span className="text-forest squiggle">pohybu</span>
              </h2>
              <p className="text-lg text-brown text-center max-w-2xl mx-auto mb-12 sm:mb-16">
                Vzdělávání nekončí za branami farmy. Pořádáme aktivity, které
                rozšiřují obzory a budují komunitu.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {AKTIVITY.map((activity) => {
                const Ikona = activity.ikona;
                return (
                  <div
                    key={activity.title}
                    className="reveal card card-lift p-5 sm:p-7"
                  >
                    <span aria-hidden="true" className={`icon-bubble mb-4 h-11 w-11 sm:h-12 sm:w-12 ${activity.bublina}`}>
                      <Ikona className="h-5 w-5 sm:h-6 sm:w-6" />
                    </span>
                    <h3 className="font-bold text-dark text-[1.05rem] sm:text-lg leading-tight mb-2">{activity.title}</h3>
                    <p className="text-[0.82rem] sm:text-sm text-brown leading-relaxed">
                      {activity.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ PRO RODIČE ============ */}
        <section id="pro-rodice" className="relative pt-20 pb-28 sm:pt-28 sm:pb-40 bg-beige grain">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="reveal">
                <h2 className="text-[2.2rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-5 text-center">
                  Pro rodiče
                </h2>
                <p className="text-lg text-brown text-center mb-10 sm:mb-12">
                  Důležité informace o tom, jak to u nás funguje.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: "Jak funguje individuální vzdělávání?",
                    a: "Vaše dítě zůstává zapsáno na kmenové škole a absolvuje pravidelná pololetní přezkoušení. Vy jako rodiče zůstáváte hlavními garanty vzdělávání. My poskytujeme inspirativní prostředí, zázemí a metodickou podporu.",
                  },
                  {
                    q: "Kdo jsou průvodci?",
                    a: "Naši průvodci nejsou učiteli ve smyslu školského zákona. Jsou to mentoři, kteří dětem pomáhají s jejich individuálními plány a rozvojem. Provází je na cestě poznáním s laskavostí a respektem.",
                  },
                  {
                    q: "Nemáme ještě schválené IV. Pomůžete nám?",
                    a: "Ano. Pomůžeme vám s procesem přihlášení k individuálnímu vzdělávání i s hledáním vhodné kmenové školy. Stačí se nám ozvat.",
                  },
                  {
                    q: "Jaký je právní rámec?",
                    a: "Jsme komunitní vzdělávací program spolku Vzdělávací centrum Doučse z.s. Nejsme školou, mateřskou školou ani registrovanou dětskou skupinou. Účast probíhá na základě soukromoprávní smlouvy.",
                  },
                  {
                    q: "Kde se to nachází?",
                    a: "BIO farma Fořt leží v Černém Dole u Rudníku, nedaleko Vrchlabí, přímo v srdci Krkonoš. Adresa: Fořt 29, 543 44.",
                  },
                ].map((faq, i) => (
                  <details
                    key={faq.q}
                    open={i === 0}
                    className="faq group reveal rounded-3xl bg-white shadow-soft open:shadow-lift transition-shadow"
                  >
                    <summary className="flex items-center justify-between gap-4 p-5 sm:p-7">
                      <h3 className="font-bold text-dark text-[1.05rem] sm:text-lg leading-snug">{faq.q}</h3>
                      <span aria-hidden="true" className="faq-chevron flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-pale text-forest group-open:bg-orange group-open:text-dark">
                        <Plus className="h-5 w-5" />
                      </span>
                    </summary>
                    <div className="px-5 pb-6 sm:px-7 sm:pb-7 -mt-1">
                      <p className="text-brown leading-relaxed text-[0.95rem]">
                        {faq.a}
                      </p>
                      {faq.q === "Kdo jsou průvodci?" && (
                        <Link
                          href="/pruvodkyne"
                          className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-pale px-4 py-2 text-sm font-semibold text-forest transition hover:bg-forest hover:text-white"
                        >
                          Poznejte naše průvodkyně →
                        </Link>
                      )}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
          {/* zelené hory, ze kterých vyroste výzva „Rozjíždíme to" */}
          <div className="absolute inset-x-0 -bottom-px">
            <Hory className="text-forest" />
          </div>
        </section>

        {/* ============ CTA BANNER ============ */}
        <section className="relative py-20 sm:py-28 bg-forest text-white text-center overflow-hidden isolate">
          <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
          <div aria-hidden="true" className="absolute -top-24 left-1/2 -z-10 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-orange/20 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
            <div className="polaroid float-slow absolute left-[6%] top-16 w-48 [--r:-8deg] -rotate-[8deg]">
              <Image src="/images/klubik/klubik-44.jpg" alt="" width={384} height={384} className="aspect-square w-full rounded object-cover" />
            </div>
            <div className="polaroid float-slow absolute right-[6%] bottom-16 w-52 [--r:7deg] rotate-[7deg] [animation-delay:2s]">
              <Image src="/images/klubik/klubik-47.jpg" alt="" width={416} height={416} className="aspect-square w-full rounded object-cover" />
            </div>
          </div>
          <div className="reveal max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="eyebrow text-orange mb-5 justify-center">
              Od 1. září 2026
            </p>
            <h2 className="text-[2.3rem] leading-[1.04] sm:text-5xl lg:text-6xl font-extrabold mb-5">
              Rozjíždíme to. Přidejte se k nám.
            </h2>
            <p className="text-white/80 text-lg mb-9 max-w-xl mx-auto">
              Hledáme rodiny, které chtějí pro své děti něco víc než jen lavici
              a učebnici. Pokud vás naše vize oslovuje, ozvěte se —
              rádi si popovídáme.
            </p>
            <a
              href="#kontakt"
              className="btn btn-sun btn-shine text-lg w-full sm:w-auto sm:px-10"
            >
              Mám zájem — napište mi
            </a>
          </div>
        </section>

        {/* ============ SPOLUPRÁCE ============ */}
        <section id="spoluprace" className="relative py-20 sm:py-28 bg-forest-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-10 sm:mb-12">
              <h2 className="text-[2.1rem] leading-[1.05] sm:text-5xl font-extrabold text-dark mb-5">
                Spolupráce a podpora
              </h2>
              <p className="text-lg text-brown max-w-2xl mx-auto">
                Budujeme něco nového a každá pomoc se počítá. Chcete být součástí
                našeho příběhu? Hledáme průvodce, dobrovolníky i podporovatele.
              </p>
            </div>

            {/* Hiring banner */}
            <div className="reveal relative overflow-hidden bg-white rounded-[2rem] p-6 sm:p-10 mb-10 text-center shadow-lift ring-2 ring-forest">
              <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sun blur-2xl" />
              <div aria-hidden="true" className="absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-forest-pale blur-2xl" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-forest text-white font-bold text-sm px-4 py-1.5 rounded-full mb-4">
                  <span className="live-dot" aria-hidden="true" />
                  Hledáme do týmu
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-dark mb-3">
                  Průvodce / Průvodkyně
                </h3>
                <p className="text-brown max-w-xl mx-auto leading-relaxed mb-4">
                  Hledáme ještě jednoho průvodce nebo průvodkyni pro náš vzdělávací klub.
                  Pokud máte zkušenosti s prací s dětmi, sdílíte naše hodnoty a baví vás
                  provázet děti na cestě za poznáním — ozvěte se nám. Rádi se s vámi
                  potkáme.
                </p>
                <p className="text-sm text-brown-light">
                  Využijte formulář níže — v sekci „Mám zájem o" vyberte <strong>Průvodcování / Mentoring</strong> a přiložte své CV v PDF.
                </p>
              </div>
            </div>
            <CooperationSection />
          </div>
        </section>

        {/* ============ DOUČSE ZÁŠTITA ============ */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left rounded-3xl bg-cream px-6 py-6 max-w-3xl mx-auto">
              <Image
                src="/images/doucse_logo.png"
                alt="Doučse — vzdělávací centrum"
                width={48}
                height={48}
                className="rounded-xl bg-white p-1 shadow-sm"
              />
              <p className="text-brown text-sm max-w-lg">
                Pod záštitou{" "}
                <a
                  href="https://doucse.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest font-semibold hover:underline"
                >
                  Vzdělávacího centra Doučse z.s.
                </a>{" "}
                — více než 8 let zkušeností ve vzdělávání dětí po celé ČR.
              </p>
            </div>
          </div>
        </section>

        {/* ============ KONTAKT ============ */}
        <section id="kontakt" className="relative py-20 sm:py-28 bg-beige grain overflow-hidden">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-orange/15 blur-3xl" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12">
              <div className="lg:col-span-2 reveal">
                <h2 className="text-[2.3rem] leading-[1.02] sm:text-5xl font-extrabold text-dark mb-4">
                  Ozvěte se <span className="text-forest squiggle">nám</span>
                </h2>
                <p className="text-brown leading-relaxed mb-8 text-lg">
                  Máte zájem, otázky, nebo si chcete jen popovídat?
                  Vyplňte formulář, zavolejte nebo napište e-mail.
                  Rádi se s vámi spojíme.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-4 rounded-3xl bg-white/85 p-4 shadow-soft">
                    <span aria-hidden="true" className="icon-bubble bg-forest-pale text-forest">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown-light">Kontaktní osoba</p>
                      <p className="text-dark font-semibold">
                        Ing. et Bc. Ivan Jadrný
                        <br />
                        <span className="text-brown-light text-sm font-normal">ředitel{" "}
                          <a
                            href="https://doucse.cz"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-forest hover:underline"
                          >
                            Vzdělávacího centra Doučse z.s.
                          </a>
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-3xl bg-white/85 p-4 shadow-soft">
                    <span aria-hidden="true" className="icon-bubble bg-orange text-dark">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown-light">Telefon</p>
                      <a
                        href="tel:+420775917363"
                        className="font-display text-forest font-extrabold text-2xl hover:text-forest-light transition-colors"
                      >
                        775 917 363
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-3xl bg-white/85 p-4 shadow-soft">
                    <span aria-hidden="true" className="icon-bubble bg-forest text-white">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown-light">E-mail</p>
                      <a
                        href="mailto:reditel@doucse.cz"
                        className="text-forest font-bold text-lg hover:text-forest-light transition-colors break-all"
                      >
                        reditel@doucse.cz
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-3xl bg-white/85 p-4 shadow-soft">
                    <span aria-hidden="true" className="icon-bubble bg-sun text-brown">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brown-light">Adresa</p>
                      <p className="text-dark">
                        Fořt 29, 543 44
                        <br />
                        Černý Důl – Rudník u Vrchlabí
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="relative">
                  <div aria-hidden="true" className="absolute -inset-3 -z-0 rounded-[2.5rem] bg-gradient-to-br from-orange/30 via-transparent to-forest/20 blur-xl" />
                  <div className="relative bg-white rounded-[2rem] p-6 sm:p-10 shadow-lift">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="mt-16 sm:mt-20">
              <h3 className="reveal text-2xl sm:text-3xl font-extrabold text-dark mb-2 text-center">
                Kde nás najdete
              </h3>
              <p className="text-brown text-center mb-6">
                BIO farma Fořt — v srdci Krkonoš, kousek od Vrchlabí
              </p>
              <div className="rounded-[2rem] overflow-hidden shadow-lift ring-4 ring-white">
                <iframe
                  src="https://frame.mapy.cz/?x=15.6928&y=50.5972&z=14&l=0&m=firm&p=50.5972%2C15.6928"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="block h-[300px] sm:h-[380px]"
                  title="Mapa — BIO farma Fořt, Černý Důl"
                />
              </div>
              <div className="flex justify-center gap-3 mt-5">
                <a
                  href="https://www.google.com/maps/search/Fořt+29,+543+44+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-forest text-sm font-semibold shadow-soft transition hover:bg-forest hover:text-white"
                >
                  Google Maps &rarr;
                </a>
                <a
                  href="https://mapy.cz/zakladni?q=Fořt+29+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full bg-white px-5 py-3 text-forest text-sm font-semibold shadow-soft transition hover:bg-forest hover:text-white"
                >
                  Mapy.cz &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {/* Fořťáček — maskot v pravém dolním rohu */}
      <Maskot />

      {/* lepicí tlačítka na telefonu — stejné texty i cíle jako v hlavičce */}
      <StickyCta
        akce={[
          { label: "Domluvit prohlídku", href: "/prohlidky" },
          { label: "Mám zájem", href: "#kontakt", hlavni: true },
        ]}
        schovatU={["kontakt"]}
      />
    </>
  );
}
