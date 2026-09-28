import Image from "next/image";

/**
 * Nekonečný pás fotek (marquee) — živá výplň mezi sekcemi.
 * Jen dekorace: fotky jsou bez popisku (alt="") a pás je skrytý pro
 * čtečky, obsah se tím nemění. Pozastaví se najetím myší; kdo má
 * v systému omezené animace, uvidí pás stát.
 */
export default function FotoPas({
  fotky,
  vyska = "h-36 sm:h-48",
  className = "",
}: {
  fotky: string[];
  vyska?: string;
  className?: string;
}) {
  const stopa = (kopie: number) => (
    <div className="marquee-track" aria-hidden="true" key={kopie}>
      {fotky.map((src, i) => (
        <div
          key={src + kopie}
          className={`relative ${vyska} aspect-[4/5] shrink-0 overflow-hidden rounded-[1.25rem] ${
            i % 2 ? "rotate-[1.5deg] translate-y-2" : "-rotate-[1.5deg]"
          }`}
        >
          <Image src={src} alt="" fill sizes="200px" className="object-cover" />
        </div>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className={`marquee py-3 ${className}`}>
      {stopa(0)}
      {stopa(1)}
    </div>
  );
}
