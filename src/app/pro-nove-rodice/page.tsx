import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CalendarClock,
  ExternalLink,
  FileSignature,
  FileText,
  HeartHandshake,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import Hory from "@/components/design/Hory";

export const metadata: Metadata = {
  title: "Než podepíšeme smlouvu | Klub Fořt",
  description:
    "Vše, k čemu se upisujete: smlouva, souhlas se zpracováním údajů, provozní řád a ceník klubu na školní rok 2026/2027.",
  robots: { index: false, follow: false },
};

/** Karta s dokumentem ke stažení nebo přečtení. */
function DocCard({
  href,
  title,
  note,
  cta,
  external,
  ikona: Ikona,
}: {
  href: string;
  title: string;
  note: string;
  cta: string;
  external?: boolean;
  ikona: LucideIcon;
}) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span aria-hidden="true" className="icon-bubble h-11 w-11 rounded-2xl bg-forest-pale text-forest transition-colors group-hover:bg-forest group-hover:text-white">
          <Ikona className="h-5 w-5" aria-hidden="true" />
        </span>
        {external && (
          <ExternalLink className="mt-1 h-4 w-4 text-brown-light/70" aria-hidden="true" />
        )}
      </div>
      <p className="mt-4 font-display text-lg font-bold leading-snug text-dark">{title}</p>
      <p className="text-sm text-brown mt-1.5 leading-relaxed">{note}</p>
      <p className="mt-auto pt-4 text-sm font-bold text-forest">
        {cta}{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </p>
    </>
  );
  const styl =
    "card card-lift group flex h-full flex-col p-6 ring-1 ring-dark/5 hover:ring-forest/20";
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styl}
    >
      {inner}
    </a>
  ) : (
    <Link
      href={href}
      className={styl}
    >
      {inner}
    </Link>
  );
}

const CENIK: { item: string; scope: string; price: string }[] = [
  { item: "Docházka — 1 den v týdnu", scope: "měsíčně", price: "1 600 Kč" },
  { item: "Docházka — 2 dny v týdnu", scope: "měsíčně", price: "2 730 Kč" },
  { item: "Docházka — 3 dny v týdnu", scope: "měsíčně", price: "3 900 Kč" },
  {
    item: "Sourozenecká sleva (2 a více dětí s tarifem)",
    scope: "z příspěvku každého dítěte",
    price: "− 5 %",
  },
  { item: "Oběd dítěte (z produkce farmy)", scope: "za den", price: "80 Kč" },
  {
    item: "Den navíc mimo tarif (dle volné kapacity)",
    scope: "za den",
    price: "400 Kč",
  },
  {
    item: "Péče po provozní době",
    scope: "za každou započatou hodinu",
    price: "400 Kč",
  },
  {
    item: "Výlety, akce a odpolední kroužky",
    scope: "dle konkrétní akce",
    price: "dle aplikace",
  },
];

const KROKY = [
  {
    t: "Přečtěte si dokumenty",
    d: "Smlouvu, souhlas se zpracováním údajů, provozní řád a ceník najdete níže. Na cokoliv se můžete zeptat předem — na nic nespěcháme.",
  },
  {
    t: "Podepíšeme smlouvu a souhlas",
    d: "Osobně na farmě nebo doma vytisknout, podepsat a nahrát sken do aplikace. Součástí je evidenční list dítěte.",
  },
  {
    t: "Dostanete přístup do aplikace",
    d: "Na app.klubdetifort.cz si zafixujete dny docházky na celý rok, nastavíte obědy, čas vyzvednutí a oprávněné osoby.",
  },
  {
    t: "Zbytek už řešíte v aplikaci",
    d: "Odhlášky, dny navíc, akce, kroužky, faktury i vzkazy průvodkyním. Nic z toho není potřeba domlouvat dopředu ve smlouvě.",
  },
];

export default function ProNoveRodicePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ============ ÚVODNÍ PÁS ============ */}
      <div className="relative overflow-hidden bg-forest-deep text-white">
        <div aria-hidden="true" className="dot-grid absolute inset-0" />
        <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-12 sm:pb-28">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/20 transition"
          >
            ← Zpět na hlavní stránku
          </Link>
          <span aria-hidden="true" className="hero-in icon-bubble mt-10 flex bg-white/10 text-orange ring-1 ring-white/15 sm:mt-12">
            <FileSignature className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="hero-in [animation-delay:120ms] mt-5 text-[2.5rem] leading-[1.05] sm:text-6xl font-extrabold">
            Než podepíšeme smlouvu
          </h1>
          <p className="hero-in [animation-delay:240ms] mt-6 text-lg text-white/75 leading-relaxed">
            Tady najdete všechno, k čemu se upisujete — smlouvu, pravidla
            provozu, zpracování osobních údajů i celý ceník na školní rok
            2026/2027. Nic z toho není schované v drobném písmu.
          </p>
        </div>
        <div className="absolute inset-x-0 -bottom-px">
          <Hory className="text-cream" />
        </div>
      </div>

      <div className="relative grain">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-24">
          {/* Jak to proběhne */}
          <h2 className="text-[1.9rem] leading-[1.1] sm:text-4xl font-extrabold text-dark mb-7">Jak to proběhne</h2>
          <div className="relative mb-16 sm:mb-20">
            {/* spojnice kroků — jen dekorace */}
            <span aria-hidden="true" className="absolute bottom-8 left-[1.3125rem] top-8 w-0.5 bg-[repeating-linear-gradient(to_bottom,rgb(45_90_39/0.3)_0_6px,transparent_6px_12px)]" />
            <ol className="relative space-y-4">
              {KROKY.map((k, i) => (
                <li key={k.t} className="reveal relative flex gap-4">
                  <span className="relative z-10 flex-shrink-0 w-11 h-11 rounded-full bg-forest font-display text-lg text-white font-extrabold flex items-center justify-center shadow-[0_0_0_5px_#FBF8F2]">
                    {i + 1}
                  </span>
                  <div className="card flex-1 p-5 ring-1 ring-dark/5">
                    <p className="font-display text-lg font-bold text-dark">{k.t}</p>
                    <p className="text-brown text-[0.95rem] leading-relaxed mt-1">
                      {k.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Dokumenty */}
          <h2 className="text-[1.9rem] leading-[1.1] sm:text-4xl font-extrabold text-dark mb-7">Dokumenty</h2>
          <div className="grid gap-4 sm:grid-cols-2 mb-16 sm:mb-20">
            <DocCard
              href="https://app.klubdetifort.cz/dokumenty/smlouva-o-dochazce-2026-27.pdf"
              title="Smlouva o docházce 2026/27"
              note="Co si vzájemně slibujeme: rozsah docházky, platby, odhlašování, kredit, předávání dítěte, ukončení. Ceník je přílohou č. 1."
              cta="Otevřít PDF"
              external
              ikona={FileText}
            />
            <DocCard
              href="https://app.klubdetifort.cz/dokumenty/souhlas-gdpr-fotografie.pdf"
              title="Souhlas se zpracováním osobních údajů"
              note="Zdravotní údaje dítěte a pravidla fotografování — včetně toho, že fotku, kde je dítě poznat, zveřejníme až po vašem schválení."
              cta="Otevřít PDF"
              external
              ikona={FileSignature}
            />
            <DocCard
              href="https://app.klubdetifort.cz/provozni-rad"
              title="Provozní řád klubu"
              note="Jak to u nás chodí: provozní doba, rytmus dne, předávání dětí, stravování, vybavení, nemoci, bezpečnost na farmě."
              cta="Přečíst"
              ikona={BookOpen}
            />
            <DocCard
              href="/ochrana-osobnich-udaju"
              title="Zásady zpracování osobních údajů"
              note="Jaké údaje o vás a dítěti vedeme, proč, kdo se k nim dostane, jak dlouho je držíme a jaká máte práva."
              cta="Přečíst"
              ikona={ShieldCheck}
            />
          </div>

          {/* Ceník */}
          <h2 className="text-[1.9rem] leading-[1.1] sm:text-4xl font-extrabold text-dark mb-3">
            Ceník na školní rok 2026/2027
          </h2>
          <p className="text-brown mb-7 leading-relaxed sm:text-lg">
            Ceny docházky jsou <strong className="font-bold text-dark">zakladatelské</strong> a platí na celý
            školní rok 2026/2027 (například 2 dny v týdnu 2 730 Kč měsíčně).
            Za <strong className="font-bold text-dark">září a říjen 2026 se docházka nehradí</strong>;
            obědy a ostatní služby se hradí i v tomto období.
          </p>
          <div className="card overflow-hidden ring-1 ring-dark/5 mb-5">
            <table className="w-full text-sm sm:text-[0.95rem]">
              <tbody>
                {CENIK.map((r) => (
                  <tr key={r.item} className="border-b border-dark/5 last:border-0 even:bg-cream/70">
                    <td className="py-3.5 pl-5 pr-3 text-dark font-medium leading-snug sm:pl-6">{r.item}</td>
                    <td className="py-3.5 px-2 text-brown-light hidden sm:table-cell">
                      {r.scope}
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-right font-display text-base font-extrabold text-forest whitespace-nowrap sm:pr-6">
                      {r.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mb-16 flex items-start gap-3 sm:mb-20">
            <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sun text-brown">
              <CalendarClock className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-sm text-brown leading-relaxed">
              Měsíční příspěvek se platí předem, splatnost do 25. dne předchozího
              měsíce (první za listopad 2026). Obědy a doplatky se účtují zpětně
              jedním vyúčtováním se splatností do 10. dne následujícího měsíce.
            </p>
          </div>

          {/* Kontakt */}
          <div className="relative overflow-hidden rounded-[1.75rem] bg-forest-pale p-6 sm:p-8 ring-1 ring-forest/10">
            <HeartHandshake aria-hidden="true" className="pointer-events-none absolute -right-4 -bottom-6 h-32 w-32 text-forest/[0.07]" />
            <span aria-hidden="true" className="icon-bubble mb-4 bg-white text-forest shadow-soft">
              <HeartHandshake className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="font-display text-xl font-bold text-dark mb-2">Něco vám není jasné?</p>
            <p className="relative text-brown leading-relaxed">
              Zeptejte se dřív, než cokoliv podepíšete — rádi to projdeme spolu.
              Ivan Jadrný,{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
              >
                reditel@doucse.cz
              </a>
              ,{" "}
              <a href="tel:+420775917363" className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light whitespace-nowrap">
                775 917 363
              </a>
              .
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-dark/10">
            <Link
              href="/"
              className="btn btn-sun"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
