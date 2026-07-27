import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProhlidkyForm from "@/components/ProhlidkyForm";

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

export default function ProhlidkyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-20 sm:pt-24 pb-16 bg-beige">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center mb-10">
            <p className="text-orange font-semibold text-sm tracking-wide uppercase mb-3">
              Individuální prohlídky areálu
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
              Přijďte se podívat na farmu
            </h1>
            <p className="text-base sm:text-lg text-brown leading-relaxed">
              Pomalu otevíráme dveře BIO farmy Fořt rodinám, které uvažují,
              že by jejich děti mohly být součástí našeho klubu. Prohlídky
              děláme <strong>individuálně</strong>{" "}— napište nám termíny, které
              by vám vyhovovaly, a&nbsp;my se vám ozveme a&nbsp;domluvíme
              konkrétní čas. Přijďte klidně i&nbsp;s&nbsp;dětmi.
            </p>
          </div>

          {/* Info card */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <h2 className="text-lg font-bold text-dark mb-3">Jak to bude vypadat?</h2>
            <ul className="space-y-2 text-brown text-sm">
              <li className="flex gap-2.5">
                <span className="text-forest font-bold mt-0.5">•</span>
                <span>
                  Prohlídku domlouváme <strong>individuálně</strong>. Provedeme vás
                  areálem, ukážeme zázemí a&nbsp;v&nbsp;klidu zodpovíme vaše otázky.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-forest font-bold mt-0.5">•</span>
                <span>
                  Ve formuláři níže navrhněte <strong>termíny, které vám vyhovují</strong>
                  {" "}(do&nbsp;konce srpna). Ozveme se vám s&nbsp;konkrétním návrhem.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-forest font-bold mt-0.5">•</span>
                <span>
                  Máte raději telefon? Zavolejte na{" "}
                  <a
                    href="tel:+420775917363"
                    className="text-forest font-semibold hover:underline"
                  >
                    775 917 363
                  </a>{" "}
                  nebo napište na{" "}
                  <a
                    href="mailto:reditel@doucse.cz"
                    className="text-forest font-semibold hover:underline"
                  >
                    reditel@doucse.cz
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-forest font-bold mt-0.5">•</span>
                <span>
                  Adresa:{" "}
                  <strong>Fořt 29, 543 44 Černý Důl – Rudník u&nbsp;Vrchlabí</strong>.
                </span>
              </li>
            </ul>
          </div>

          {/* Form */}
          <ProhlidkyForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
