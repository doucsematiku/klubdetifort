"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { AnimationEvent, FocusEvent, PointerEvent } from "react";
import Image from "next/image";
import { CalendarCheck, Hand, Leaf, Phone, X } from "lucide-react";
import { maskotTexty, type MaskotVarianta } from "./texty";
import { KEY_CLOSED, KEY_SEEN, clearFlag, readFlag, writeFlag } from "./pomocnici";
import styles from "./Maskot.module.css";

/*
  Časování. Úvodní obrazovka má vlastní tlačítka a Fořťáček by jí zakryl
  roh — přijde až ve chvíli, kdy návštěvník odroluje většinu první
  obrazovky. Připraví se (neviditelně, ať se stihne načíst obrázek) dřív.
*/
const PRELOAD_AFTER_MS = 1500;
/** Kolik první obrazovky musí návštěvník odrolovat, než Fořťáček přijde. */
const HERO_SHARE = 0.75;
/** Jak dlouho visí na mobilu lákadlo vedle avataru. */
const TEASER_MS = 7000;
/** Pojistka, kdyby se obrázek nenačetl (nebo nenahlásil načtení). */
const IMAGE_FALLBACK_MS = 3000;
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Fořťáček — kravička z loga klubíku v pravém dolním rohu (stejný princip
 * jako Jurťáček na jurtyujezirka.cz a Jirka na skiverleih.cz).
 *
 * Na počítači stojí celý, mává, drží cedulku a v bublině střídá krátké
 * tipy s tlačítkem (prohlídka / přihláška) a telefonem. Křížek ho sbalí do
 * kulatého avataru (a zapamatuje si to do konce návštěvy). Na telefonu je
 * rovnou jen avatar — celá postava by zakryla půl obrazovky — a bublina
 * se otevře až po klepnutí.
 *
 * Postava je obrázek bez cedulky; cedulka je z HTML, aby text byl ostrý
 * a mohla se sama houpat. Poloha desky v CSS odpovídá výstupu skriptu
 * `scripts/maskot-pozadi.mjs`.
 *
 * Nepřekáží: přijde až pod úvodní obrazovkou, u formulářů a (na počítači)
 * u patičky se uklidí, na telefonu uhne nad lepicí lištu s tlačítky
 * (StickyCta), dokud je otevřená lišta se souhlasem, není vidět, a kdo má
 * vypnuté animace, dostane klidnou verzi bez pohybu.
 */
export default function Maskot({ varianta = "klub" }: { varianta?: MaskotVarianta }) {
  const s = maskotTexty[varianta];
  const tips = s.tips;
  const tipCount = tips.length;

  const uid = useId();
  const dialogId = `${uid}-bublina`;
  const nameId = `${uid}-jmeno`;
  const tipsId = `${uid}-tipy`;

  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  // Kam přesunout fokus po příští změně `open` — jen když o to návštěvník
  // požádal sám. Samovolné otevření na počítači fokus nebere.
  const focusDialogNext = useRef(false);
  const focusLauncherNext = useRef(false);

  const [armed, setArmed] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [calm, setCalm] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [tip, setTip] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [lift, setLift] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [hi, setHi] = useState<"a" | "b" | undefined>(undefined);

  /*
    Dokud je v maskotovi fokus (třeba po zavření bubliny klávesnicí),
    zůstane vidět — jinak by skrytý avatar fokus ztratil. Jinak se uklidí
    u formuláře a na počítači i u patičky, kde by zakryl kontakty.
  */
  const shown =
    triggered && imgReady && (focusWithin || (!formVisible && !(desktop && footerVisible)));

  /* Příchod: nejdřív se jen připraví, pak přijde po odrolování úvodu. */
  useEffect(() => {
    const seen = readFlag(KEY_SEEN);
    const closed = readFlag(KEY_CLOSED);
    let isArmed = false;
    let fired = false;

    const arm = () => {
      if (isArmed) return;
      isArmed = true;
      const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
      setCalm(seen);
      setOpen(isDesktop && !closed);
      setTeaser(!isDesktop && !closed && !seen);
      setArmed(true);
    };

    const fire = () => {
      if (fired) return;
      fired = true;
      arm();
      setTriggered(true);
      window.removeEventListener("scroll", onScroll);
    };

    function onScroll() {
      if (window.scrollY > 40) arm();
      if (window.scrollY > window.innerHeight * HERO_SHARE) fire();
    }

    const armTimer = window.setTimeout(arm, seen ? 0 : PRELOAD_AFTER_MS);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(armTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Pojistka: obrázek z mezipaměti občas načtení nenahlásí.
  useEffect(() => {
    if (!triggered || imgReady) return;
    const t = window.setTimeout(() => setImgReady(true), IMAGE_FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [triggered, imgReady]);

  // Poprvé viděn → při dalším načtení stránky přijde bez velkého příjezdu.
  useEffect(() => {
    if (shown) writeFlag(KEY_SEEN);
  }, [shown]);

  /*
    Na telefonu uhnout nad lepicí lištu s tlačítky (StickyCta). Lišta si
    sama řídí, kdy je vidět (atribut inert) — sledujeme ho, ať maskot
    uhýbá přesně s ní. Stránky bez lišty nechávají maskota dole.
  */
  useEffect(() => {
    const lista = document.querySelector<HTMLElement>(".sticky-cta");
    if (!lista) return;
    const mq = window.matchMedia("(max-width: 1023.98px)");
    const update = () => setLift(mq.matches && !lista.hasAttribute("inert"));
    update();
    const mo = new MutationObserver(update);
    mo.observe(lista, { attributes: true, attributeFilter: ["inert", "aria-hidden"] });
    mq.addEventListener("change", update);
    return () => {
      mo.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  // Patička a formuláře v zorném poli? (Kousek u okraje se nepočítá, ať maskot necuká.)
  useEffect(() => {
    const footer = document.querySelector("footer");
    const formy = s.schovatU
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const viditelne = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === footer) {
            setFooterVisible(entry.isIntersecting);
            continue;
          }
          if (entry.isIntersecting) viditelne.add(entry.target);
          else viditelne.delete(entry.target);
        }
        setFormVisible(viditelne.size > 0);
      },
      { rootMargin: "0px 0px -40px 0px" }
    );
    if (footer) io.observe(footer);
    formy.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [s.schovatU]);

  // Počítač, nebo telefon? Hlídá i otočení tabletu a změnu šířky okna.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lákadlo na mobilu po chvíli samo zmizí — nemá nic trvale zakrývat.
  useEffect(() => {
    if (!teaser || !shown) return;
    const t = window.setTimeout(() => setTeaser(false), TEASER_MS);
    return () => window.clearTimeout(t);
  }, [teaser, shown]);

  const openBubble = useCallback(() => {
    focusDialogNext.current = true;
    clearFlag(KEY_CLOSED);
    setTeaser(false);
    setOpen(true);
  }, []);

  const closeBubble = useCallback((returnFocus: boolean) => {
    focusLauncherNext.current = returnFocus;
    writeFlag(KEY_CLOSED);
    setTeaser(false);
    setOpen(false);
    // Skrytá bublina už „blur" ani „mouseleave" spolehlivě nepošle.
    setHovered(false);
    setFocused(false);
  }, []);

  // Fokus až po vykreslení — do té doby je bublina (nebo avatar) skrytá.
  useEffect(() => {
    if (open && focusDialogNext.current) {
      focusDialogNext.current = false;
      dialogRef.current?.focus({ preventScroll: true });
    } else if (!open && focusLauncherNext.current) {
      focusLauncherNext.current = false;
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  /*
    Escape bublinu zavře, když je fokus v ní — nebo nikde (návštěvník
    zrovna nic nevyplňuje). Z formuláře ji nezavírá.
  */
  useEffect(() => {
    if (!open || !shown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      const active = document.activeElement;
      const inside = !!active && !!rootRef.current?.contains(active);
      if (!inside && active && active !== document.body) return;
      closeBubble(inside);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, shown, closeBubble]);

  const nextTip = useCallback(() => {
    setTip((i) => (i + 1) % tipCount);
  }, [tipCount]);

  // Tipy střídá konec animace ukazatele (6 s), ne časovač. Pauza při
  // najetí myší nebo fokusu tak drží ukazatel i text přesně spolu.
  const onProgressEnd = (e: AnimationEvent<HTMLSpanElement>) => {
    if (e.target === e.currentTarget) nextTip();
  };

  /*
    Pauza střídání tipů: myš nad bublinou, nebo fokus z klávesnice. Prst
    se nepočítá — na telefonu by „najetí" po klepnutí nikdy neskončilo.
  */
  const onDialogPointer = (e: PointerEvent<HTMLDivElement>, over: boolean) => {
    if (e.pointerType === "mouse") setHovered(over);
  };

  const onDialogFocus = (e: FocusEvent<HTMLDivElement>) => {
    let keyboard = true;
    try {
      keyboard = e.target.matches(":focus-visible");
    } catch {
      /* starý prohlížeč bez :focus-visible — radši pauza */
    }
    if (keyboard) setFocused(true);
  };

  const onDialogBlur = (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget;
    if (!(next instanceof Node) || !e.currentTarget.contains(next)) setFocused(false);
  };

  // Klepnutí na postavu: zamává a řekne další tip.
  const poke = () => {
    setHi((h) => (h === "a" ? "b" : "a"));
    nextTip();
  };

  const markReady = useCallback(() => setImgReady(true), []);

  if (!armed) return null;

  const upcoming = ((tip + 1) % tipCount) + 1;
  const nextTipLabel = s.nextTip.replace("{n}", String(upcoming)).replace("{total}", String(tipCount));
  const phoneHref = `tel:+420${s.phone.replace(/\s+/g, "")}`;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-shown={shown}
      data-open={open}
      data-calm={calm}
      data-lift={lift}
      data-teaser={teaser}
      // Dokud není vidět, nesmí na něj jít tabulátorem ani čtečka.
      inert={!shown}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        const next = e.relatedTarget;
        if (!(next instanceof Node) || !rootRef.current?.contains(next)) setFocusWithin(false);
      }}
    >
      <div className={styles.stage}>
        <div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={nameId}
          aria-describedby={tipsId}
          tabIndex={-1}
          className={styles.dialog}
          data-paused={hovered || focused}
          onPointerEnter={(e) => onDialogPointer(e, true)}
          onPointerLeave={(e) => onDialogPointer(e, false)}
          onFocus={onDialogFocus}
          onBlur={onDialogBlur}
        >
          <div className={styles.body}>
            <div className={styles.head}>
              <p id={nameId} className={styles.name}>
                {s.name}
              </p>
              <button type="button" className={styles.dots} onClick={nextTip} aria-label={nextTipLabel}>
                {tips.map((_, i) => (
                  <span key={i} className={styles.dot} data-active={i === tip}>
                    {i === tip && <span className={styles.progress} onAnimationEnd={onProgressEnd} />}
                  </span>
                ))}
              </button>
              <button type="button" className={styles.close} onClick={() => closeBubble(true)} aria-label={s.close}>
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* Všechny tipy leží na sobě v jedné buňce mřížky — bublina má
                výšku podle nejdelšího a při střídání neposkakuje. */}
            <div className={styles.tips} aria-hidden="true">
              {tips.map((text, i) => (
                <p key={i} className={`${styles.tip} font-display`} data-active={i === tip}>
                  {text}
                </p>
              ))}
            </div>
            {/* Pro čtečku všechny tipy naráz — nic nesmí existovat jen v animaci. */}
            <ul id={tipsId} className="sr-only">
              {tips.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>

            <div className={styles.actions}>
              <a
                href={s.ctaHref}
                className={`${styles.action} ${styles.actionBook}`}
                onClick={(e) => {
                  // Formulář je hned pod — Fořťáček nesmí zůstat viset přes něj.
                  e.currentTarget.blur();
                  if (!desktop) closeBubble(false);
                }}
              >
                <CalendarCheck className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                {s.cta}
              </a>
              <a
                href={phoneHref}
                className={`${styles.action} ${styles.actionCall}`}
                aria-label={`${s.call} ${s.phone}`}
                title={`${s.call} ${s.phone}`}
              >
                <Phone className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Celá postava — jen na počítači a jen s otevřenou bublinou. */}
        <div className={styles.figure} aria-hidden="true" onClick={poke}>
          <div className={styles.particles}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i} className={styles.particle}>
                <Leaf className={styles.leafIcon} />
              </span>
            ))}
          </div>
          <div className={styles.bob}>
            <div className={styles.wave}>
              <div className={styles.hi} data-hi={hi}>
                <Image
                  src="/maskot/fortacek-postava.webp"
                  alt=""
                  width={FIG_W}
                  height={FIG_H}
                  className={styles.img}
                  draggable={false}
                  onLoad={markReady}
                />
                <span className={styles.stub} />
                <span className={styles.board}>
                  <span className={styles.boardSwing}>
                    <span className={`${styles.boardFace} font-display`}>
                      <span className={styles.signTop}>{s.signTop}</span>
                      <span className={styles.signRule} />
                      <span className={styles.signBottom}>{s.signBottom}</span>
                    </span>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lákadlo vedle avataru — jen na mobilu, jen chvíli. Pro čtečku
            a klávesnici je tu avatar sám, tohle je jen jeho zkratka. */}
        <button
          type="button"
          className={`${styles.teaser} font-display`}
          onClick={openBubble}
          tabIndex={-1}
          aria-hidden="true"
        >
          {s.teaser}
        </button>

        <button
          ref={launcherRef}
          type="button"
          className={styles.launcher}
          onClick={() => (open ? closeBubble(false) : openBubble())}
          aria-expanded={open}
          aria-controls={dialogId}
          aria-label={s.open}
        >
          <span className={styles.avatar}>
            <Image
              src="/maskot/fortacek-avatar.webp"
              alt=""
              width={96}
              height={96}
              className={styles.avatarImg}
              draggable={false}
              onLoad={markReady}
            />
          </span>
          <span className={styles.hand} aria-hidden="true">
            <Hand className="h-4 w-4" />
          </span>
        </button>
      </div>
    </div>
  );
}

/** Rozměry obrázku postavy z výstupu scripts/maskot-pozadi.mjs */
const FIG_W = 444;
const FIG_H = 560;
