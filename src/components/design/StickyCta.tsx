"use client";

import { useEffect, useState } from "react";

export type StickyAkce = {
  label: string;
  href: string;
  /** hlavní = žluté tlačítko, vedlejší = obrysové */
  hlavni?: boolean;
};

/**
 * Lišta s tlačítky u spodního okraje telefonu.
 *
 * Tři čtvrtiny návštěvníků jsou na mobilu — jakmile odscrollují pod
 * úvodní obrazovku, tlačítka jsou pryč. Lišta se proto vysune po
 * prvním „obrazu" a schová se, když je na obrazovce cílová sekce
 * (formulář), ať ho nezakrývá. Používá jen texty tlačítek, které na
 * stránce už jsou. Od lg (počítač) se neukazuje vůbec.
 */
export default function StickyCta({
  akce,
  schovatU,
}: {
  akce: StickyAkce[];
  /** id sekcí, u kterých se lišta schová (např. formulář) */
  schovatU?: string[];
}) {
  const [pod, setPod] = useState(false);
  const [uCile, setUCile] = useState(false);

  useEffect(() => {
    const onScroll = () => setPod(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const cile = (schovatU ?? [])
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const viditelne = new Set<Element>();
    const io = new IntersectionObserver(
      (zaznamy) => {
        for (const z of zaznamy) {
          if (z.isIntersecting) viditelne.add(z.target);
          else viditelne.delete(z.target);
        }
        setUCile(viditelne.size > 0);
      },
      { rootMargin: "0px 0px -35% 0px" }
    );
    cile.forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, [schovatU]);

  const ukazat = pod && !uCile;

  return (
    <div
      // kontrola textů tuhle lištu přeskakuje — opakuje jen existující tlačítka
      data-kontrola="duplikat"
      className={`sticky-cta fixed inset-x-0 bottom-0 z-40 lg:hidden px-3 pt-2 ${
        ukazat ? "translate-y-0" : "translate-y-[130%]"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-hidden={!ukazat}
      inert={!ukazat}
    >
      <div className="mx-auto flex max-w-md gap-2 rounded-full bg-forest-deep/90 p-1.5 shadow-[0_18px_40px_-12px_rgb(27_54_23/0.6)] ring-1 ring-white/10 backdrop-blur-xl">
        {akce.map((a) => (
          <a
            key={a.href + a.label}
            href={a.href}
            className={`flex min-h-12 flex-1 items-center justify-center rounded-full px-3 text-center text-sm font-bold leading-tight transition active:scale-[0.97] ${
              a.hlavni
                ? "btn-shine bg-orange text-dark"
                : "text-white ring-1 ring-inset ring-white/25 hover:bg-white/10"
            }`}
          >
            {a.label}
          </a>
        ))}
      </div>
    </div>
  );
}
