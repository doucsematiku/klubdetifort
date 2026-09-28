"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Posuvný řádek karet pro telefon (třída .snap-row) s tečkami, které
 * ukazují, kolikátá karta je vidět. Od 640 px je z řádku obyčejná
 * mřížka a tečky zmizí — sloupce nastav přes `className`
 * (např. "sm:grid-cols-2 lg:grid-cols-3").
 */
export default function SnapRadek({
  children,
  className = "",
  tecky = "bg-forest",
}: {
  children: ReactNode;
  className?: string;
  /** barva teček (Tailwind třída pozadí) */
  tecky?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [aktivni, setAktivni] = useState(0);
  const pocet = Children.count(children);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const prvni = el.children[0] as HTMLElement | undefined;
      if (!prvni) return;
      const krok = prvni.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "0");
      const konec = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      setAktivni(konec ? pocet - 1 : Math.round(el.scrollLeft / Math.max(krok, 1)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [pocet]);

  return (
    <div>
      <div ref={ref} className={`snap-row ${className}`}>
        {children}
      </div>
      {pocet > 1 && (
        <div aria-hidden="true" className="sm:hidden flex justify-center gap-1.5 -mt-1">
          {Array.from({ length: pocet }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${tecky} ${
                i === aktivni ? "w-6 opacity-100" : "w-1.5 opacity-25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
