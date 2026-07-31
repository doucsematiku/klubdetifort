/**
 * Medailonky průvodkyň — zatím ve stavu NÁVRH.
 * Stránka /pruvodkyne je schovaná pod kódem, dokud návrh neschválí
 * ředitel a pak samy průvodkyně (formulář na stránce).
 */

export const MEDAILONEK_KOD = "4321";
/** Jméno cookie, do které si prohlížeč uloží zadaný kód. */
export const MEDAILONEK_COOKIE = "medailonky_kod";

/** popis = alt text pro čtečky, na stránce se nevypisuje */
export type Fotka = { src: string; popis: string };

export type Pruvodkyne = {
  /** klíč do formuláře souhlasu */
  id: string;
  jmeno: string;
  role: string;
  /** jedna věta pod jméno — nic, co se mění podle rozpisu služeb */
  podtitul: string;
  odstavce: string[];
  fotky: Fotka[];
  /** poznámka pro ni samotnou, na veřejný web se nedostane */
  otazka?: string;
};

export const PRUVODKYNE: Pruvodkyne[] = [
  {
    id: "lenka",
    jmeno: "Lenka Formánková",
    role: "průvodkyně",
    podtitul: "sociální pedagožka, maminka domškolačky",
    odstavce: [
      "Vystudovala jsem sociální pedagogiku. Opravdové studium ale popravdě začalo až po škole. Ne všechno se dá popsat pár odstavci v knihách a ne každé dítě se dá definovat zkratkou. A přesně to mě na pobývání s dětmi baví nejvíc — pestrost, vzájemné obohacování, ta neustálá bdělost k sobě, ke které nás děti svým bezprostředním žitím vedou.",
      "Prošla jsem kurzy koučinku, rétoriky a improvizace. Mám dlouhodobé zkušenosti s domškoláckými skupinkami, vedu zážitkové a tvořivé kurzy pro děti i veřejné dílničky a navrhuji a vyrábím tvořivé sady pro děti.",
      "Jsem maminkou osmileté domškolačky. Domškoláctví vidím jako jednu z možností, kterou tu děti i rodiče mají — nám se do života hodila nejvíc. S dcerkou díky němu trávíme spoustu času spolu, jsme spojené s každodenním děním, s praktickými radostmi i starostmi. A to je z mého pohledu do života to nejcennější, zvlášť v době AI technologií.",
      "S dětmi jsem ráda venku. Poznáváme spolu to, co k nám bezprostředně promlouvá, co máme na dosah ruky. Reaguji na to, co děti zajímá, a v tom je pak podporuji. Ráda je inspiruji k tvorbě z přírodních materiálů, ráda s nimi jen tak pobývám. Cennější než vědomosti jsou pro mě živé interakce, cennější než vysvětlování je zážitek.",
      "Vedu děti ke kreativitě, ke kritickému myšlení, k odvaze vyjádřit se a ukázat se ve své plné kráse. Děti jsou pro mě plnohodnotné bytosti a parťáci — a i já jsem v jejich přítomnosti autentická a transparentní. V prostoru, který spolu vytváříme, může být každý sám za sebe, a přesto to jako celek ladí.",
    ],
    fotky: [
      { src: "/images/pruvodkyne/lenka-1.jpg", popis: "portrét" },
      { src: "/images/pruvodkyne/lenka-2.jpg", popis: "portrét venku" },
    ],
    otazka:
      "Text vychází z vašeho dokumentu, jen je učesaný do odstavců a s opravenými překlepy. Obě profilovky jsou zatím na stránce vedle sebe a mají v rohu číslo — napište prosím, kterou nechat (klidně obě).",
  },
  {
    id: "ivana",
    jmeno: "Ivana Hrubá",
    role: "průvodkyně",
    podtitul: "koordinátorka mimoškolního vzdělávání, maminka dvou dětí",
    odstavce: [
      "Jmenuji se Ivana Hrubá. Jsem maminka dvou dětí a dobře vím, jak důležité je, aby se děti cítily přijaté, v bezpečí a mohly být samy sebou.",
      "Věřím, že děti se nejlépe učí tehdy, když mají prostor objevovat svět vlastním tempem a s radostí. Společně budeme poznávat přírodu, tvořit, hrát si, zkoumat, spolupracovat i rozvíjet to, co je v každém dítěti jedinečné. Mým přáním je, aby si děti odnášely nejen nové zážitky, ale také radost, odvahu zkoušet nové věci a důvěru v sebe sama.",
      "Jako koordinátorka mimoškolního vzdělávání v Diakonii jsem připravovala a organizovala programy pro děti — hledala jsem cesty, jak je zaujmout a podpořit jejich spolupráci i radost z objevování. Vytvořila jsem také vlastní program pro dětský tábor, který propojoval zážitky, přírodu, tvořivost a společné dobrodružství.",
      "Těším se na společnou cestu plnou objevů, zážitků a radosti.",
    ],
    fotky: [
      { src: "/images/pruvodkyne/ivana-1.jpg", popis: "první fotka z e-mailu" },
      { src: "/images/pruvodkyne/ivana-2.jpg", popis: "druhá fotka z e-mailu" },
    ],
    otazka:
      "V e-mailu přišly dvě fotky a na každé je podle nás někdo jiný — nechceme na web dát omylem cizí fotku. Fotky mají v rohu číslo; napište prosím, která z nich je vaše (1, nebo 2), nebo pošlete jinou.",
  },
];
