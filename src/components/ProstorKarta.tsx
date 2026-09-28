"use client";

import Image from "next/image";
import { useState } from "react";

export type Prostor = {
  title: string;
  desc: string;
  /** první fotka je hlavní, ostatní jdou pod ni jako náhledy */
  fotky: { src: string; alt: string }[];
};

/** Karta prostoru s několika fotkami — kliknutím na náhled se vymění velká fotka. */
export default function ProstorKarta({ prostor }: { prostor: Prostor }) {
  const [aktivni, setAktivni] = useState(0);
  const hlavni = prostor.fotky[aktivni] ?? prostor.fotky[0];

  return (
    <div className="group reveal bg-white text-dark rounded-[1.75rem] overflow-hidden shadow-lift flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-beige">
        {/* key = při výměně fotky se nový snímek jemně prolne */}
        <Image
          key={hlavni.src}
          src={hlavni.src}
          alt={hlavni.alt}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 85vw"
          className="fade-in object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-dark/35 to-transparent" />
        {prostor.fotky.length > 1 && (
          <div aria-hidden="true" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {prostor.fotky.map((f, i) => (
              <span
                key={f.src}
                className={`h-1.5 rounded-full bg-white transition-all duration-300 ${
                  i === aktivni ? "w-5 opacity-100" : "w-1.5 opacity-60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {prostor.fotky.length > 1 && (
        // náhledy se zalamují (žádný vnořený vodorovný posun uvnitř posuvného řádku karet)
        <div className="flex flex-wrap gap-1.5 px-3 pt-3">
          {prostor.fotky.map((f, i) => (
            <button
              key={f.src}
              onClick={() => setAktivni(i)}
              aria-label={`Zobrazit fotku: ${f.alt}`}
              className={`relative h-11 w-14 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-white transition ${
                i === aktivni ? "ring-orange scale-105" : "ring-transparent opacity-70 hover:opacity-100 hover:ring-dark/15"
              }`}
            >
              <Image src={f.src} alt="" width={128} height={96} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="p-5 sm:p-6 pt-4">
        <h3 className="text-lg sm:text-xl font-bold text-dark mb-1.5 leading-snug">{prostor.title}</h3>
        <p className="text-sm text-brown leading-relaxed">{prostor.desc}</p>
      </div>
    </div>
  );
}
