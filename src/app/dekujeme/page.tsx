import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/Footer";
import ConversionEvent from "@/components/ConversionEvent";

export const metadata: Metadata = {
  title: "Děkujeme za váš zájem | Vzdělávací klub Farma Fořt",
  description: "Vaši zprávu jsme přijali. Brzy se vám ozveme.",
  robots: { index: false, follow: false },
};

export default function DekujemePage() {
  return (
    <>
      <ConversionEvent />

      <main className="flex-1 flex items-center justify-center min-h-screen bg-beige">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          {/* Logo */}
          <Link href="/" className="inline-block mb-8">
            <Image
              src="/images/logo_fort.png"
              alt="Vzdělávací klub Farma Fořt"
              width={80}
              height={80}
              className="rounded-xl mx-auto"
            />
          </Link>

          {/* Success icon */}
          <div className="w-20 h-20 bg-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-forest mb-4">
            Děkujeme za váš zájem!
          </h1>

          <p className="text-lg text-brown leading-relaxed mb-3">
            Vaši zprávu jsme přijali a brzy se vám ozveme.
          </p>

          <p className="text-brown-light leading-relaxed mb-8">
            Potvrzení jsme vám poslali na e-mail. Pokud máte jakékoliv dotazy,
            neváhejte nám zavolat na{" "}
            <a
              href="tel:+420775917363"
              className="text-forest font-semibold hover:underline"
            >
              775 917 363
            </a>{" "}
            nebo napsat na{" "}
            <a
              href="mailto:reditel@doucse.cz"
              className="text-forest font-semibold hover:underline"
            >
              reditel@doucse.cz
            </a>
            .
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-forest hover:bg-forest-light text-white font-bold px-8 py-4 rounded-full transition-colors"
            >
              Zpět na hlavní stránku
            </Link>
            <a
              href="https://facebook.com/klubdetifarmafort"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-beige-dark text-dark font-bold px-8 py-4 rounded-full transition-colors border border-beige-dark"
            >
              Sledujte nás na Facebooku
            </a>
            <a
              href="https://www.instagram.com/klub_deti_farma_fort/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-beige-dark text-dark font-bold px-8 py-4 rounded-full transition-colors border border-beige-dark"
            >
              Sledujte nás na Instagramu
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
