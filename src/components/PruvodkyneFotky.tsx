import Image from "next/image";
import { Heart, Sparkles, Sprout } from "lucide-react";
import type { Fotka } from "@/lib/medailonky";

/**
 * Kompozice portrétů průvodkyně v kartě medailonku.
 *
 * Přizpůsobí se počtu fotek: jedna fotka stojí uprostřed na „oběžné
 * dráze" se sluncem, dvě se překrývají (velký portrét + polaroid).
 * Všechno kolem fotek je jen dekorace bez textu (aria-hidden).
 * Popisky fotek (alt) zůstávají stejné jako dřív: „jméno — popis".
 */

/** Tečkovaná oběžná dráha s „planetkami" — pomalu se otáčí. */
function Orbita({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 200 200"
      className={`pointer-events-none absolute spin-slow ${className}`}
    >
      <circle
        cx="100"
        cy="100"
        r="95"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="0.1 8"
      />
      <circle cx="100" cy="5" r="5.5" fill="#FFB72B" />
      <circle cx="12" cy="140" r="3.5" fill="#2D5A27" />
      <circle cx="190" cy="128" r="2.5" fill="#9CB77F" />
    </svg>
  );
}

export default function PruvodkyneFotky({
  jmeno,
  fotky,
  ton,
}: {
  jmeno: string;
  fotky: Fotka[];
  /** barva plochy za fotkami — podle ní se ladí dekorace */
  ton: "forest" | "sun";
}) {
  const [hlavni, ...dalsi] = fotky;
  if (!hlavni) return null;
  const druha = dalsi[0];
  const orbita = ton === "sun" ? "text-brown/30" : "text-forest/30";

  // ── jedna fotka: portrét uprostřed dráhy, slunce za ním ──
  if (!druha) {
    return (
      <div className="relative mx-auto aspect-square w-full max-w-[25rem]">
        <Orbita className={`inset-[1%] ${orbita}`} />
        <div
          aria-hidden="true"
          className="absolute right-[7%] top-[7%] h-[34%] w-[34%] rounded-full bg-orange shadow-glow"
        />
        <div
          aria-hidden="true"
          className="absolute left-[4%] bottom-[8%] h-[40%] w-[40%] rounded-full bg-white/50 blur-2xl"
        />
        <div className="absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 -rotate-[3deg]">
          <div className="blob-2 relative aspect-[4/5] overflow-hidden shadow-lift ring-[6px] ring-white">
            <Image
              src={hlavni.src}
              alt={`${jmeno} — ${hlavni.popis}`}
              fill
              sizes="(min-width: 1024px) 18rem, 64vw"
              loading="eager"
              style={hlavni.pozice ? { objectPosition: hlavni.pozice } : undefined}
              className="object-cover object-top transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>
        <span
          aria-hidden="true"
          className="icon-bubble absolute left-[6%] top-[14%] rotate-[-10deg] bg-white text-forest shadow-soft"
        >
          <Sprout className="h-6 w-6" />
        </span>
        <span
          aria-hidden="true"
          className="float-slow absolute bottom-[9%] right-[6%] flex h-12 w-12 items-center justify-center rounded-full bg-forest text-white shadow-lift"
        >
          <Heart className="h-5 w-5" fill="currentColor" />
        </span>
        <Sparkles
          aria-hidden="true"
          className="absolute bottom-[20%] left-[9%] h-7 w-7 text-orange"
        />
      </div>
    );
  }

  // ── dvě (a víc) fotek: velký portrét + polaroid přes roh ──
  return (
    <div className="relative mx-auto aspect-[1/1.05] w-full max-w-[25rem]">
      <Orbita className={`inset-[2%] ${orbita}`} />
      <div
        aria-hidden="true"
        className="absolute right-[6%] top-[9%] h-[42%] w-[42%] rounded-full bg-orange/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute left-[2%] bottom-[16%] h-[17%] w-[17%] rounded-full bg-orange shadow-glow"
      />
      <div className="absolute left-[7%] top-[4%] w-[60%] -rotate-[2deg]">
        <div className="blob relative aspect-[4/5] overflow-hidden shadow-lift ring-[6px] ring-white">
          <Image
            src={hlavni.src}
            alt={`${jmeno} — ${hlavni.popis}`}
            fill
            sizes="(min-width: 1024px) 16rem, 60vw"
            loading="eager"
            style={hlavni.pozice ? { objectPosition: hlavni.pozice } : undefined}
            className="object-cover object-top transition duration-700 group-hover:scale-105"
          />
        </div>
      </div>
      {dalsi.map((f, i) => (
        <div
          key={f.src}
          className={`float-slow absolute right-[2%] w-[56%] ${
            i === 0 ? "bottom-[5%]" : "top-[2%] w-[36%] [animation-delay:2s]"
          }`}
        >
          <div className={`polaroid ${i === 0 ? "rotate-[5deg]" : "-rotate-[6deg]"}`}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[0.35rem]">
              <Image
                src={f.src}
                alt={`${jmeno} — ${f.popis}`}
                fill
                sizes="(min-width: 1024px) 14rem, 56vw"
                loading="eager"
                style={f.pozice ? { objectPosition: f.pozice } : undefined}
                className="object-cover object-top transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      ))}
      <span
        aria-hidden="true"
        className="icon-bubble absolute right-[8%] top-[6%] rotate-[8deg] bg-sun text-brown shadow-soft"
      >
        <Sprout className="h-6 w-6" />
      </span>
      <Sparkles
        aria-hidden="true"
        className="absolute left-[1%] top-[6%] h-6 w-6 text-orange"
      />
    </div>
  );
}
