import type { CSSProperties } from "react";

/**
 * Jiskry stoupající od večerního ohně (úvod stránky přespávaček).
 *
 * Čistě dekorace — bez textu, skrytá pro čtečky. Keyframes jsou tady,
 * ať se kvůli jedné stránce nesahá do globals.css. Kdo má v systému
 * omezené animace, jiskry neuvidí: globální pravidlo zkrátí animaci
 * na 0,01 ms a konečný stav je průhledný.
 */

/** [vlevo %, zdola %, velikost px, posun do strany px, výstup px, trvání s, zpoždění s] */
const JISKRY: [number, number, number, number, number, number, number][] = [
  [55, 4, 3, -40, -300, 4.6, 0],
  [70, 2, 4, -20, -360, 5.2, 0.8],
  [82, 6, 3, 25, -280, 4.1, 1.6],
  [64, 0, 2, -60, -240, 3.8, 2.3],
  [90, 3, 3, -15, -330, 5.6, 0.4],
  [76, 5, 2, 40, -260, 4.4, 3.1],
  [48, 2, 3, -30, -220, 4.9, 1.2],
  [86, 1, 4, -45, -380, 6, 2.7],
  [60, 7, 2, 20, -300, 5.1, 3.8],
  [95, 4, 2, -35, -250, 4.3, 1.9],
  [72, 0, 3, 10, -320, 5.4, 4.4],
  [80, 8, 2, -25, -200, 3.6, 0.2],
];

export default function PrespavkyJiskry({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <style>{`@keyframes prespavky-jiskra{0%{transform:translate3d(0,0,0) scale(1);opacity:0}12%{opacity:1}65%{opacity:.85}100%{transform:translate3d(var(--dx),var(--dy),0) scale(.2);opacity:0}}`}</style>
      {JISKRY.map(([x, y, s, dx, dy, trvani, zpozdeni], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-orange"
          style={
            {
              left: `${x}%`,
              bottom: `${y}%`,
              width: s,
              height: s,
              boxShadow: "0 0 6px 2px rgb(255 183 43 / 0.7)",
              "--dx": `${dx}px`,
              "--dy": `${dy}px`,
              animation: `prespavky-jiskra ${trvani}s ease-out ${zpozdeni}s infinite both`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
