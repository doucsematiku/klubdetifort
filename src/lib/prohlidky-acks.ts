/**
 * Acknowledgement check věty pro formulář prohlídek (návrh termínů).
 * Rodič musí každou samostatně odsouhlasit, jinak nepustí submit.
 *
 * Klíče jsou stabilní (nikdy nepřejmenovat) — používají se v API validaci.
 */

export interface AckItem {
  /** stabilní klíč (nikdy neměnit) */
  key: string;
  /** zobrazený text — JSX renderuje **bold** jako <strong> */
  text: string;
}

export const PROHLIDKY_ACKS: readonly AckItem[] = [
  {
    key: "ack_not_school",
    text:
      "Beru na vědomí, že **Klub dětí Farma Fořt není školou ani registrovanou dětskou skupinou** ve smyslu školského zákona.",
  },
  {
    key: "ack_no_rvp",
    text:
      "Rozumím, že **klub nenahrazuje klasickou školní výuku ani rámcový vzdělávací program (RVP) — tato role zůstává na rodině.**",
  },
  {
    key: "ack_no_exams",
    text:
      "Rozumím, že **klub nepřipravuje děti na přezkušování v jejich kmenové škole** — tato role zůstává na rodině.",
  },
  {
    key: "ack_no_phones",
    text:
      "Souhlasím, že **během pobytu v klubu děti nepoužívají mobilní telefony ani tablety.** Pokud si zařízení dítě přinese, uložíme ho po příchodu do uzamykatelné krabičky a vrátíme při odchodu. V mezičase můžete kdykoliv kontaktovat průvodce, který má mobil vždy u sebe.",
  },
  {
    key: "ack_iv",
    text:
      "**Individuální vzdělávání (IV) má naše dítě již schválené, nebo o něj v dohledné době zažádá.** Rozumím, že to je předpoklad účasti v klubu.",
  },
  {
    key: "ack_food",
    text:
      "**Souhlasím s tím, že dětem do klubu nebudu balit průmyslové sladkosti ani fast food** (Kinder vajíčka, hranolky, sušenky, slazené nápoje apod.) — společně chceme děti podporovat ve zdravém stravování. Vodu, ovoce nebo poctivou domácí svačinu samozřejmě uvítáme.",
  },
  {
    key: "ack_outdoor",
    text:
      "Beru na vědomí, že **čas v klubu trávíme z velké části venku v přírodě, v jakémkoliv počasí.** Dítěti zajistím vhodné oblečení a obuv pro pobyt v terénu.",
  },
  {
    key: "ack_no_specialcare",
    text:
      "Beru na vědomí, že **klub nedisponuje speciálně-pedagogickou ani zdravotnickou péčí.** Pokud má dítě specifické potřeby (alergie, dieta, výrazné výchovné/učební potřeby), řeknu o nich předem a domluvíme se, zda a jak je můžeme respektovat.",
  },
  {
    key: "ack_respect",
    text:
      "Beru na vědomí, že **v klubu pracujeme s dětmi v klidu a s respektem** — povídáme s nimi na rovinu, bereme je jako parťáky a dáváme prostor jejich nápadům, otázkám i emocím. S tímto přístupem souhlasím.",
  },
] as const;

export type AcksState = Record<string, boolean>;

/** Vrátí prázdný state s false pro každý klíč */
export function initialAcksState(): AcksState {
  return Object.fromEntries(PROHLIDKY_ACKS.map((a) => [a.key, false]));
}

/** True, když rodič odsouhlasil všechny ACKS */
export function allAcksAccepted(state: AcksState | undefined | null): boolean {
  if (!state) return false;
  for (const ack of PROHLIDKY_ACKS) {
    if (!state[ack.key]) return false;
  }
  return true;
}
