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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow flex flex-col">
      <Image
        src={hlavni.src}
        alt={hlavni.alt}
        width={640}
        height={420}
        className="w-full h-48 object-cover"
      />

      {prostor.fotky.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto p-1.5 bg-beige/60">
          {prostor.fotky.map((f, i) => (
            <button
              key={f.src}
              onClick={() => setAktivni(i)}
              aria-label={`Zobrazit fotku: ${f.alt}`}
              className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition ${
                i === aktivni ? "ring-orange" : "ring-transparent hover:ring-dark/20"
              }`}
            >
              <Image src={f.src} alt="" width={128} height={96} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="p-5">
        <h3 className="font-bold text-dark mb-1">{prostor.title}</h3>
        <p className="text-sm text-brown leading-relaxed">{prostor.desc}</p>
      </div>
    </div>
  );
}
