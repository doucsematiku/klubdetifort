"use client";

import { useEffect, useMemo, useState } from "react";
import AcknowledgementChecklist from "@/components/AcknowledgementChecklist";
import {
  PRESPAVKY_TERMINY,
  PRESPAVKY_BLOKY,
  PRESPAVKY_ACKS,
  acksComplete,
  cenaBloku,
  getBlok,
  getTermin,
  VEK_OD,
  VEK_DO,
  type PrespavkyAcksState,
} from "@/lib/prespavky";

/** Obsazenost z /api/prespavky/dostupnost */
interface Dostupnost {
  [terminId: string]: {
    spiciVolno: number;
    soVolno: number;
    neVolno: number;
  };
}

function formatCZK(n: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);
}

interface SuccessInfo {
  invoiceUrl: string | null;
  invoiceNumber: string | null;
  totalKc: number;
  terminLabel: string;
  blokLabel: string;
}

export default function PrespavkyForm() {
  const [terminId, setTerminId] = useState<string>(PRESPAVKY_TERMINY[0].id);
  const [blokId, setBlokId] = useState<string>("vikend");
  const [diteJmeno, setDiteJmeno] = useState("");
  const [diteVek, setDiteVek] = useState("");
  const [rodicJmeno, setRodicJmeno] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [poznamka, setPoznamka] = useState("");
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

  /** je blok pro vybraný termín plný? */
  function blokPlny(tId: string, bId: string): boolean {
    const info = dostupnost?.[tId];
    const blok = getBlok(bId);
    if (!info || !blok) return false;
    if (blok.spi && info.spiciVolno <= 0) return true;
    if (blok.dny.includes("so") && info.soVolno <= 0) return true;
    if (blok.dny.includes("ne") && info.neVolno <= 0) return true;
    return false;
  }

  const vybranyBlok = getBlok(blokId);
  const cena = vybranyBlok ? cenaBloku(termin, vybranyBlok) : 0;

  const formOk = useMemo(() => {
    return (
      diteJmeno.trim().length > 1 &&
      diteVek.trim() !== "" &&
      rodicJmeno.trim().length > 1 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      telefon.trim().length >= 9 &&
      acksComplete(acks) &&
      gdpr &&
      !blokPlny(terminId, blokId)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diteJmeno, diteVek, rodicJmeno, email, telefon, acks, gdpr, terminId, blokId, dostupnost]);

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
          diteJmeno: diteJmeno.trim(),
          diteVek: diteVek.trim(),
          rodicJmeno: rodicJmeno.trim(),
          email: email.trim(),
          telefon: telefon.trim(),
          poznamka: poznamka.trim(),
          acks,
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
        totalKc: data.totalKc ?? cena,
        terminLabel: `${termin.label} — ${termin.tema}`,
        blokLabel: vybranyBlok?.label ?? blokId,
      });
    } catch {
      setError("Spojení se nezdařilo. Zkuste to prosím znovu.");
      setSending(false);
    }
  }

  if (success) {
    return (
      <div className="bg-forest-pale rounded-3xl p-6 sm:p-10 ring-1 ring-forest/20">
        <h3 className="text-2xl font-bold text-forest mb-3">
          🎒 Máme to! Místo je rezervované
        </h3>
        <p className="text-dark leading-relaxed mb-4">
          Přihlášku na <strong>{success.terminLabel}</strong> (
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
          Kdyby cokoliv, napište na reditel@doucse.cz nebo volejte 775 917 363.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ── termín ── */}
      <div>
        <h3 className="flex items-center gap-2.5 font-bold text-dark mb-3"><span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-sm font-bold flex-shrink-0">1</span>Vyberte víkend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRESPAVKY_TERMINY.map((t) => (
            <label
              key={t.id}
              className={`rounded-2xl border-2 p-4 cursor-pointer transition-colors ${
                terminId === t.id
                  ? "border-forest bg-forest-pale"
                  : "border-beige-dark bg-white hover:border-forest/40"
              }`}
            >
              <input
                type="radio"
                name="termin"
                value={t.id}
                checked={terminId === t.id}
                onChange={() => setTerminId(t.id)}
                className="sr-only"
              />
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-bold text-dark">
                  <span className="mr-1.5">{t.emoji}</span>
                  {t.label}
                </span>
                {t.zavadeci && (
                  <span className="text-[11px] font-bold uppercase tracking-wide bg-orange text-dark rounded-full px-2 py-0.5 whitespace-nowrap">
                    zaváděcí cena
                  </span>
                )}
              </div>
              <p className="text-sm text-brown-light mt-1">{t.tema}</p>
            </label>
          ))}
        </div>
      </div>

      {/* ── blok ── */}
      <div>
        <h3 className="flex items-center gap-2.5 font-bold text-dark mb-3"><span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-sm font-bold flex-shrink-0">2</span>Jak dlouho s námi dítě bude?</h3>
        <div className="space-y-2">
          {PRESPAVKY_BLOKY.map((b) => {
            const plny = blokPlny(terminId, b.id);
            return (
              <label
                key={b.id}
                className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 transition-colors ${
                  plny
                    ? "border-beige-dark bg-beige opacity-60 cursor-not-allowed"
                    : blokId === b.id
                      ? "border-forest bg-forest-pale cursor-pointer"
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
                    className="w-4 h-4 accent-forest flex-shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="font-semibold text-dark block">
                      {b.label}
                      {plny && (
                        <span className="ml-2 text-xs font-bold text-orange-hover uppercase">
                          obsazeno
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-brown-light">{b.casy}</span>
                  </span>
                </span>
                <span className="font-bold text-forest whitespace-nowrap">
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

      {/* ── dítě + rodič ── */}
      <div>
        <h3 className="flex items-center gap-2.5 font-bold text-dark mb-3"><span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-sm font-bold flex-shrink-0">3</span>Kdo přijede?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-dite">
              Jméno a příjmení dítěte *
            </label>
            <input
              id="p-dite"
              type="text"
              required
              value={diteJmeno}
              onChange={(e) => setDiteJmeno(e.target.value)}
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-dark mb-1" htmlFor="p-vek">
              Věk dítěte ({VEK_OD}–{VEK_DO} let) *
            </label>
            <input
              id="p-vek"
              type="number"
              required
              min={VEK_OD}
              max={VEK_DO}
              value={diteVek}
              onChange={(e) => setDiteVek(e.target.value)}
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
            />
          </div>
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
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
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
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
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
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
            />
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
              className="w-full rounded-xl border-2 border-beige-dark bg-white px-4 py-3 text-dark focus:border-forest focus:outline-none"
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
        <h3 className="flex items-center gap-2.5 font-bold text-dark mb-3"><span className="flex items-center justify-center w-7 h-7 rounded-full bg-forest text-white text-sm font-bold flex-shrink-0">4</span>Podmínky účasti</h3>
        <AcknowledgementChecklist
          value={acks}
          onChange={(key, checked) => setAcks((p) => ({ ...p, [key]: checked }))}
          items={PRESPAVKY_ACKS}
          heading="Prosíme o odsouhlasení"
          intro="Prosíme přečtěte si jednotlivé body — odkrývají se postupně, abyste si je opravdu mohli v klidu projít. Každý lze zaškrtnout 5 s po jeho zobrazení. Vaše souhlasy si k přihlášce uložíme."
        />
        <label className="flex items-start gap-3 mt-4 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={gdpr}
            onChange={(e) => setGdpr(e.target.checked)}
            className="mt-1 w-4 h-4 accent-forest flex-shrink-0"
          />
          <span className="text-sm text-dark leading-relaxed">
            Souhlasím se zpracováním osobních údajů za účelem přihlášení dítěte
            na přespávačku a vystavení faktury. Údaje nebudou předány třetím
            stranám. *
          </span>
        </label>
      </div>

      {error && (
        <p className="bg-orange/15 border-2 border-orange rounded-xl px-4 py-3 text-dark font-semibold">
          {error}
        </p>
      )}

      {/* ── souhrn objednávky ── */}
      <div className="bg-beige rounded-2xl px-4 sm:px-5 py-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="text-sm text-dark min-w-0">
          <span className="font-bold">
            {termin.emoji} {termin.label}
          </span>
          <span className="text-brown-light"> · {termin.tema}</span>
          <span className="block text-brown-light">
            {vybranyBlok?.label} ({vybranyBlok?.casy})
            {diteJmeno.trim() ? ` · ${diteJmeno.trim()}` : ""}
          </span>
        </div>
        <div className="text-right">
          <span className="block text-2xl font-bold text-forest whitespace-nowrap">
            {formatCZK(cena)}
          </span>
          <span className="text-[11px] text-brown-light">vč. jídla</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!formOk || sending}
        title={!formOk ? "Vyplňte prosím všechna pole a potvrďte podmínky" : undefined}
        className="w-full bg-orange hover:bg-orange-hover text-dark font-bold px-10 py-4 rounded-full transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {sending ? "Odesílám…" : `Závazně objednat za ${formatCZK(cena)}`}
      </button>
      <p className="text-xs text-brown-light -mt-4 text-center">
        Po odeslání vám přijde potvrzení a faktura se splatností 7 dní. Místo je
        závazně drženo po připsání platby.
      </p>
    </form>
  );
}
