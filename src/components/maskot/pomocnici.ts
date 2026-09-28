/**
 * Drobnosti kolem Fořťáčka, které nepatří do samotné komponenty.
 */

/** Klíče v sessionStorage — platí jen do zavření karty prohlížeče. */
export const KEY_SEEN = 'fortacek:videno'
export const KEY_CLOSED = 'fortacek:zavreno'

/*
  sessionStorage umí vyhodit výjimku (anonymní okno v Safari, zakázané
  cookies, náhled stránky). Maskot kvůli tomu nesmí spadnout — nanejvýš
  zapomene, že ho návštěvník už zavřel.
*/
export function readFlag(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

export function writeFlag(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1')
  } catch {
    /* bez paměti to jde taky */
  }
}

export function clearFlag(key: string): void {
  try {
    window.sessionStorage.removeItem(key)
  } catch {
    /* bez paměti to jde taky */
  }
}
