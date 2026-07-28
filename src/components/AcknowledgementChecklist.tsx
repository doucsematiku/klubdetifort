"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { PROHLIDKY_ACKS, type AcksState } from "@/lib/prohlidky-acks";

interface Props {
  value: AcksState;
  onChange: (key: string, checked: boolean) => void;
  /** Volitelný nadpis sekce */
  heading?: string;
}

/** Čekací doba (ms) než lze nově odhalený checkbox zaškrtnout. */
const LOCK_MS = 5000;

/**
 * Render textu s **bold** markery jako <strong>.
 * Bezpečné — nevyrábí HTML, jen rozdělí podle markeru.
 */
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export default function AcknowledgementChecklist({ value, onChange, heading }: Props) {
  const total = PROHLIDKY_ACKS.length;

  // Při mountu zrekonstruujeme stav podle už-zaškrtnutých acks
  // (po opětovném mountu formuláře nemusí rodič začínat od nuly).
  const [revealedCount, setRevealedCount] = useState(() => {
    let checked = 0;
    for (const a of PROHLIDKY_ACKS) if (value[a.key]) checked++;
    return Math.min(total, Math.max(1, checked + 1));
  });

  const [revealedAt, setRevealedAt] = useState<Record<string, number>>(() => {
    const now = Date.now();
    const map: Record<string, number> = {};
    let checkedSoFar = 0;
    for (const a of PROHLIDKY_ACKS) {
      if (value[a.key]) {
        map[a.key] = now - LOCK_MS - 1000; // dávno → countdown už neběží
        checkedSoFar++;
      }
    }
    // První dosud-nezaškrtnutý čerstvě odhalujeme (countdown startuje).
    if (checkedSoFar < total) {
      map[PROHLIDKY_ACKS[checkedSoFar].key] = now;
    }
    return map;
  });


  // Tick pro re-render countdown — 4× za sekundu, čistá animace.
  const [nowTick, setNowTick] = useState(Date.now());
  useEffect(() => {
    // Pokud jsme už všechno odhalili A žádný countdown neběží, můžeme přestat tikat.
    const t = setInterval(() => setNowTick(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const completed = useMemo(
    () => PROHLIDKY_ACKS.filter((a) => value[a.key]).length,
    [value]
  );

  function handleChange(key: string, idx: number, checked: boolean) {
    onChange(key, checked);

    // Jakmile rodič zaškrtne aktuálně poslední odhalený a další ještě není odhalený,
    // odkryjeme ho a spustíme jeho 5s countdown.
    if (checked && idx === revealedCount - 1 && revealedCount < total) {
      const nextKey = PROHLIDKY_ACKS[revealedCount].key;
      setRevealedAt((p) => ({ ...p, [nextKey]: Date.now() }));
      setRevealedCount(revealedCount + 1);
    }
  }

  return (
    <div className="bg-beige rounded-xl p-4 sm:p-5">
      {heading && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
          <h4 className="text-sm font-semibold text-dark">{heading}</h4>
          <span className="text-xs text-brown-light tabular-nums">
            {completed} / {total} odsouhlaseno
          </span>
        </div>
      )}
      <p className="text-xs text-brown-light leading-relaxed mb-4">
        Prosíme přečtěte si jednotlivé body — odkrývají se postupně, abyste
        si je opravdu mohli v&nbsp;klidu projít. Každý lze zaškrtnout 5&nbsp;s po
        jeho zobrazení. Díky tomu si na prohlídce hned rozumíme a&nbsp;můžeme
        se v&nbsp;klidu věnovat tomu, co vás zajímá.
      </p>

      <ul className="space-y-3">
        {PROHLIDKY_ACKS.slice(0, revealedCount).map((ack, idx) => {
          const since = revealedAt[ack.key] ?? nowTick;
          const elapsed = nowTick - since;
          const secondsLeft = Math.max(0, Math.ceil((LOCK_MS - elapsed) / 1000));
          const locked = elapsed < LOCK_MS && !value[ack.key];

          return (
            <li
              key={ack.key}
              className="rounded-lg transition-opacity duration-300"
              style={{ animation: "ack-fade-in 0.35s ease-out" }}
            >
              <label
                className={`flex items-start gap-3 ${
                  locked ? "cursor-not-allowed" : "cursor-pointer"
                } group`}
              >
                <input
                  type="checkbox"
                  required
                  disabled={locked}
                  checked={!!value[ack.key]}
                  onChange={(e) => handleChange(ack.key, idx, e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-beige-dark text-forest focus:ring-forest/30 accent-forest flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-describedby={locked ? `${ack.key}-lock` : undefined}
                />
                <span
                  className={`text-sm leading-relaxed transition-colors ${
                    locked ? "text-brown-light" : "text-dark"
                  }`}
                >
                  <span className="text-brown-light font-semibold mr-1.5">
                    {idx + 1}.
                  </span>
                  {renderText(ack.text)}
                  {locked && (
                    <span
                      id={`${ack.key}-lock`}
                      className="ml-2 inline-flex items-center gap-1.5 text-xs font-medium text-orange-hover whitespace-nowrap align-baseline"
                    >
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full bg-orange-hover"
                        style={{ animation: "ack-pulse 1s ease-in-out infinite" }}
                      />
                      ještě {secondsLeft}&nbsp;s
                    </span>
                  )}
                </span>
              </label>

              {locked && (
                <div className="ml-7 mt-2 h-1 w-full max-w-[200px] rounded-full bg-beige-dark overflow-hidden">
                  <div
                    className="h-full bg-orange-hover transition-[width] duration-200 ease-linear"
                    style={{
                      width: `${Math.min(100, (elapsed / LOCK_MS) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </li>
          );
        })}

        {revealedCount < total && (
          <li className="text-xs text-brown-light italic pl-7">
            Další bod se odkryje, jakmile odsouhlasíte předchozí.
          </li>
        )}
      </ul>

      <style jsx>{`
        @keyframes ack-fade-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes ack-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.35;
          }
        }
      `}</style>
    </div>
  );
}
