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
              <div className="flex items-center gap-4 mt-3">
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
                <a
                  href="https://www.instagram.com/klub_deti_farma_fort/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-orange transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  Instagram
                </a>
              </div>
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
