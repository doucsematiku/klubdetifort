"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Expand } from "lucide-react";

/**
 * Galerie s prokliknutím na velkou fotku. Bez knihoven — stačí overlay,
 * šipky a zavření Escapem.
 *
 * Mřížka je „masonry" přes CSS sloupce: každá fotka má svůj přirozený
 * poměr stran (na šířku / na výšku), takže vzniknou různě vysoké dlaždice
 * bez ořezu. Na telefonu dva sloupce, na počítači tři až čtyři.
 */
export default function Galerie({
  fotky,
}: {
  /** `naSirku` = fotka na šířku (4 : 3), jinak na výšku (3 : 4) */
  fotky: { src: string; alt: string; naSirku?: boolean }[];
}) {
  const [otevrena, setOtevrena] = useState<number | null>(null);

  useEffect(() => {
    if (otevrena === null) return;
    const klavesa = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOtevrena(null);
      if (e.key === "ArrowRight") setOtevrena((i) => (i === null ? i : (i + 1) % fotky.length));
      if (e.key === "ArrowLeft")
        setOtevrena((i) => (i === null ? i : (i - 1 + fotky.length) % fotky.length));
    };
    window.addEventListener("keydown", klavesa);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", klavesa);
      document.body.style.overflow = "";
    };
  }, [otevrena, fotky.length]);

  return (
    <>
      <div className="columns-2 gap-3 sm:gap-4 lg:columns-3 xl:columns-4">
        {fotky.map((f, i) => (
          <div key={f.src} className="reveal mb-3 break-inside-avoid sm:mb-4">
            <button
              onClick={() => setOtevrena(i)}
              className={`group relative block w-full overflow-hidden rounded-[1.25rem] bg-beige-dark shadow-soft ring-1 ring-dark/5 transition duration-500 hover:shadow-lift sm:rounded-[1.6rem] ${
                i % 4 === 1 ? "hover:rotate-[0.8deg]" : i % 4 === 3 ? "hover:-rotate-[0.8deg]" : "hover:-translate-y-1"
              }`}
              aria-label={`Zvětšit fotku: ${f.alt}`}
            >
              <Image
                src={f.src}
                alt={f.alt}
                width={f.naSirku ? 1600 : 1200}
                height={f.naSirku ? 1200 : 1600}
                sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, 50vw"
                className="block h-auto w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* jemné ztmavení a ikonka „zvětšit" při najetí — jen dekorace */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest-deep/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-white/85 text-forest opacity-0 shadow-soft backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
              >
                <Expand className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>
          </div>
        ))}
      </div>

      {otevrena !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/85 p-4 backdrop-blur-xl transition-opacity duration-300 starting:opacity-0 sm:p-10"
          onClick={() => setOtevrena(null)}
        >
          <div aria-hidden="true" className="dot-grid pointer-events-none absolute inset-0 opacity-60" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange/20 blur-3xl" />
          <button
            onClick={() => setOtevrena(null)}
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 hover:ring-white/60 active:scale-95 sm:right-6 sm:top-6"
            aria-label="Zavřít"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOtevrena((i) => (i === null ? i : (i - 1 + fotky.length) % fotky.length));
            }}
            className="absolute bottom-6 left-[calc(50%-4.25rem)] z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 pb-1 text-4xl leading-none text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 hover:ring-white/60 active:scale-95 sm:bottom-auto sm:left-6"
            aria-label="Předchozí"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOtevrena((i) => (i === null ? i : (i + 1) % fotky.length));
            }}
            className="absolute bottom-6 right-[calc(50%-4.25rem)] z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/10 pb-1 text-4xl leading-none text-white ring-1 ring-white/25 backdrop-blur-md transition hover:bg-white/25 hover:ring-white/60 active:scale-95 sm:bottom-auto sm:right-6"
            aria-label="Další"
          >
            ›
          </button>
          <Image
            key={fotky[otevrena].src}
            src={fotky[otevrena].src}
            alt={fotky[otevrena].alt}
            width={fotky[otevrena].naSirku ? 1600 : 1200}
            height={fotky[otevrena].naSirku ? 1200 : 1600}
            sizes="(min-width: 640px) 85vw, 100vw"
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[calc(100svh-11rem)] w-auto max-w-full rounded-[1.5rem] object-contain shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] ring-1 ring-white/15 transition duration-500 ease-out starting:scale-95 starting:opacity-0 sm:max-h-[85vh] sm:max-w-[calc(100%-9rem)]"
          />
        </div>
      )}
    </>
  );
}
