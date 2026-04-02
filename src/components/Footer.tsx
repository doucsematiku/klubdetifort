import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-dark text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo_fort.png"
                alt="Vzdělávací klub Farma Fořt"
                width={44}
                height={44}
                className="rounded-lg"
              />
              <span className="text-white font-bold text-lg">
                Farma Fořt
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">
              Komunitní vzdělávací klub na BIO farmě v Krkonoších.
              Pod záštitou Vzdělávacího centra Doučse z.s.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <div className="space-y-2 text-sm">
              <p>
                <a
                  href="tel:+420775917363"
                  className="hover:text-orange transition-colors"
                >
                  775 917 363
                </a>
              </p>
              <p>
                <a
                  href="mailto:reditel@doucse.cz"
                  className="hover:text-orange transition-colors"
                >
                  reditel@doucse.cz
                </a>
              </p>
              <p className="text-white/60">
                Fořt 29, 543 44<br />
                Černý Důl – Rudník u Vrchlabí
              </p>
              <p className="mt-3">
                <a
                  href="https://facebook.com/klubdetifarmafort"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-orange transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Na stránce</h3>
            <div className="space-y-2 text-sm">
              <p><a href="#o-nas" className="hover:text-orange transition-colors">O nás</a></p>
              <p><a href="#program" className="hover:text-orange transition-colors">Program</a></p>
              <p><a href="#zazemi" className="hover:text-orange transition-colors">Zázemí</a></p>
              <p><a href="#spoluprace" className="hover:text-orange transition-colors">Spolupráce</a></p>
              <p><a href="#kontakt" className="hover:text-orange transition-colors">Kontakt</a></p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            Vzdělávací centrum Doučse z.s. | IČO: 22201581
          </p>
          <p className="text-xs text-white/40">
            Nejsme školou ani registrovanou dětskou skupinou.
          </p>
        </div>
      </div>
    </footer>
  );
}
