/**
 * Texty maskota Fořťáčka (kravička z loga klubíku) v pravém dolním rohu.
 *
 * Tipy smí říkat jen to, co o klubíku platí i jinde na webu (Ivanovo
 * pravidlo: jen pravda, žádné ceny, akce ani „poslední místa"). Klubík je
 * pro děti na individuálním vzdělávání (domškoláky) — to má zaznít brzy.
 * Varianta „prespavky" patří na stránku /prespavky.
 */
export type MaskotVarianta = "klub" | "prespavky";

export interface MaskotTexty {
  /** Kdo mluví — hlavička bubliny. Ať je krátké, na telefonu zbývá asi 150 px. */
  name: string;
  /** Střídající se tipy v bublině, 3–4 krátké věty. */
  tips: string[];
  /** Krátké lákadlo vedle avataru na mobilu (bublina je tam zavřená). */
  teaser: string;
  /** Hlavní tlačítko v bublině a kam vede. */
  cta: string;
  ctaHref: string;
  /** Telefon (zobrazí se jen ikona) */
  phone: string;
  call: string;
  /** Popisek křížku — bublina se sbalí do kulatého avataru. */
  close: string;
  /** Popisek kulatého avataru, který bublinu otevře. */
  open: string;
  /** Popisek tečkového přepínače; `{n}` a `{total}` se doplní. */
  nextTip: string;
  /** Dva řádky na cedulce, kterou Fořťáček drží. */
  signTop: string;
  signBottom: string;
  /** id sekcí, ve kterých se maskot uklidí (formuláře) */
  schovatU: string[];
}

const SPOLECNE = {
  name: "Fořťáček z farmy",
  call: "Zavolat",
  close: "Zavřít bublinu",
  open: "Otevřít vzkaz od Fořťáčka",
  nextTip: "Další tip ({n} z {total})",
  signTop: "AHOJ!",
};

export const maskotTexty: Record<MaskotVarianta, MaskotTexty> = {
  klub: {
    ...SPOLECNE,
    tips: [
      "Ahoj, já jsem Fořťáček! Bydlím na BIO farmě Fořt pod Krkonošemi.",
      "Klubík je pro domškoláky — od předškoláků do 5. třídy.",
      "Hodně času trávíme venku — v parku, na loukách i u potoka.",
      "Přijďte se k nám podívat — prohlídky domlouváme individuálně.",
    ],
    teaser: "Přijďte se podívat!",
    cta: "Domluvit prohlídku",
    ctaHref: "/prohlidky",
    phone: "775 917 363",
    signBottom: "jsme klubík",
    schovatU: ["kontakt"],
  },
  prespavky: {
    ...SPOLECNE,
    tips: [
      "Ahoj, já jsem Fořťáček! Na farmě se o víkendu i spinká.",
      "Přespávačky jsou pro děti od předškoláků do 13 let.",
      "Jídlo je v ceně — a večer sedíme u ohně.",
      "Malá skupinka: nejvýš 6 spících dětí.",
    ],
    teaser: "Víkend na farmě?",
    cta: "Přihlásit dítě",
    ctaHref: "#prihlaska",
    phone: "777 584 150",
    signBottom: "víkend u nás",
    schovatU: ["prihlaska"],
  },
};
