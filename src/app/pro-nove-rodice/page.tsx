import type { Metadata } from "next";
import Link from "next/link";

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
}: {
  href: string;
  title: string;
  note: string;
  cta: string;
  external?: boolean;
}) {
  const inner = (
    <>
      <p className="font-bold text-dark">{title}</p>
      <p className="text-sm text-dark/70 mt-1 leading-relaxed">{note}</p>
      <p className="text-sm font-semibold text-orange mt-3">{cta} →</p>
    </>
  );
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-2xl p-6 hover:shadow-md transition-shadow"
    >
      {inner}
    </a>
  ) : (
    <Link
      href={href}
      className="block bg-white rounded-2xl p-6 hover:shadow-md transition-shadow"
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
    <main className="min-h-screen bg-beige">
      <div className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Než podepíšeme smlouvu
          </h1>
          <p className="mt-3 text-white/80 leading-relaxed">
            Tady najdete všechno, k čemu se upisujete — smlouvu, pravidla
            provozu, zpracování osobních údajů i celý ceník na školní rok
            2026/2027. Nic z toho není schované v drobném písmu.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Jak to proběhne */}
        <h2 className="text-2xl font-bold text-dark mb-6">Jak to proběhne</h2>
        <ol className="space-y-4 mb-14">
          {KROKY.map((k, i) => (
            <li key={k.t} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-forest text-white font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <p className="font-bold text-dark">{k.t}</p>
                <p className="text-dark/70 text-sm leading-relaxed mt-1">
                  {k.d}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Dokumenty */}
        <h2 className="text-2xl font-bold text-dark mb-6">Dokumenty</h2>
        <div className="grid gap-4 sm:grid-cols-2 mb-14">
          <DocCard
            href="https://app.klubdetifort.cz/dokumenty/smlouva-o-dochazce-2026-27.pdf"
            title="Smlouva o docházce 2026/27"
            note="Co si vzájemně slibujeme: rozsah docházky, platby, odhlašování, kredit, předávání dítěte, ukončení. Ceník je přílohou č. 1."
            cta="Otevřít PDF"
            external
          />
          <DocCard
            href="https://app.klubdetifort.cz/dokumenty/souhlas-gdpr-fotografie.pdf"
            title="Souhlas se zpracováním osobních údajů"
            note="Zdravotní údaje dítěte a pravidla fotografování — včetně toho, že fotku, kde je dítě poznat, zveřejníme až po vašem schválení."
            cta="Otevřít PDF"
            external
          />
          <DocCard
            href="https://app.klubdetifort.cz/provozni-rad"
            title="Provozní řád klubu"
            note="Jak to u nás chodí: provozní doba, rytmus dne, předávání dětí, stravování, vybavení, nemoci, bezpečnost na farmě."
            cta="Přečíst"
          />
          <DocCard
            href="/ochrana-osobnich-udaju"
            title="Zásady zpracování osobních údajů"
            note="Jaké údaje o vás a dítěti vedeme, proč, kdo se k nim dostane, jak dlouho je držíme a jaká máte práva."
            cta="Přečíst"
          />
        </div>

        {/* Ceník */}
        <h2 className="text-2xl font-bold text-dark mb-2">
          Ceník na školní rok 2026/2027
        </h2>
        <p className="text-dark/70 mb-6 leading-relaxed">
          Ceny docházky jsou <strong>zakladatelské</strong> — sleva z běžného
          ceníku je v nich už odečtena a platí na celý první školní rok
          (2 dny v týdnu 2 730 Kč místo běžných 3 900 Kč, tedy −30 %; ostatní
          tarify −25 %). Za <strong>září a říjen 2026 se docházka nehradí</strong>;
          obědy a ostatní služby se hradí i v tomto období.
        </p>
        <div className="bg-white rounded-2xl overflow-hidden mb-6">
          <table className="w-full text-sm">
            <tbody>
              {CENIK.map((r) => (
                <tr key={r.item} className="border-b border-dark/5 last:border-0">
                  <td className="py-3 px-5 text-dark font-medium">{r.item}</td>
                  <td className="py-3 px-2 text-dark/60 hidden sm:table-cell">
                    {r.scope}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-dark whitespace-nowrap">
                    {r.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-dark/60 mb-14 leading-relaxed">
          Měsíční příspěvek se platí předem, splatnost do 25. dne předchozího
          měsíce (první za listopad 2026). Obědy a doplatky se účtují zpětně
          jedním vyúčtováním se splatností do 10. dne následujícího měsíce.
        </p>

        {/* Kontakt */}
        <div className="bg-forest-pale rounded-2xl p-6 sm:p-8">
          <p className="font-bold text-dark mb-2">Něco vám není jasné?</p>
          <p className="text-dark/70 leading-relaxed">
            Zeptejte se dřív, než cokoliv podepíšete — rádi to projdeme spolu.
            Ivan Jadrný,{" "}
            <a
              href="mailto:reditel@doucse.cz"
              className="text-orange hover:underline"
            >
              reditel@doucse.cz
            </a>
            ,{" "}
            <a href="tel:+420775917363" className="text-orange hover:underline">
              775 917 363
            </a>
            .
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-dark/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}
