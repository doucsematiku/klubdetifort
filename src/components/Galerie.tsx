"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Galerie s prokliknutím na velkou fotku. Bez knihoven — stačí overlay,
 * šipky a zavření Escapem.
 */
export default function Galerie({
  fotky,
}: {
  fotky: { src: string; alt: string }[];
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {fotky.map((f, i) => (
          <button
            key={f.src}
            onClick={() => setOtevrena(i)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-beige-dark"
            aria-label={`Zvětšit fotku: ${f.alt}`}
          >
            <Image
              src={f.src}
              alt={f.alt}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {otevrena !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 p-4"
          onClick={() => setOtevrena(null)}
        >
          <button
            onClick={() => setOtevrena(null)}
            className="absolute right-4 top-4 rounded-full bg-white/15 px-4 py-2 text-white hover:bg-white/25"
            aria-label="Zavřít"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOtevrena((i) => (i === null ? i : (i - 1 + fotky.length) % fotky.length));
            }}
            className="absolute left-3 sm:left-6 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25"
            aria-label="Předchozí"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOtevrena((i) => (i === null ? i : (i + 1) % fotky.length));
            }}
            className="absolute right-3 sm:right-6 rounded-full bg-white/15 px-4 py-3 text-white hover:bg-white/25"
            aria-label="Další"
          >
            ›
          </button>
          <Image
            src={fotky[otevrena].src}
            alt={fotky[otevrena].alt}
            width={1600}
            height={1600}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] w-auto rounded-2xl object-contain"
          />
        </div>
      )}
    </>
  );
}
