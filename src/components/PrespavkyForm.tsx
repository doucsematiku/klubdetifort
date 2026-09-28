"use client";

import { useEffect, useMemo, useState } from "react";
import AcknowledgementChecklist from "@/components/AcknowledgementChecklist";
import {
  ACK_PODMINKY,
  ACK_PRESPANI,
  PRESPAVKY_TERMINY,
  PRESPAVKY_BLOKY,
  PRESPAVKY_ACKS,
  KAPACITA_SPICI,
  acksComplete,
  cenaBloku,
  getBlok,
  getTermin,
  terminProsel,
  VEK_OD,
  VEK_DO,
  type PrespavkyAcksState,
  type PrespavkyBlokId,
  type PrespavkyTermin,
} from "@/lib/prespavky";

/** Obsazenost z /api/prespavky/dostupnost */
interface Dostupnost {
  [terminId: string]: {
    spiciVolno: number;
    soVolno: number;
    neVolno: number;
    /** volná místa pro každý blok — 0 = pro tenhle termín obsazený */
    bloky: Record<PrespavkyBlokId, number>;
    /** celý termín je vyčerpaný (žádný blok dostupný) */
    plny: boolean;
  };
}

interface DiteVstup {
  jmeno: string;
  vek: string;
}

function formatCZK(n: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);
}

/** České skloňování počtu dětí (2 až 4 „děti", jinak „dětí"). */
function pluralDeti(n: number): string {
  return n >= 2 && n <= 4 ? "děti" : "dětí";
}

interface SuccessInfo {
  invoiceUrl: string | null;
  invoiceNumber: string | null;
  totalKc: number;
  pocetDeti: number;
  terminLabel: string;
  blokLabel: string;
}

export default function PrespavkyForm() {
  const [terminId, setTerminId] = useState<string>(
    () => PRESPAVKY_TERMINY.find((t) => !terminProsel(t))?.id ?? PRESPAVKY_TERMINY[0].id
  );
  const [blokId, setBlokId] = useState<string>("vikend");
  const [deti, setDeti] = useState<DiteVstup[]>([{ jmeno: "", vek: "" }]);
  const [rodicJmeno, setRodicJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [poznamka, setPoznamka] = useState("");
  const [zalohaJmeno, setZalohaJmeno] = useState("");
  const [zalohaTelefon, setZalohaTelefon] = useState("");
  const [ackPrespani, setAckPrespani] = useState(false);
  const [ackPodminky, setAckPodminky] = useState(false);
  const [acks, setAcks] = useState<PrespavkyAcksState>({});
  const [gdpr, setGdpr] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [mountedAt] = useState(() => Date.now());

  const [dostupnost, setDostupnost] = useState<Dostupnost | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessInfo | null>(null);

  useEffect(() => {
    fetch("/api/prespavky/dostupnost")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setDostupnost(d))
      .catch(() => setDostupnost(null));
  }, []);

  const termin = getTermin(terminId) ?? PRESPAVKY_TERMINY[0];

  /** kolik dětí se do daného bloku ještě vejde; dokud data z API nedorazí, neomezujeme předčasně. */
  function blokVolno(tId: string, bId: string): number {
    const info = dostupnost?.[tId];
    if (!info) return KAPACITA_SPICI;
    return info.bloky[bId as PrespavkyBlokId] ?? 0;
  }

  /** je blok pro vybraný termín plný? */
  function blokPlny(tId: string, bId: string): boolean {
    return blokVolno(tId, bId) <= 0;
  }

  /** stav kartičky termínu v kroku 1 — badge; null = data ještě nedorazila */
  function terminStav(t: PrespavkyTermin): "prosel" | "obsazeno" | "posledni1" | "posledni2" | "volno" | null {
    if (terminProsel(t)) return "prosel";
    const info = dostupnost?.[t.id];
    if (!info) return null;
    if (info.plny) return "obsazeno";
    if (info.spiciVolno === 1) return "posledni1";
    if (info.spiciVolno === 2) return "posledni2";
    return "volno";
  }

  /** kartička (a radio) je disabled, když termín už proběhl nebo je celý vyčerpaný */
  function terminDisabled(t: PrespavkyTermin): boolean {
    return terminProsel(t) || dostupnost?.[t.id]?.plny === true;
  }

  // Jakmile dorazí obsazenost, zkontroluj naivně předvybraný termín (první
  // nadcházející) — pokud je mezitím plný, přeskoč na první opravdu dostupný.
  useEffect(() => {
    if (!dostupnost) return;
    const current = getTermin(terminId);
    if (!current || terminDisabled(current)) {
      const fallback = PRESPAVKY_TERMINY.find((t) => !terminDisabled(t));
      if (fallback) setTerminId(fallback.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dostupnost]);

  const vybranyBlok = getBlok(blokId);
  const cena = vybranyBlok ? cenaBloku(termin, vybranyBlok) : 0;
  const volnoVybranyBlok = blokVolno(terminId, blokId);
  const jmenaDeti = deti.map((d) => d.jmeno.trim()).filter(Boolean).join(", ");

  // Počet dětí je tvrdě omezený volnou kapacitou vybraného termínu a bloku —
  // když se termín/blok přehodí na méně volný, přebytečné děti oříznout.
  useEffect(() => {
    setDeti((cur) => (cur.length > volnoVybranyBlok ? cur.slice(0, Math.max(1, volnoVybranyBlok)) : cur));
  }, [volnoVybranyBlok]);

  function pridatDite() {
    setDeti((cur) => (cur.length >= volnoVybranyBlok ? cur : [...cur, { jmeno: "", vek: "" }]));
  }
  function odebratDite(i: number) {
    setDeti((cur) => (cur.length <= 1 ? cur : cur.filter((_, idx) => idx !== i)));
  }
  function upravDite(i: number, patch: Partial<DiteVstup>) {
    setDeti((cur) => cur.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  }

  const detiValidni = deti.every((d) => d.jmeno.trim().length > 1 && d.vek.trim() !== "");

  const formOk = useMemo(() => {
    return (
      detiValidni &&
      deti.length <= volnoVybranyBlok &&
      rodicJmeno.trim().length > 1 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      telefon.trim().length >= 9 &&
      zalohaJmeno.trim().length > 1 &&
      zalohaTelefon.trim().length >= 9 &&
      acksComplete(acks) &&
      (!vybranyBlok?.spi || ackPrespani) &&
      ackPodminky &&
      gdpr &&
      !blokPlny(terminId, blokId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deti, detiValidni, volnoVybranyBlok, rodicJmeno, email, telefon, zalohaJmeno, zalohaTelefon, acks, ackPrespani, ackPodminky, gdpr, terminId, blokId, dostupnost]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formOk || sending) return;
    setSending(true);
    setError(null);

    try {
      const res = await fetch("/api/prespavky/rezervovat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          terminId,
          blokId,
          deti: deti.map((d) => ({ jmeno: d.jmeno.trim(), vek: d.vek.trim() })),
          rodicJmeno: rodicJmeno.trim(),
          email: email.trim(),
          telefon: telefon.trim(),
          poznamka: poznamka.trim(),
          zalohaJmeno: zalohaJmeno.trim(),
          zalohaTelefon: zalohaTelefon.trim(),
          acks: {
            ...acks,
            [ACK_PODMINKY.key]: ackPodminky,
            ...(vybranyBlok?.spi ? { ack_prespani: ackPrespani } : {}),
          },
          gdpr,
          website,
          _t: mountedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Něco se pokazilo. Zkuste to prosím znovu.");
        setSending(false);
        return;
      }
      setSuccess({
        invoiceUrl: data.invoiceUrl ?? null,
        invoiceNumber: data.invoiceNumber ?? null,
        totalKc: data.totalKc ?? cena * deti.length,
        pocetDeti: data.pocetDeti ?? deti.length,
        terminLabel: `${termin.label} — ${termin.tema}`,
        blokLabel: vybranyBlok?.label ?? blokId,
      });
    } catch {
      setError("Spojení se nezdařilo. Zkuste to prosím znovu.");
      setSending(false);
    }
  }

  if (success) {
    const viceDeti = success.pocetDeti > 1;
    return (
      <div className="bg-forest-pale rounded-[1.75rem] p-6 sm:p-10 ring-1 ring-forest/20">
        <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-forest mb-4">
          🎒 Máme to! {viceDeti ? "Místa jsou rezervovaná" : "Místo je rezervované"}
        </h3>
        <p className="text-dark leading-relaxed mb-4">
          {viceDeti ? `Přihlášky pro ${success.pocetDeti} ${pluralDeti(success.pocetDeti)}` : "Přihlášku"} na{" "}
          <strong>{success.terminLabel}</strong> (
          {success.blokLabel.toLowerCase()}) jsme přijali. Do e-mailu vám právě
          letí potvrzení se všemi informacemi
          {success.invoiceUrl ? " a faktura" : ""} na{" "}
          <strong>{formatCZK(success.totalKc)}</strong>.
        </p>
        {success.invoiceUrl ? (
          <p className="text-dark leading-relaxed mb-4">
            Fakturu {success.invoiceNumber} můžete rovnou uhradit zde:{" "}
            <a
              href={success.invoiceUrl}
              className="text-forest font-bold underline break-all"
              target="_blank"
              rel="noreferrer"
            >
              zobrazit fakturu
            </a>
            . Místo je závazně drženo po připsání platby.
          </p>
        ) : (
          <p className="text-dark leading-relaxed mb-4">
            Fakturu vám pošleme do 24 hodin samostatným e-mailem.
          </p>
        )}
        <p className="text-brown-light text-sm">
          Kdyby cokoliv, ozvěte se Lence Formánkové, která přespávačky vede —
          detivpoho@gmail.com, 777 584 150.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* ── termín ── */}
      <div>
        <h3 className="flex items-center gap-3.5 font-display text-lg sm:text-xl font-bold leading-snug text-dark mb-4"><span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest text-white text-base font-bold flex-shrink-0 shadow-[0_0_0_5px_#E8F0E5]">1</span>Vyberte víkend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESPAVKY_TERMINY.map((t) => {
            const stav = terminStav(t);
            const disabled = terminDisabled(t);
            return (
              <label
                key={t.id}
                className={`relative rounded-2xl border-2 p-4 pb-4 transition-all duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-orange/40 after:absolute after:bottom-4 after:right-4 after:h-5 after:w-5 after:rounded-full after:border-2 after:transition-all ${
                  disabled
                    ? "border-beige-dark bg-beige opacity-60 cursor-not-allowed after:border-beige-dark"
                    : terminId === t.id
                      ? "border-forest bg-forest-pale cursor-pointer shadow-[0_14px_28px_-16px_rgb(45_90_39/0.7)] after:border-forest after:bg-forest after:shadow-[inset_0_0_0_3px_#E8F0E5]"
                      : "border-beige-dark bg-white hover:border-forest/40 hover:-translate-y-0.5 cursor-pointer after:border-beige-dark after:bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="termin"
                  value={t.id}
                  disabled={disabled}
                  checked={terminId === t.id}
                  onChange={() => setTerminId(t.id)}
                  className="sr-only"
                />
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-display text-[1.05rem] font-bold text-dark">
                    <span className="mr-1.5">{t.emoji}</span>
                    {t.label}
                  </span>
                  {t.zavadeci && stav !== "prosel" && (
                    <span className="text-xs font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-2.5 py-0.5 whitespace-nowrap shadow-glow">
                      zaváděcí cena
                    </span>
                  )}
                </div>
                <p className="text-sm text-brown mt-1 pr-8">{t.tema}</p>
                {stav && (
                  <span
                    className={`inline-block mt-2.5 text-xs font-bold uppercase tracking-wide rounded-full px-2.5 py-0.5 ${
                      stav === "volno"
                        ? "bg-forest/10 text-forest"
                        : stav === "posledni1" || stav === "posledni2"
                          ? "bg-orange/15 text-orange-hover"
                          : "bg-beige-dark/70 text-brown-light"
                    }`}
                  >
                    {stav === "volno" && "volno"}
                    {stav === "posledni1" && "poslední místo"}
                    {stav === "posledni2" && "poslední 2 místa"}
                    {stav === "obsazeno" && "obsazeno"}
                    {stav === "prosel" && "proběhlo"}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </div>

      {/* ── blok ── */}
      <div>
        <h3 className="flex items-center gap-3.5 font-display text-lg sm:text-xl font-bold leading-snug text-dark mb-4"><span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest text-white text-base font-bold flex-shrink-0 shadow-[0_0_0_5px_#E8F0E5]">2</span>Jak dlouho s námi dítě bude?</h3>
        <div className="space-y-2">
          {PRESPAVKY_BLOKY.map((b) => {
            const plny = blokPlny(terminId, b.id);
            return (
              <label
                key={b.id}
                className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3.5 transition-all duration-200 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-orange/40 ${
                  plny
                    ? "border-beige-dark bg-beige opacity-60 cursor-not-allowed"
                    : blokId === b.id
                      ? "border-forest bg-forest-pale cursor-pointer shadow-[0_14px_28px_-16px_rgb(45_90_39/0.7)]"
                      : "border-beige-dark bg-white hover:border-forest/40 cursor-pointer"
                }`}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <input
                    type="radio"
                    name="blok"
                    value={b.id}
                    disabled={plny}
                    checked={blokId === b.id}
                    onChange={() => setBlokId(b.id)}
                    className="w-5 h-5 accent-forest flex-shrink-0 outline-none!"
                  />
                  <span className="min-w-0">
                    <span className="font-bold text-dark block leading-snug">
                      {b.label}
                      {plny && (
                        <span className="ml-2 text-xs font-bold text-orange-hover uppercase">
                          obsazeno
                        </span>
                      )}
                    </span>
                    <span className="text-[13px] text-brown-light">{b.casy}</span>
                  </span>
                </span>
                <span className="font-display text-lg font-extrabold text-forest whitespace-nowrap">
                  {formatCZK(cenaBloku(termin, b))}
                </span>
              </label>
            );
          })}
        </div>
        {dostupnost?.[terminId] && dostupnost[terminId].spiciVolno > 0 && dostupnost[terminId].spiciVolno <= 2 && (
          <p className="text-sm text-orange-hover font-semibold mt-2">
            Na spaní zbývají poslední {dostupnost[terminId].spiciVolno === 1 ? "1 místo" : "2 místa"}!
          </p>
        )}
      </div>

      {/* ── děti + rodič ── */}
      <div>
        <h3 className="flex items-center gap-3.5 font-display text-lg sm:text-xl font-bold leading-snug text-dark mb-4"><span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest text-white text-base font-bold flex-shrink-0 shadow-[0_0_0_5px_#E8F0E5]">3</span>Kdo přijede?</h3>

        <div className="space-y-3 mb-4">
          {deti.map((d, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] gap-3 items-end bg-beige/70 rounded-2xl p-3 sm:p-4 ring-1 ring-beige-dark/50"
            >
              <div>
                <label className="block text-sm font-semibold text-dark mb-1" htmlFor={`p-dite-${i}`}>
                  {deti.length > 1 ? `Jméno a příjmení dítěte ${i + 1} *` : "Jméno a příjmení dítěte *"}
                </label>
                <input
                  id={`p-dite-${i}`}
                  type="text"
                  required
                  value={d.jmeno}
                  onChange={(e) => upravDite(i, { jmeno: e.target.value })}
                  className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1" htmlFor={`p-vek-${i}`}>
                  Věk ({VEK_OD}–{VEK_DO}) *
                </label>
                <input
                  id={`p-vek-${i}`}
                  type="number"
                  required
                  min={VEK_OD}
                  max={VEK_DO}
                  value={d.vek}
                  onChange={(e) => upravDite(i, { vek: e.target.value })}
                  className="w-full sm:w-24 rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
                />
              </div>
              {deti.length > 1 && (
                <button
                  type="button"
                  onClick={() => odebratDite(i)}
                  className="col-span-2 sm:col-span-1 min-h-11 text-sm font-semibold text-brown-light underline decoration-dotted underline-offset-4 hover:text-orange-hover sm:py-3 text-left sm:text-center whitespace-nowrap"
                >
                  Odebrat
                </button>
              )}
            </div>
          ))}
        </div>

        {deti.length < volnoVybranyBlok ? (
          <button
            type="button"
            onClick={pridatDite}
            className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-forest border-2 border-forest rounded-full px-5 py-2 hover:bg-forest hover:text-white transition-colors"
          >
            + Přidat další dítě
          </button>
        ) : (
          <p className="mb-6 text-sm text-orange-hover font-semibold">
            Na tento termín zbývá poslední volné místo.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-rodic">
              Jméno a příjmení rodiče *
            </label>
            <input
              id="p-rodic"
              type="text"
              required
              value={rodicJmeno}
              onChange={(e) => setRodicJmeno(e.target.value)}
              className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-tel">
              Telefon *
            </label>
            <input
              id="p-tel"
              type="tel"
              required
              value={telefon}
              onChange={(e) => setTelefon(e.target.value)}
              className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-mail">
              E-mail (přijde na něj potvrzení a faktura) *
            </label>
            <input
              id="p-mail"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
            />
          </div>
          <div className="sm:col-span-2 rounded-2xl bg-sun/70 p-4 sm:p-5 ring-1 ring-orange/25">
            <p className="text-sm font-semibold text-dark mb-1">
              Záložní kontakt <span className="font-normal text-brown-light">(povinný)</span>
            </p>
            <p className="text-[13px] text-brown mb-4 leading-relaxed">
              Další osoba, které se dovoláme a která může dítě vyzvednout,
              kdybychom se vám nemohli dovolat.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-zal-jmeno">
                  Jméno a vztah k dítěti *
                </label>
                <input
                  id="p-zal-jmeno"
                  type="text"
                  required
                  placeholder="např. Marie Nováková, babička"
                  value={zalohaJmeno}
                  onChange={(e) => setZalohaJmeno(e.target.value)}
                  className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-zal-tel">
                  Telefon *
                </label>
                <input
                  id="p-zal-tel"
                  type="tel"
                  required
                  value={zalohaTelefon}
                  onChange={(e) => setZalohaTelefon(e.target.value)}
                  className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
                />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-pozn">
              Poznámka — alergie, léky, diety, cokoliv důležitého
            </label>
            <textarea
              id="p-pozn"
              rows={3}
              value={poznamka}
              onChange={(e) => setPoznamka(e.target.value)}
              className="w-full rounded-2xl! border-2 border-beige-dark bg-white px-4 py-3 text-base text-dark shadow-[inset_0_1px_2px_rgb(58_54_45/0.06)] outline-none! transition placeholder:text-brown-light/60 hover:border-forest/35 focus:border-orange focus:ring-4 focus:ring-orange/30"
            />
          </div>
        </div>

        {/* honeypot — skrytý pro lidi */}
        <div className="hidden" aria-hidden="true">
          <label>
            Nechte prázdné
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>
      </div>

      {/* ── podmínky ── */}
      <div>
        <h3 className="flex items-center gap-3.5 font-display text-lg sm:text-xl font-bold leading-snug text-dark mb-4"><span className="flex items-center justify-center w-9 h-9 rounded-full bg-forest text-white text-base font-bold flex-shrink-0 shadow-[0_0_0_5px_#E8F0E5]">4</span>Podmínky účasti</h3>
        {/* obal jen pro vzhled — sdílený seznam zůstává beze změny, tady má větší drobné písmo a zaoblení */}
        <div className="[&>div]:rounded-2xl [&>div]:ring-1 [&>div]:ring-beige-dark/50 [&_.text-xs]:text-[13px] [&_input[type=checkbox]]:h-5 [&_input[type=checkbox]]:w-5 [&_input[type=checkbox]]:mt-0.5">
          <AcknowledgementChecklist
            value={acks}
            onChange={(key, checked) => setAcks((p) => ({ ...p, [key]: checked }))}
            items={PRESPAVKY_ACKS}
            heading="Prosíme o odsouhlasení"
            intro="Prosíme přečtěte si jednotlivé body — odkrývají se postupně, abyste si je opravdu mohli v klidu projít. Každý lze zaškrtnout 5 s po jeho zobrazení. Vaše souhlasy si k přihlášce uložíme."
          />
        </div>
        {vybranyBlok?.spi && (
          <label className="flex items-start gap-3 mt-4 rounded-2xl bg-night p-4 sm:p-5 cursor-pointer shadow-lift ring-1 ring-white/10">
            <input
              type="checkbox"
              required
              checked={ackPrespani}
              onChange={(e) => setAckPrespani(e.target.checked)}
              className="mt-0.5 w-5 h-5 accent-forest flex-shrink-0"
            />
            <span className="text-sm text-white/90 leading-relaxed">
              🌙 <strong>{ACK_PRESPANI.text}</strong> *
            </span>
          </label>
        )}
        <label className="flex items-start gap-3 mt-5 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={ackPodminky}
            onChange={(e) => setAckPodminky(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-forest flex-shrink-0"
          />
          <span className="text-sm text-dark leading-relaxed">
            Přečetl(a) jsem si{" "}
            <a
              href="#podminky-uplne"
              className="text-forest font-semibold underline"
            >
              úplné podmínky přespávaček
            </a>{" "}
            a souhlasím s nimi. *
          </span>
        </label>
        <label className="flex items-start gap-3 mt-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={gdpr}
            onChange={(e) => setGdpr(e.target.checked)}
            className="mt-0.5 w-5 h-5 accent-forest flex-shrink-0"
          />
          <span className="text-sm text-dark leading-relaxed">
            Souhlasím se zpracováním osobních údajů za účelem přihlášení dítěte
            na přespávačku a vystavení faktury. Údaje nebudou předány třetím
            stranám. *
          </span>
        </label>
      </div>

      {error && (
        <p className="bg-orange/15 border-2 border-orange rounded-2xl px-4 py-3 text-dark font-semibold">
          {error}
        </p>
      )}

      {/* ── souhrn objednávky ── */}
      <div className="relative overflow-hidden rounded-3xl bg-night bg-[radial-gradient(circle_at_88%_15%,rgb(255_183_43/0.28),transparent_45%),radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.09)_1px,transparent_0)] bg-[length:auto,22px_22px] px-5 sm:px-6 py-5 text-white shadow-lift flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4">
        <div className="text-sm text-white min-w-0 leading-relaxed">
          <span className="font-display text-base font-bold">
            {termin.emoji} {termin.label}
          </span>
          <span className="text-white/70"> · {termin.tema}</span>
          <span className="block text-white/70">
            {vybranyBlok?.label} ({vybranyBlok?.casy})
            {jmenaDeti ? ` · ${jmenaDeti}` : ""}
          </span>
        </div>
        <div className="sm:text-right">
          <span className="block font-display text-3xl font-extrabold leading-tight tracking-tight text-orange whitespace-nowrap">
            {formatCZK(cena * deti.length)}
          </span>
          <span className="text-[13px] text-white/65">
            vč. jídla{deti.length > 1 ? ` · ${deti.length} × ${formatCZK(cena)}` : ""}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!formOk || sending}
        title={!formOk ? "Vyplňte prosím všechna pole a potvrďte podmínky" : undefined}
        className="btn btn-sun btn-shine w-full min-h-[3.75rem] px-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:transform-none disabled:hover:bg-orange disabled:active:transform-none disabled:after:hidden"
      >
        {sending ? "Odesílám…" : `Závazně objednat za ${formatCZK(cena * deti.length)}`}
      </button>
      <p className="text-[13px] text-brown-light leading-relaxed -mt-6 text-center">
        Po odeslání vám přijde potvrzení a faktura — splatnost max. 7 dní, u
        termínů blíž než týden kratší, ať platba dorazí před začátkem akce.
        Místo je závazně drženo po připsání platby.
      </p>
    </form>
  );
}
