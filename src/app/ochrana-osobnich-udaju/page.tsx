import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů | Klub Fořt",
  description:
    "Zásady ochrany osobních údajů vzdělávacího klubu na BIO farmě Fořt.",
};

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Ochrana osobních údajů
          </h1>
          <p className="mt-3 text-white/60 text-sm">
            Poslední aktualizace: 3. dubna 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="prose prose-lg max-w-none space-y-10 text-dark/80">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              1. Správce osobních údajů
            </h2>
            <p>
              Správcem osobních údajů je{" "}
              <strong>Vzdělávací centrum Doučse z.s.</strong>, IČO: 22201581, se
              sídlem Fořt 29, 543 44 Černý Důl – Rudník u Vrchlabí (dále jen
              &ldquo;Správce&rdquo;).
            </p>
            <p>
              Kontakt pro záležitosti ochrany osobních údajů:{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-orange hover:underline"
              >
                reditel@doucse.cz
              </a>
              , tel.{" "}
              <a
                href="tel:+420775917363"
                className="text-orange hover:underline"
              >
                775 917 363
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              2. Jaké údaje zpracováváme
            </h2>
            <p>V rámci provozu webových stránek a kontaktních formulářů můžeme zpracovávat:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Jméno a příjmení</li>
              <li>E-mailovou adresu</li>
              <li>Telefonní číslo</li>
              <li>Informace o dítěti (věk, ročník, vzdělávací potřeby)</li>
              <li>Další údaje, které nám dobrovolně sdělíte prostřednictvím formuláře</li>
            </ul>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              3. Účel a právní základ zpracování
            </h2>
            <p>Vaše údaje zpracováváme za těmito účely:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>
                <strong>Odpověď na váš dotaz</strong> – právní základ: oprávněný
                zájem (čl. 6 odst. 1 písm. f) GDPR)
              </li>
              <li>
                <strong>Registrace zájmu o vzdělávací klub</strong> – právní
                základ: plnění smlouvy / opatření před uzavřením smlouvy (čl. 6
                odst. 1 písm. b) GDPR)
              </li>
              <li>
                <strong>Zasílání informací o klubu</strong> – právní základ: váš
                souhlas (čl. 6 odst. 1 písm. a) GDPR), který můžete kdykoli
                odvolat
              </li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              4. Doba zpracování
            </h2>
            <p>
              Vaše osobní údaje uchováváme po dobu nezbytnou k naplnění účelu
              zpracování, nejdéle však <strong>3 roky</strong> od posledního
              kontaktu, pokud neexistuje jiný právní důvod pro jejich
              uchovávání.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              5. Příjemci údajů
            </h2>
            <p>
              Vaše údaje neprodáváme ani nepředáváme třetím stranám za účelem
              marketingu. Ke zpracování využíváme tyto nástroje:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Google Workspace (e-mail, formuláře)</li>
              <li>Meta / Facebook (lead formuláře, reklama)</li>
              <li>Vercel (hosting webových stránek)</li>
            </ul>
            <p className="mt-2">
              Tito zpracovatelé jsou vázáni vlastními podmínkami ochrany údajů
              v souladu s GDPR.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              6. Vaše práva
            </h2>
            <p>Máte právo:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Na přístup ke svým osobním údajům</li>
              <li>Na opravu nepřesných údajů</li>
              <li>Na výmaz údajů (&ldquo;právo být zapomenut&rdquo;)</li>
              <li>Na omezení zpracování</li>
              <li>Na přenositelnost údajů</li>
              <li>Vznést námitku proti zpracování</li>
              <li>Odvolat udělený souhlas</li>
              <li>
                Podat stížnost u Úřadu pro ochranu osobních údajů (
                <a
                  href="https://www.uoou.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  www.uoou.cz
                </a>
                )
              </li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              7. Cookies a analytika
            </h2>
            <p>
              Web používá službu Google Analytics ke sledování anonymní
              návštěvnosti. Více o tom, jak Google zpracovává data, se dočtete
              na{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:underline"
              >
                stránkách Google
              </a>
              .
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-dark mb-3">
              8. Kontakt
            </h2>
            <p>
              S jakýmkoli dotazem ohledně zpracování osobních údajů se na nás
              můžete obrátit na{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-orange hover:underline"
              >
                reditel@doucse.cz
              </a>{" "}
              nebo telefonicky na{" "}
              <a
                href="tel:+420775917363"
                className="text-orange hover:underline"
              >
                775 917 363
              </a>
              .
            </p>
          </section>
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
