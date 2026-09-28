/**
 * Silueta krkonošského hřebene jako přechod mezi sekcemi.
 *
 * Barvu určuje `text-*` třída (kreslí se barvou `currentColor`) — dej
 * jí barvu sekce, do které hřeben „patří". Zadní vrstva je průhlednější,
 * takže vznikne hloubka dvou pásem hor. Čistě dekorace, bez textu.
 *
 *   <Hory className="text-forest" />               — hory stojí na spodní hraně
 *   <Hory className="text-cream" otocit />          — hory visí z horní hrany
 */
export default function Hory({
  className = "",
  otocit = false,
}: {
  className?: string;
  otocit?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      className={`block w-full h-8 sm:h-14 lg:h-20 pointer-events-none ${
        otocit ? "rotate-180" : ""
      } ${className}`}
    >
      <path
        fill="currentColor"
        opacity="0.45"
        d="M0 120V58c70-9 122-25 190-18 60 6 110 22 170 16s92-30 160-34c62-3 102 22 170 24 62 2 102-16 160-20 52-4 82-20 130-22 50-2 80 20 130 28 60 10 120 8 180 16 60 8 100 2 150 4v68Z"
      />
      <path
        fill="currentColor"
        d="M0 120V80c62-8 110-22 170-20 60 3 92 20 152 14 58-6 98-34 158-38 62-4 100 22 160 26 60 4 102-12 160-18 52-5 84-26 132-30l28-4c30 8 52 22 90 32 50 12 100 22 160 18 60-4 110 6 170 12 30 3 50 4 60 5v43Z"
      />
    </svg>
  );
}
