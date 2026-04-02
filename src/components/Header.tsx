"use client";

import { useState } from "react";
import Image from "next/image";

const navLinks = [
  { label: "O nás", href: "#o-nas" },
  { label: "Program", href: "#program" },
  { label: "Zázemí", href: "#zazemi" },
  { label: "Aktivity", href: "#aktivity" },
  { label: "Pro rodiče", href: "#pro-rodice" },
  { label: "Spolupráce", href: "#spoluprace" },
  { label: "Kontakt", href: "#kontakt" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-beige-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <Image
              src="/images/logo_fort.png"
              alt="Vzdělávací klub Farma Fořt"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg"
            />
            <div className="leading-tight">
              <span className="text-forest font-bold text-sm sm:text-base block">
                Farma Fořt
              </span>
              <span className="text-brown-light text-xs hidden sm:block">
                vzdělávací klub
              </span>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark text-sm font-medium hover:text-forest transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="bg-orange hover:bg-orange-hover text-dark font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
            >
              Mám zájem
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 text-dark"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-beige-dark">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-dark font-medium py-2 hover:text-forest transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setMobileOpen(false)}
              className="bg-orange hover:bg-orange-hover text-dark font-semibold px-6 py-3 rounded-full transition-colors text-center mt-2"
            >
              Mám zájem
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
