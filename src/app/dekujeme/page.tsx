import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Leaf } from "lucide-react";
import Footer from "@/components/Footer";
import ConversionEvent from "@/components/ConversionEvent";

export const metadata: Metadata = {
  title: "Děkujeme za váš zájem | Vzdělávací klub Farma Fořt",
  description: "Vaši zprávu jsme přijali. Brzy se vám ozveme.",
  robots: { index: false, follow: false },
};

/*
  Radostné potvrzení: fajfka se „dokreslí", kolem vybuchnou konfety
  a lístky a zůstanou ležet jako věneček. Všechno jen CSS; když
  animace neproběhne (nebo má návštěvník omezený pohyb), je vidět
  rovnou konečný stav — fajfka nakreslená, konfety na místě.
*/
const ANIMACE = `
@keyframes dek-kresli { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
@keyframes dek-pop { 0% { transform: scale(.4); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes dek-vlna { 0% { transform: scale(.9); opacity: .55; } 100% { transform: scale(1.9); opacity: 0; } }
@keyframes dek-vybuch {
  0% { transform: translate(0, 0) rotate(0deg) scale(.3); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translate(var(--x), var(--y)) rotate(var(--r)) scale(1); opacity: 1; }
}
@keyframes dek-vznaset { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-6px) rotate(10deg); } }
@keyframes dek-padani {
  0% { transform: translate3d(0, -12vh, 0) rotate(0deg); }
  100% { transform: translate3d(var(--drift), 112vh, 0) rotate(var(--r)); }
}
.dek-kruh { animation: dek-pop .6s cubic-bezier(.2,.8,.2,1.2) both .1s; }
.dek-fajfka { animation: dek-kresli .55s ease-out both .5s; }
.dek-obrys { animation: dek-kresli 1s ease-out both .05s; }
.dek-vlna { animation: dek-vlna 1.4s ease-out both .55s; }
.dek-kus { animation: dek-vybuch 1.1s cubic-bezier(.15,.7,.25,1) both .75s; }
.dek-kus > * { animation: dek-vznaset 4.5s ease-in-out infinite 2s; }
.dek-list { animation: dek-padani linear infinite; }
`;

/** Konfety kolem fajfky — konečná pozice (x, y), natočení, tvar a barva. */
const KONFETY: { x: string; y: string; r: string; tvar: string; barva: string }[] = [
  { x: "-92px", y: "-40px", r: "200deg", tvar: "h-2.5 w-4 rounded-sm", barva: "bg-orange" },
  { x: "-70px", y: "-86px", r: "-120deg", tvar: "h-2 w-2 rounded-full", barva: "bg-forest" },
  { x: "-18px", y: "-104px", r: "90deg", tvar: "h-3 w-1.5 rounded-full", barva: "bg-moss" },
  { x: "36px", y: "-98px", r: "160deg", tvar: "h-2.5 w-2.5 rounded-full", barva: "bg-orange" },
  { x: "84px", y: "-66px", r: "-80deg", tvar: "h-2 w-4 rounded-sm", barva: "bg-forest-light" },
  { x: "104px", y: "-8px", r: "240deg", tvar: "h-2 w-2 rounded-full", barva: "bg-orange-hover" },
  { x: "92px", y: "46px", r: "130deg", tvar: "h-3 w-1.5 rounded-full", barva: "bg-orange" },
  { x: "-100px", y: "30px", r: "-160deg", tvar: "h-3 w-1.5 rounded-full", barva: "bg-moss" },
  { x: "-60px", y: "70px", r: "60deg", tvar: "h-2 w-2 rounded-full", barva: "bg-orange" },
  { x: "58px", y: "82px", r: "-40deg", tvar: "h-2 w-3.5 rounded-sm", barva: "bg-moss" },
];

/** Lístky, které pomalu padají přes celou stránku (pozadí). */
const LISTKY: { left: string; delay: string; dur: string; drift: string; r: string; size: string; barva: string }[] = [
  { left: "6%", delay: "0s", dur: "16s", drift: "40px", r: "320deg", size: "h-6 w-6", barva: "text-moss/60" },
  { left: "22%", delay: "-6s", dur: "21s", drift: "-30px", r: "-260deg", size: "h-4 w-4", barva: "text-orange/60" },
  { left: "71%", delay: "-3s", dur: "18s", drift: "-50px", r: "280deg", size: "h-5 w-5", barva: "text-forest/35" },
  { left: "88%", delay: "-11s", dur: "23s", drift: "30px", r: "-300deg", size: "h-7 w-7", barva: "text-moss/50" },
  { left: "48%", delay: "-15s", dur: "25s", drift: "20px", r: "200deg", size: "h-4 w-4", barva: "text-orange/50" },
];

export default function DekujemePage() {
  return (
    <>
      <ConversionEvent />

      <style>{ANIMACE}</style>

      <main className="relative isolate flex-1 flex items-center justify-center min-h-screen overflow-hidden bg-beige grain">
        {/* pozadí — záře a padající lístky (jen dekorace) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 -right-24 h-96 w-96 rounded-full bg-orange/25 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-moss/30 blur-3xl" />
          <div className="dot-grid-dark absolute inset-0 opacity-60" />
          {LISTKY.map((l, i) => (
            <span
              key={i}
              className="dek-list absolute -top-10"
              style={
                {
                  left: l.left,
                  animationDelay: l.delay,
                  animationDuration: l.dur,
                  "--drift": l.drift,
                  "--r": l.r,
                } as React.CSSProperties
              }
            >
              <Leaf className={`${l.size} ${l.barva}`} fill="currentColor" />
            </span>
          ))}
        </div>

        {/* polaroidy z klubíku po stranách (jen na velké obrazovce, dekorace) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
          <div className="float-slow absolute left-[7%] top-[22%] w-56">
            <div className="polaroid -rotate-[7deg]">
              <div className="relative aspect-square overflow-hidden rounded-[0.35rem]">
                <Image src="/images/klubik/klubik-43.jpg" alt="" fill sizes="14rem" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="float-slow absolute left-[13%] top-[58%] w-44 [animation-delay:2s]">
            <div className="polaroid rotate-[5deg]">
              <div className="relative aspect-square overflow-hidden rounded-[0.35rem]">
                <Image src="/images/klubik/klubik-12.jpg" alt="" fill sizes="11rem" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="float-slow absolute right-[7%] top-[30%] w-52 [animation-delay:1s]">
            <div className="polaroid rotate-[6deg]">
              <div className="relative aspect-square overflow-hidden rounded-[0.35rem]">
                <Image src="/images/klubik/klubik-30.jpg" alt="" fill sizes="13rem" className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-xl sm:max-w-2xl mx-auto px-4 pt-14 pb-28 sm:pt-20 sm:pb-36 text-center">
          {/* Logo */}
          <Link
            href="/"
            className="group inline-block mb-8 rounded-2xl"
          >
            <Image
              src="/images/logo_fort.png"
              alt="Vzdělávací klub Farma Fořt"
              width={80}
              height={80}
              className="rounded-2xl mx-auto bg-white p-1.5 shadow-soft ring-1 ring-dark/5 -rotate-3 transition duration-300 group-hover:rotate-0 group-hover:scale-105"
            />
          </Link>

          <div className="card relative rounded-[2rem] px-6 pt-10 pb-8 sm:px-12 sm:pt-12 sm:pb-12 shadow-lift">
            {/* fajfka v kruhu + konfety */}
            <div aria-hidden="true" className="relative mx-auto mb-8 h-24 w-24">
              <span className="dek-vlna absolute inset-0 rounded-full bg-orange/50" />
              <svg
                viewBox="0 0 100 100"
                className="absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] -rotate-90"
              >
                <circle
                  className="dek-obrys"
                  cx="50"
                  cy="50"
                  r="47"
                  fill="none"
                  stroke="#FFB72B"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                />
              </svg>
              <div className="dek-kruh relative flex h-24 w-24 items-center justify-center rounded-full bg-forest shadow-lift">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    className="dek-fajfka"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                    pathLength={1}
                    strokeDasharray="1"
                  />
                </svg>
              </div>
              {KONFETY.map((k, i) => (
                <span
                  key={i}
                  className="dek-kus absolute left-1/2 top-1/2 -ml-1 -mt-1"
                  style={
                    { "--x": k.x, "--y": k.y, "--r": k.r, animationDelay: `${0.7 + i * 0.03}s` } as React.CSSProperties
                  }
                >
                  <span className={`block ${k.tvar} ${k.barva}`} />
                </span>
              ))}
            </div>

            <h1 className="text-[2.25rem] leading-[1.05] sm:text-5xl font-extrabold text-forest mb-5">
              Děkujeme za váš zájem!
            </h1>

            <p className="text-lg sm:text-xl text-dark leading-relaxed mb-4 font-medium">
              Vaši zprávu jsme přijali a brzy se vám ozveme.
            </p>

            <p className="text-brown leading-relaxed mb-9 max-w-md mx-auto">
              Potvrzení jsme vám poslali na e-mail. Pokud máte jakékoliv dotazy,
              neváhejte nám zavolat na{" "}
              <a
                href="tel:+420775917363"
                className="text-forest font-bold underline decoration-forest/30 underline-offset-4 hover:decoration-forest whitespace-nowrap"
              >
                775 917 363
              </a>{" "}
              nebo napsat na{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-forest font-bold underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
              >
                reditel@doucse.cz
              </a>
              .
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/"
                className="btn btn-forest sm:col-span-2 text-base sm:text-lg"
              >
                Zpět na hlavní stránku
              </Link>
              <a
                href="https://facebook.com/klubdetifarmafort"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2 px-4 text-[0.9rem]"
              >
                <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sledujte nás na Facebooku
              </a>
              <a
                href="https://www.instagram.com/klub_deti_farma_fort/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline gap-2 px-4 text-[0.9rem]"
              >
                <svg aria-hidden="true" className="h-5 w-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Sledujte nás na Instagramu
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
