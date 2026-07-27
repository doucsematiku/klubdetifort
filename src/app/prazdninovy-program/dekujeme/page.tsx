import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import PrazdninyConversionEvent from "@/components/PrazdninyConversionEvent";

export const metadata: Metadata = {
  title: "Rezervace přijata | Klub dětí Fořt — letní prázdniny",
  description: "Vaše rezervace na letní prázdninový program je přijata. Fakturu jste dostali e-mailem.",
  robots: { index: false, follow: false },
};

type SearchParams = {
  inv?: string;
  total?: string;
  days?: string;
  name?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const invoiceNumber = params.inv?.trim() || "";
  const totalKc = Number(params.total) || 0;
  const daysCount = Number(params.days) || 1;
  const parentName = params.name?.trim() || "";

  const daysLabel =
    daysCount === 1 ? "den" : daysCount > 1 && daysCount < 5 ? "dny" : "dní";

  const totalFormatted = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(totalKc);

  const fakturoidUrl = invoiceNumber
    ? `https://app.fakturoid.cz/vzdelavacicentrumdoucse/invoices/${invoiceNumber}`
    : null;

  return (
    <>
      <PrazdninyConversionEvent value={totalKc} />

      <main className="flex-1 bg-beige">
        <div className="max-w-2xl mx-auto px-4 py-12 sm:py-20">
          {/* Logo */}
          <Link href="/" className="inline-block mb-6">
            <Image
              src="/images/logo_fort.png"
              alt="Vzdělávací klub Farma Fořt"
              width={64}
              height={64}
              className="rounded-xl"
            />
          </Link>

          {/* Success icon + heading */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-forest rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-forest leading-tight">
              {parentName ? `Děkujeme, ${parentName}!` : "Děkujeme za rezervaci!"}
            </h1>
          </div>

          <p className="text-lg text-brown leading-relaxed mb-8">
            Vaše rezervace na <strong>letní prázdninový program</strong> Klubu
            dětí Fořt je přijata. Potvrzení i fakturu jsme vám právě poslali
            e-mailem.
          </p>

          {/* Shrnutí */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 ring-1 ring-beige-dark">
            <h2 className="font-bold text-dark text-lg mb-4">Shrnutí rezervace</h2>
            <dl className="space-y-3 text-sm sm:text-base">
              <div className="flex justify-between gap-4 border-b border-beige-dark pb-2">
                <dt className="text-brown-light">Počet dní</dt>
                <dd className="font-semibold text-dark">
                  {daysCount} {daysLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-beige-dark pb-2">
                <dt className="text-brown-light">Cena celkem</dt>
                <dd className="font-semibold text-dark">{totalFormatted}</dd>
              </div>
              {invoiceNumber && (
                <div className="flex justify-between gap-4">
                  <dt className="text-brown-light">Faktura</dt>
                  <dd className="font-semibold text-dark">{invoiceNumber}</dd>
                </div>
              )}
            </dl>
            {fakturoidUrl && (
              <a
                href={fakturoidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-forest hover:bg-forest-light text-white font-bold px-6 py-3 rounded-full transition-colors text-sm"
              >
                Otevřít fakturu ve Fakturoidu
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}
          </div>

          {/* Co s sebou */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 ring-1 ring-beige-dark">
            <h2 className="font-bold text-dark text-lg mb-4">Co s sebou</h2>
            <ul className="space-y-2 text-brown text-sm sm:text-base">
              {[
                "Oběd — připravený doma na cca 12:00 (svačinová krabička)",
                "Lahev vody nebo pití na celý den",
                "Pohodlné oblečení do přírody",
                "Pláštěnka pro případ deště",
                "Pokrývka hlavy + krém na opalování",
                "Náhradní triko (pro jistotu)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-forest-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-brown-light mt-4">
              Materiál na tvoření (dřevo, barvy, papír, kamínky…) máme my.
            </p>
          </div>

          {/* Kde a kdy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 mb-6 ring-1 ring-beige-dark">
            <h2 className="font-bold text-dark text-lg mb-4">Kde a kdy</h2>
            <div className="space-y-3 text-brown text-sm sm:text-base">
              <p>
                <strong className="text-dark">Začínáme v 9:00</strong>{" "}— přijďte
                klidně o pár minut dříve, ať se dítě stihne v klidu rozkoukat.
                Končíme v 13:00.
              </p>
              <p>
                <strong className="text-dark">BIO farma Fořt</strong>
                <br />
                Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí
              </p>
              <div className="flex gap-4 pt-2">
                <a
                  href="https://www.google.com/maps/search/Fořt+29,+543+44+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest text-sm font-semibold hover:underline"
                >
                  Google Maps →
                </a>
                <a
                  href="https://mapy.cz/zakladni?q=Fořt+29+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest text-sm font-semibold hover:underline"
                >
                  Mapy.cz →
                </a>
              </div>
            </div>
          </div>

          {/* Kontakt */}
          <p className="text-sm text-brown-light leading-relaxed mb-8">
            Něco se mění, máte dotaz nebo potřebujete fakturu upravit? Ozvěte se na{" "}
            <a href="mailto:reditel@doucse.cz" className="text-forest font-semibold">
              reditel@doucse.cz
            </a>{" "}
            nebo zavolejte na{" "}
            <a href="tel:+420775917363" className="text-forest font-semibold">
              775 917 363
            </a>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/prazdninovy-program"
              className="bg-orange hover:bg-orange-hover text-dark font-bold px-7 py-3.5 rounded-full transition-colors text-center"
            >
              Zpět na program
            </Link>
            <Link
              href="/"
              className="bg-white hover:bg-beige-dark text-dark font-semibold px-7 py-3.5 rounded-full transition-colors text-center border border-beige-dark"
            >
              Hlavní stránka
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
