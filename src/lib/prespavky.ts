/**
 * Víkendové přespávačky na farmě — termíny, bloky, ceny a podmínky.
 *
 * Termíny a ceny jsou konstanty (jako PRAZDNINY_DAYS); registrace a kapacity
 * žijí v Supabase tabulce `prespavky_registrace`. Zaváděcí ceny platí jen
 * pro první (zářijový) víkend, další termíny mají běžné ceny.
 */

export type PrespavkyBlokId = "vikend" | "noc" | "dvadny" | "sobota" | "nedele";

export interface PrespavkyTermin {
  /** stabilní id — používá se v DB a custom_id faktur, nikdy neměnit */
  id: string;
  label: string;
  /** pátek (začátek víkendu) */
  od: string;
  /** neděle (konec víkendu) */
  do: string;
  tema: string;
  temaPopis: string;
  emoji: string;
  /** ceny bloků v Kč: vikend / noc / dvadny / den (sobota i neděle) */
  ceny: Record<"vikend" | "noc" | "dvadny" | "den", number>;
  zavadeci: boolean;
}

export const PRESPAVKY_TERMINY: readonly PrespavkyTermin[] = [
  {
    id: "zari",
    label: "25.–27. září",
    od: "2026-09-25",
    do: "2026-09-27",
    tema: "Podzimní tvoření",
    emoji: "🍂",
    temaPopis:
      "Ranní rutina s vlastní destičkou a velké podzimní tvoření — výzdoba z přírodnin, které si nasbíráme přímo na farmě.",
    ceny: { vikend: 3090, noc: 1890, dvadny: 1690, den: 1090 },
    zavadeci: true,
  },
  {
    id: "rijen",
    label: "23.–25. října",
    od: "2026-10-23",
    do: "2026-10-25",
    tema: "Draci a krmítka",
    emoji: "🪁",
    temaPopis:
      "Vyrobíme si vlastní minidraky a pustíme je nad loukami pod Krkonošemi. K tomu krmítka pro ptáčky na zimu.",
    ceny: { vikend: 3590, noc: 2190, dvadny: 1990, den: 1290 },
    zavadeci: false,
  },
  {
    id: "listopad",
    label: "13.–15. listopadu",
    od: "2026-11-13",
    do: "2026-11-15",
    tema: "Šípkový víkend",
    emoji: "🍵",
    temaPopis:
      "Výprava za šípky, výroba věšáčku — vlastního zásobníku šípků na domácí čaj přes celou zimu.",
    ceny: { vikend: 3590, noc: 2190, dvadny: 1990, den: 1290 },
    zavadeci: false,
  },
  {
    id: "prosinec",
    label: "11.–13. prosince",
    od: "2026-12-11",
    do: "2026-12-13",
    tema: "Perníková chaloupka",
    emoji: "🍪",
    temaPopis:
      "Vánoční naladění — sestavíme a nazdobíme perníkovou chaloupku, k tomu sváteční výzdoba a vůně z farmářské kuchyně.",
    ceny: { vikend: 3590, noc: 2190, dvadny: 1990, den: 1290 },
    zavadeci: false,
  },
];

export interface PrespavkyBlok {
  id: PrespavkyBlokId;
  label: string;
  casy: string;
  /** klíč do PrespavkyTermin.ceny */
  cenaKey: "vikend" | "noc" | "dvadny" | "den";
  /** počítá se do kapacity spících? */
  spi: boolean;
  /** ve kterých dnech je dítě přítomné (kapacita denní) */
  dny: ("so" | "ne")[];
}

export const PRESPAVKY_BLOKY: readonly PrespavkyBlok[] = [
  {
    id: "vikend",
    label: "Celý víkend (2 noci)",
    casy: "pátek 16:00 – neděle 16:00",
    cenaKey: "vikend",
    spi: true,
    dny: ["so", "ne"],
  },
  {
    id: "noc",
    label: "Jedna noc",
    casy: "sobota 10:00 – neděle 17:00",
    cenaKey: "noc",
    spi: true,
    dny: ["so", "ne"],
  },
  {
    id: "dvadny",
    label: "Dva dny bez spaní",
    casy: "sobota 10:00–17:00 + neděle 10:00–16:00",
    cenaKey: "dvadny",
    spi: false,
    dny: ["so", "ne"],
  },
  {
    id: "sobota",
    label: "Jen sobota",
    casy: "sobota 10:00–17:00",
    cenaKey: "den",
    spi: false,
    dny: ["so"],
  },
  {
    id: "nedele",
    label: "Jen neděle",
    casy: "neděle 10:00–16:00",
    cenaKey: "den",
    spi: false,
    dny: ["ne"],
  },
];

/** Kapacity: spí max 6 dětí, přes den max 8 dětí přítomných. */
export const KAPACITA_SPICI = 6;
export const KAPACITA_DENNI = 8;

/** Minimální / maximální věk dítěte. */
export const VEK_OD = 5;
export const VEK_DO = 13;

export function getTermin(id: string): PrespavkyTermin | undefined {
  return PRESPAVKY_TERMINY.find((t) => t.id === id);
}

export function getBlok(id: string): PrespavkyBlok | undefined {
  return PRESPAVKY_BLOKY.find((b) => b.id === id);
}

export function cenaBloku(termin: PrespavkyTermin, blok: PrespavkyBlok): number {
  return termin.ceny[blok.cenaKey];
}

/**
 * Podmínky účasti — rodič je při objednávce odsouhlasí jednu po druhé
 * (stejný vzor jako acknowledgement checklist u prohlídek). Zaškrtnutí se
 * loguje do DB (sloupec acks + acks_at). Klíče jsou stabilní — nikdy neměnit.
 */
export interface PrespavkyAck {
  key: string;
  text: string;
}

export const PRESPAVKY_ACKS: readonly PrespavkyAck[] = [
  {
    key: "ack_zdravi",
    text:
      "**Dítě je zdravé — po tělesné i duševní stránce** — a zvládne pobyt ve skupince dětí. Rozumím, že klub může nemocné nebo výrazně nesvé dítě při předání nepřijmout, případně požádat rodiče o dřívější vyzvednutí.",
  },
  {
    key: "ack_vek",
    text: "Dítěti je **5 až 13 let** (od předškoláků po třináctileté).",
  },
  {
    key: "ack_storno",
    text:
      "Rozumím storno podmínkám: **zrušení je zdarma nejpozději 7 dní před začátkem akce** (vrátíme celou částku). Při pozdějším zrušení nebo neúčasti se platba nevrací — místo v malé skupince už nejde obsadit.",
  },
  {
    key: "ack_neprenosne",
    text:
      "**Místo je vázané na přihlášené dítě.** (Po předchozí dohodě s námi ho ale lze předat jinému dítěti, které podmínky také splňuje — třeba v rámci rodiny nebo známých, ať vám nepropadne.)",
  },
  {
    key: "ack_vyzvednuti",
    text:
      "Rozumím pravidlům vyzvedávání: **při pozdním vyzvednutí účtujeme 200 Kč za každou započatou půlhodinu** péče navíc. Kdybychom se nedovolali rodičům ani záložnímu kontaktu, po dvou hodinách postupujeme podle zákona (kontaktujeme orgán péče o dítě, případně Policii ČR) — věříme, že to nikdy nebude potřeba.",
  },
  {
    key: "ack_predani",
    text:
      "Vím, že **dokumenty k pobytu a předání dítěte** (kontakty, oprávněné osoby k vyzvednutí, zdravotní údaje) vyplníme a podepíšeme **na místě při příjezdu**.",
  },
  {
    key: "ack_telefony",
    text:
      "**U nás jsou děti spolu, ne u obrazovek.** Telefon s sebou dítě klidně mít může (u starších to chápeme) — po příjezdu si ho ale uloží do šuplíčku a čas u nás tráví bez něj. Kdykoli budete chtít, zavoláte přímo průvodkyni — kontakt na ni dostanete před akcí.",
  },
  {
    key: "ack_specialni",
    text:
      "**Zvláštní potřeby dítěte** (léky, alergie, diety, noční režim, cokoli důležitého) **proberu předem s Lenkou Formánkovou**, která přespávačky vede — napíšu je do poznámky v objednávce, nebo se jí ozvu na detivpoho@gmail.com / 777 584 150.",
  },
];

/**
 * Extra souhlas jen pro spací bloky (vikend, noc) — potvrzuje se zvlášť
 * mimo postupný checklist a loguje se do acks stejně jako ostatní.
 */
export const ACK_PRESPANI: PrespavkyAck = {
  key: "ack_prespani",
  text:
    "Potvrzuji, že dítě přespání mimo domov zvládne — je na spaní bez rodičů připravené a chce to zkusit.",
};

export type PrespavkyAcksState = Record<string, boolean>;

/** true, když jsou všechny podmínky odsouhlasené */
export function acksComplete(state: PrespavkyAcksState): boolean {
  return PRESPAVKY_ACKS.every((a) => state[a.key] === true);
}
