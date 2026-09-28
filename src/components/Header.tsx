"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  { label: "Ze života klubíku", href: "/ze-zivota-klubiku" },
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
        className="flex items-center gap-1 rounded-full px-3 py-2 text-dark text-sm font-semibold hover:bg-white/80 hover:text-forest transition-colors"
        aria-haspopup="true"
      >
        {label}
        <svg className="w-3.5 h-3.5 mt-0.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {/* pt-2 dělá můstek mezi tlačítkem a panelem, ať nabídka nezmizí cestou */}
      <div className="absolute left-0 top-full pt-2 invisible opacity-0 translate-y-1 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0">
        <div className="min-w-52 rounded-3xl bg-white/95 backdrop-blur-xl shadow-lift ring-1 ring-dark/5 p-2">
          {items.map((it) => (
            <a
              key={it.href}
              href={it.href}
              className="flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-dark hover:bg-forest-pale hover:text-forest transition-colors"
            >
              {it.label}
              <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-forest/40" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [skryta, setSkryta] = useState(false);
  const [odscrollovano, setOdscrollovano] = useState(false);
  const posledniY = useRef(0);

  // Při scrollu dolů se hlavička schová (víc místa na telefonu),
  // při scrollu nahoru se hned vrátí.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOdscrollovano(y > 12);
      const rozdil = y - posledniY.current;
      if (y < 160) setSkryta(false);
      else if (rozdil > 6) setSkryta(true);
      else if (rozdil < -6) setSkryta(false);
      posledniY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // otevřené menu zamkne stránku pod sebou
  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [mobileOpen]);

  const zavri = () => setMobileOpen(false);

  return (
    <header
      data-skryta={skryta && !mobileOpen ? "ano" : "ne"}
      className="site-header fixed top-0 left-0 right-0 z-50"
    >
      <div
        className={`backdrop-blur-xl transition-colors duration-300 ${
          odscrollovano || mobileOpen
            ? "bg-cream/95 shadow-[0_8px_30px_-18px_rgb(58_54_45/0.35)]"
            : "bg-cream/85"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3" onClick={zavri}>
              <span className="relative inline-flex">
                <Image
                  src="/images/logo_fort.png"
                  alt="Vzdělávací klub Farma Fořt"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white ring-1 ring-dark/5 shadow-sm transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
                />
              </span>
              <div className="leading-none">
                <span className="font-display text-forest font-extrabold text-[1.05rem] sm:text-lg tracking-tight block">
                  Farma Fořt
                </span>
                <span className="font-hand text-brown-light text-lg hidden sm:block -mt-0.5">
                  vzdělávací klub
                </span>
              </div>
            </Link>

            {/* Desktop nav — 4 položky + 2 tlačítka */}
            <nav className="hidden lg:flex items-center gap-1">
              <Dropdown label="O klubíku" items={O_KLUBIKU} />
              <Link
                href="/prespavky"
                className="rounded-full px-3 py-2 text-dark text-sm font-bold hover:bg-white/80 hover:text-forest transition-colors whitespace-nowrap"
              >
                Přespávačky
                <span className="ml-1.5 text-[10px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-1.5 py-0.5 align-middle">
                  nové
                </span>
              </Link>
              <Link
                href="/pruvodkyne"
                className="rounded-full px-3 py-2 text-dark text-sm font-semibold hover:bg-white/80 hover:text-forest transition-colors"
              >
                Průvodkyně
              </Link>
              <Dropdown label="Fotky" items={FOTKY} />
              <a
                href="/#kontakt"
                className="rounded-full px-3 py-2 text-dark text-sm font-semibold hover:bg-white/80 hover:text-forest transition-colors"
              >
                Kontakt
              </a>
              <Link
                href="/prohlidky"
                className="ml-2 border-2 border-forest text-forest hover:bg-forest hover:text-white font-semibold px-4 py-2 rounded-full transition-colors text-sm"
              >
                Domluvit prohlídku
              </Link>
              <Link
                href="/#kontakt"
                className="btn-shine ml-1 bg-orange hover:bg-orange-hover text-dark font-bold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 shadow-glow text-sm"
              >
                Mám zájem
              </Link>
            </nav>

            {/* Mobile toggle — tři čárky se přetočí na křížek */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative w-11 h-11 -mr-1.5 rounded-full text-dark hover:bg-white/80 transition-colors"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <span aria-hidden="true" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-4">
                <span
                  className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "top-[7px] rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-0.5 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "w-0 opacity-0" : "w-4 opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-0.5 w-6 rounded-full bg-current transition-all duration-300 ${
                    mobileOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* upozornění na plnící se kapacitu — přilepené pod lištou */}
      <a
        href="/#kontakt"
        className="group flex items-center justify-center gap-2.5 bg-forest text-white text-center text-xs sm:text-sm font-semibold px-4 py-2 hover:bg-forest-light transition-colors"
      >
        <span className="live-dot" aria-hidden="true" />
        <span>
          Kapacita klubíku je téměř plná — přijímáme poslední děti. Máte zájem?
          Neváhejte a ozvěte se nám ještě dnes&nbsp;→
        </span>
      </a>

      {/* Mobile menu — stejné skupiny jako na počítači */}
      {mobileOpen && (
        <div className="lg:hidden bg-cream border-t border-beige-dark max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain shadow-lift">
          <nav className="max-w-7xl mx-auto px-4 pt-4 pb-8 flex flex-col">
            <p className="hero-in eyebrow text-brown-light pt-1 pb-2">
              O klubíku
            </p>
            <div className="grid grid-cols-2 gap-2">
              {O_KLUBIKU.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={zavri}
                  style={{ animationDelay: `${40 + i * 30}ms` }}
                  className="hero-in rounded-2xl bg-white px-4 py-3.5 font-display text-[1.05rem] font-semibold text-dark shadow-soft active:scale-[0.98] hover:text-forest transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="hero-in eyebrow text-brown-light pt-6 pb-2 [animation-delay:220ms]">
              Poznejte nás
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/prespavky"
                onClick={zavri}
                className="hero-in [animation-delay:250ms] flex items-center justify-between rounded-2xl bg-night px-4 py-3.5 font-display text-[1.05rem] font-bold text-white shadow-soft"
              >
                <span>
                  Přespávačky
                  <span className="ml-1.5 text-[10px] font-sans font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-1.5 py-0.5 align-middle">
                    nové
                  </span>
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-orange" />
              </Link>
              <Link
                href="/pruvodkyne"
                onClick={zavri}
                className="hero-in [animation-delay:280ms] flex items-center justify-between rounded-2xl bg-white px-4 py-3.5 font-display text-[1.05rem] font-semibold text-dark shadow-soft"
              >
                Průvodkyně
                <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-forest/40" />
              </Link>
              <div className="grid grid-cols-3 gap-2">
                {FOTKY.map((link, i) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={zavri}
                    style={{ animationDelay: `${310 + i * 30}ms` }}
                    className="hero-in flex items-center rounded-2xl bg-white px-3 py-3 text-sm font-semibold leading-tight text-dark shadow-soft"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <a
              href="/#kontakt"
              onClick={zavri}
              className="hero-in [animation-delay:400ms] mt-6 font-display text-lg font-semibold text-dark py-2 hover:text-forest transition-colors border-t border-beige-dark pt-5"
            >
              Kontakt
            </a>

            <div className="hero-in [animation-delay:440ms] grid grid-cols-1 gap-2.5 mt-3">
              <Link
                href="/prohlidky"
                onClick={zavri}
                className="btn btn-outline"
              >
                Domluvit prohlídku
              </Link>
              <Link
                href="/#kontakt"
                onClick={zavri}
                className="btn btn-sun btn-shine"
              >
                Mám zájem
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
