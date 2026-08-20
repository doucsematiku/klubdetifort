"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * Menu drží jen pár položek — sekce hlavní stránky jsou schované
 * v rozbalovací nabídce „O klubíku", ať se lišta dá přečíst jedním pohledem.
 */
const O_KLUBIKU = [
  { label: "O nás", href: "/#o-nas" },
  { label: "Program", href: "/#program" },
  { label: "Zázemí", href: "/#zazemi" },
  { label: "Aktivity", href: "/#aktivity" },
  { label: "Pro rodiče", href: "/#pro-rodice" },
  { label: "Spolupráce", href: "/#spoluprace" },
];

const FOTKY = [
  { label: "Galerie", href: "/galerie" },
  { label: "Proběhlé akce", href: "/probehle-akce" },
];

/** Rozbalovací položka — otevírá se najetím myší i klávesnicí (focus). */
function Dropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div className="relative group">
      <button
        type="button"
        className="flex items-center gap-1 text-dark text-sm font-medium hover:text-forest transition-colors py-2"
        aria-haspopup="true"
      >
        {label}
        <svg className="w-3.5 h-3.5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* pt-2 dělá můstek mezi tlačítkem a panelem, ať nabídka nezmizí cestou */}
      <div className="absolute left-0 top-full pt-2 hidden group-hover:block group-focus-within:block">
        <div className="min-w-44 rounded-2xl bg-white shadow-lg ring-1 ring-dark/10 py-2">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="block px-4 py-2 text-sm text-dark hover:bg-beige hover:text-forest transition-colors"
            >
              {it.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-beige-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
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
          </Link>

          {/* Desktop nav — 4 položky + 2 tlačítka */}
          <nav className="hidden lg:flex items-center gap-5">
            <Dropdown label="O klubíku" items={O_KLUBIKU} />
            <Link
              href="/prespavky"
              className="text-dark text-sm font-bold hover:text-forest transition-colors whitespace-nowrap"
            >
              Přespávačky
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-1.5 py-0.5 align-middle">
                nové
              </span>
            </Link>
            <Link
              href="/pruvodkyne"
              className="text-dark text-sm font-medium hover:text-forest transition-colors"
            >
              Průvodkyně
            </Link>
            <Dropdown label="Fotky" items={FOTKY} />
            <a
              href="/#kontakt"
              className="text-dark text-sm font-medium hover:text-forest transition-colors"
            >
              Kontakt
            </a>
            <Link
              href="/prohlidky"
              className="border-2 border-forest text-forest hover:bg-forest hover:text-white font-semibold px-4 py-2 rounded-full transition-colors text-sm"
            >
              Domluvit prohlídku
            </Link>
            <Link
              href="/#kontakt"
              className="bg-orange hover:bg-orange-hover text-dark font-semibold px-5 py-2.5 rounded-full transition-colors text-sm"
            >
              Mám zájem
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-dark"
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

      {/* upozornění na plnící se kapacitu — přilepené pod lištou */}
      <a
        href="/#kontakt"
        className="block bg-forest text-white text-center text-xs sm:text-sm font-semibold px-4 py-2 hover:bg-forest-light transition-colors"
      >
        Kapacita klubíku je téměř plná — přijímáme poslední děti. Máte zájem?
        Neváhejte a ozvěte se nám ještě dnes&nbsp;→
      </a>

      {/* Mobile menu — stejné skupiny jako na počítači */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-beige-dark max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-brown-light pt-1 pb-2">
              O klubíku
            </p>
            {O_KLUBIKU.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-dark font-medium py-2 hover:text-forest transition-colors"
              >
                {link.label}
              </a>
            ))}

            <p className="text-xs font-semibold uppercase tracking-wider text-brown-light pt-4 pb-2 border-t border-beige-dark mt-3">
              Poznejte nás
            </p>
            <Link
              href="/prespavky"
              onClick={() => setMobileOpen(false)}
              className="text-dark font-bold py-2 hover:text-forest transition-colors"
            >
              Přespávačky
              <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-1.5 py-0.5 align-middle">
                nové
              </span>
            </Link>
            <Link
              href="/pruvodkyne"
              onClick={() => setMobileOpen(false)}
              className="text-dark font-medium py-2 hover:text-forest transition-colors"
            >
              Průvodkyně
            </Link>
            {FOTKY.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-dark font-medium py-2 hover:text-forest transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <a
              href="/#kontakt"
              onClick={() => setMobileOpen(false)}
              className="text-dark font-medium py-2 hover:text-forest transition-colors border-t border-beige-dark mt-3 pt-4"
            >
              Kontakt
            </a>

            <Link
              href="/prohlidky"
              onClick={() => setMobileOpen(false)}
              className="border-2 border-forest text-forest font-semibold px-6 py-3 rounded-full transition-colors text-center mt-3"
            >
              Domluvit prohlídku
            </Link>
            <Link
              href="/#kontakt"
              onClick={() => setMobileOpen(false)}
              className="bg-orange hover:bg-orange-hover text-dark font-semibold px-6 py-3 rounded-full transition-colors text-center mt-2"
            >
              Mám zájem
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
