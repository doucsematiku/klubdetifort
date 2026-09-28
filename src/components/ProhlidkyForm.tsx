"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import AcknowledgementChecklist from "@/components/AcknowledgementChecklist";
import {
  allAcksAccepted,
  initialAcksState,
  type AcksState,
} from "@/lib/prohlidky-acks";
import { maxDatumISO } from "@/lib/prohlidky-config";

interface NavrhRow {
  datum: string;
  cas_od: string;
  cas_do: string;
}

interface FormState {
  parentName: string;
  email: string;
  emailConfirm: string;
  phone: string;
  childrenInfo: string;
  childrenCount: number;
  navrhy: NavrhRow[];
  poznamka: string;
  gdpr: boolean;
}

const emptyNavrh: NavrhRow = { datum: "", cas_od: "", cas_do: "" };

/*
  Vzhled polí (jen třídy). `rounded-2xl!` s vykřičníkem, protože globální
  :focus-visible jinak při zaměření přepíše zaoblení na 6 px; orámování
  zaměřeného pole dělá oranžový ring místo globálního outline.
*/
const POLE =
  "w-full min-h-[3.25rem] px-4 py-3 rounded-2xl! border-2 border-beige-dark bg-cream text-base text-dark placeholder:text-brown-light/60 transition hover:border-moss focus:outline-none focus-visible:outline-none! focus:border-orange focus:bg-white focus:ring-4 focus:ring-orange/25";
const POLE_TERMIN =
  "w-full min-h-12 px-3.5 py-2.5 rounded-xl! border-2 border-beige-dark bg-cream text-base text-dark transition hover:border-moss focus:outline-none focus-visible:outline-none! focus:border-orange focus:bg-white focus:ring-4 focus:ring-orange/25";

const initialForm: FormState = {
  parentName: "",
  email: "",
  emailConfirm: "",
  phone: "",
  childrenInfo: "",
  childrenCount: 1,
  navrhy: [{ ...emptyNavrh }, { ...emptyNavrh }, { ...emptyNavrh }],
  poznamka: "",
  gdpr: false,
};

export default function ProhlidkyForm() {
  const [view, setView] = useState<"form" | "success">("form");
  const [form, setForm] = useState<FormState>(initialForm);
  const [acks, setAcks] = useState<AcksState>(() => initialAcksState());
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [formLoadedAt] = useState(() => Date.now());
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Dnešní datum (lokální TZ) jako spodní mez date inputů. Nastaveno až po mountu,
  // aby nedošlo k hydration mismatch mezi serverem a klientem.
  useEffect(() => {
    setMinDate(new Date().toLocaleDateString("en-CA"));
    // horní mez je posuvná (dnes + 90 dní) — počítá se až v prohlížeči,
    // jinak by zamrzla na datu buildu statické stránky
    setMaxDate(maxDatumISO());
  }, []);

  // Když se objeví chyba, odscrollujeme na ni — uživatel musí vidět, že se něco stalo.
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  function update<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((p) => ({ ...p, [key]: val }));
  }
  function updateNavrh(i: number, key: keyof NavrhRow, val: string) {
    setForm((p) => {
      const navrhy = p.navrhy.slice();
      navrhy[i] = { ...navrhy[i], [key]: val };
      return { ...p, navrhy };
    });
  }
  function addNavrh() {
    setForm((p) => (p.navrhy.length >= 5 ? p : { ...p, navrhy: [...p.navrhy, { ...emptyNavrh }] }));
  }
  function removeNavrh(i: number) {
    setForm((p) => {
      if (p.navrhy.length <= 3) return p;
      const navrhy = p.navrhy.slice();
      navrhy.splice(i, 1);
      return { ...p, navrhy };
    });
  }

  async function submit(e: FormEvent) {
    e.preventDefault();

    if (!allAcksAccepted(acks)) {
      setErrorMsg("Prosím odsouhlaste všechny body výše, než odešlete návrhy termínů.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const honeypot = (
      (e.target as HTMLFormElement).querySelector(
        'input[name="website"]'
      ) as HTMLInputElement | null
    )?.value ?? "";

    try {
      const res = await fetch("/api/prohlidky/alternativy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          acks,
          website: honeypot,
          _t: formLoadedAt,
        }),
      });

      let data: { success?: boolean; error?: string } = {};
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error("Prohlidky: non-JSON response", res.status, jsonErr);
      }

      if (res.ok && data.success) {
        setView("success");
        setStatus("idle");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const fallback =
        res.status >= 500
          ? `Server hlásí chybu (HTTP ${res.status}). Zkuste to prosím za chvíli znovu — pokud problém přetrvá, napište nám na reditel@doucse.cz.`
          : `Odeslání se nepodařilo (HTTP ${res.status}). Zkuste to prosím znovu.`;
      setErrorMsg(data.error || fallback);
      setStatus("error");
    } catch (err) {
      console.error("Prohlidky network error:", err);
      setErrorMsg(
        "Chyba spojení — návrhy se nepodařilo odeslat. Zkontrolujte připojení a zkuste to znovu. Pokud problém přetrvá, napište nám na reditel@doucse.cz."
      );
      setStatus("error");
    }
  }

  // ============ SUCCESS ============
  if (view === "success") {
    return (
      <div className="card relative overflow-hidden rounded-[2rem] p-8 sm:p-12 text-center shadow-lift">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-forest text-white ring-8 ring-forest-pale shadow-lift mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[1.9rem] leading-tight sm:text-4xl font-extrabold text-dark mb-4">Děkujeme, máme to!</h3>
        <p className="text-brown text-[1.05rem] leading-relaxed max-w-xl mx-auto">
          Vaše návrhy termínů jsme přijali a brzy se vám ozveme, abychom domluvili
          konkrétní čas individuální prohlídky. Souhrn vašich návrhů jsme vám
          právě poslali na e-mail.
        </p>
        <a
          href="/"
          className="btn btn-outline mt-8"
        >
          ← Zpět na hlavní stránku
        </a>
      </div>
    );
  }

  // ============ FORM ============
  return (
    <div className="card relative rounded-[2rem] p-6 sm:p-10 lg:p-12 shadow-lift ring-1 ring-dark/5">
      <h3 className="text-[1.75rem] leading-[1.1] sm:text-[2.25rem] font-extrabold text-dark mb-3">
        Domluvte si individuální prohlídku
      </h3>
      <p className="text-brown text-[0.95rem] sm:text-base mb-8 leading-relaxed max-w-2xl [&_strong]:text-dark [&_strong]:bg-sun [&_strong]:rounded-md [&_strong]:px-1 [&_strong]:box-decoration-clone">
        Prohlídky děláme individuálně, ať máme čas v&nbsp;klidu vás provést
        a&nbsp;odpovědět na vaše otázky. Napište nám prosím <strong>alespoň 3 termíny</strong>
, kdy by se vám hodilo přijít, a&nbsp;my se vám ozveme
        s&nbsp;konkrétním návrhem.
      </p>

      <form onSubmit={submit} className="space-y-7">
        {/* Honeypot */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FieldText
            label="Jméno rodiče *"
            id="parentName"
            autoComplete="name"
            value={form.parentName}
            onChange={(v) => update("parentName", v)}
            placeholder="Jana Nováková"
            required
          />
          <FieldText
            label="Telefon *"
            id="phone"
            autoComplete="tel"
            type="tel"
            value={form.phone}
            onChange={(v) => update("phone", v)}
            placeholder="775 123 456"
            required
          />
          <FieldText
            label="E-mail *"
            id="email"
            autoComplete="email"
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            placeholder="jana@email.cz"
            required
          />
          <FieldText
            label="E-mail (znovu pro kontrolu) *"
            id="emailConfirm"
            autoComplete="off"
            type="email"
            value={form.emailConfirm}
            onChange={(v) => update("emailConfirm", v)}
            placeholder="jana@email.cz"
            required
          />
        </div>

        <div>
          <label htmlFor="childrenInfo" className="block text-sm font-semibold text-dark mb-2">
            Pro které děti se hlásíte? *
          </label>
          <textarea
            id="childrenInfo"
            rows={3}
            required
            value={form.childrenInfo}
            onChange={(e) => update("childrenInfo", e.target.value)}
            className={`${POLE} resize-none`}
            placeholder="např. Honzík (7 let, půjde do 2. třídy) a Anička (5 let, předškolák)"
          />
        </div>

        <div>
          <label htmlFor="childrenCount" className="block text-sm font-semibold text-dark mb-2">
            Kolik dětí přijde celkem na prohlídku? *
          </label>
          <input
            id="childrenCount"
            type="number"
            min={1}
            max={20}
            required
            value={form.childrenCount}
            onChange={(e) => update("childrenCount", Math.max(1, Number(e.target.value) || 1))}
            className={`${POLE} sm:w-32 text-center font-bold`}
          />
        </div>

        <div className="relative rounded-[1.5rem] bg-forest-pale/70 p-4 sm:p-6 ring-1 ring-forest/10">
          <p className="text-base font-bold text-dark mb-1">
            Vaše navrhované termíny <span className="text-brown font-medium">(min. 3)</span>
          </p>
          <p className="text-[0.8125rem] text-brown leading-relaxed mb-4">
            Ideálně různé dny a&nbsp;časy — ať máme z&nbsp;čeho vybírat a&nbsp;rychle se domluvíme.
          </p>
          <div className="space-y-3">
            {form.navrhy.map((n, i) => (
              <div
                key={i}
                className={`grid grid-cols-2 sm:grid-cols-[1.35fr_1fr_1fr_auto] gap-x-2.5 gap-y-3 items-end rounded-2xl bg-white p-3.5 sm:p-4 transition duration-300 ${
                  n.datum && n.cas_od && n.cas_do
                    ? "ring-2 ring-forest/70 shadow-soft"
                    : "ring-1 ring-beige-dark"
                }`}
              >
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[0.8125rem] font-semibold text-brown mb-1.5">Datum</label>
                  <input
                    type="date"
                    required={i < 3}
                    min={minDate || undefined}
                    max={maxDate || undefined}
                    value={n.datum}
                    onChange={(e) => updateNavrh(i, "datum", e.target.value)}
                    className={POLE_TERMIN}
                  />
                </div>
                <div>
                  <label className="block text-[0.8125rem] font-semibold text-brown mb-1.5">Čas od</label>
                  <input
                    type="time"
                    required={i < 3}
                    value={n.cas_od}
                    onChange={(e) => updateNavrh(i, "cas_od", e.target.value)}
                    className={POLE_TERMIN}
                  />
                </div>
                <div>
                  <label className="block text-[0.8125rem] font-semibold text-brown mb-1.5">Čas do</label>
                  <input
                    type="time"
                    required={i < 3}
                    value={n.cas_do}
                    onChange={(e) => updateNavrh(i, "cas_do", e.target.value)}
                    className={POLE_TERMIN}
                  />
                </div>
                {form.navrhy.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => removeNavrh(i)}
                    className="col-span-2 sm:col-span-1 justify-self-end flex h-12 w-12 items-center justify-center rounded-full bg-beige text-brown-light hover:bg-orange/20 hover:text-brown text-base font-bold transition"
                    aria-label="Odstranit návrh"
                  >
                    ✕
                  </button>
                ) : (
                  <div className="hidden sm:block" />
                )}
              </div>
            ))}
          </div>

          {form.navrhy.length < 5 && (
            <button
              type="button"
              onClick={addNavrh}
              className="mt-4 inline-flex min-h-12 items-center rounded-full border-2 border-dashed border-forest/40 bg-white/70 px-5 text-forest text-sm font-bold hover:border-forest hover:bg-white transition"
            >
              + Přidat další termín
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-dark mb-2">
            Poznámka (nepovinné)
          </label>
          <textarea
            rows={3}
            value={form.poznamka}
            onChange={(e) => update("poznamka", e.target.value)}
            className={`${POLE} resize-none`}
            placeholder="Cokoliv, co je dobré vědět dopředu — alergie, speciální potřeby, atd."
          />
        </div>

        <AcknowledgementChecklist
          value={acks}
          onChange={(k, v) => setAcks((p) => ({ ...p, [k]: v }))}
          heading="Než si domluvíte prohlídku — co je dobré vědět"
        />

        <label
          className={`flex items-start gap-3.5 cursor-pointer rounded-2xl p-4 sm:p-5 transition ${
            form.gdpr ? "bg-forest-pale ring-2 ring-forest/50" : "bg-cream ring-1 ring-beige-dark hover:ring-moss"
          }`}
        >
          <input
            type="checkbox"
            required
            checked={form.gdpr}
            onChange={(e) => update("gdpr", e.target.checked)}
            className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-beige-dark text-forest focus:ring-forest/30 accent-forest cursor-pointer"
          />
          <span className="text-sm text-brown leading-relaxed">
            Souhlasím se zpracováním osobních údajů za účelem domluvy
            termínu prohlídky. Údaje nebudou předány třetím stranám. *
          </span>
        </label>

        {errorMsg && (
          <div
            ref={errorRef}
            role="alert"
            aria-live="assertive"
            className="p-4 sm:p-5 rounded-2xl bg-red-50 border-2 border-red-300 text-red-900 flex gap-3"
          >
            <span className="text-xl flex-shrink-0" aria-hidden="true">⚠️</span>
            <p className="text-sm leading-relaxed font-medium">{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !allAcksAccepted(acks) || !form.gdpr}
          className="btn btn-sun btn-shine w-full sm:w-auto min-h-[3.75rem] px-10 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-orange disabled:hover:transform-none disabled:after:hidden"
          title={
            !allAcksAccepted(acks)
              ? "Odsouhlaste prosím všechny body výše"
              : !form.gdpr
              ? "Potvrďte prosím souhlas se zpracováním údajů"
              : ""
          }
        >
          {status === "sending" ? "Odesílám…" : "Odeslat návrhy termínů"}
        </button>
      </form>
    </div>
  );
}

// ===== shared field =====
function FieldText({
  label,
  id,
  value,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-dark mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={POLE}
      />
    </div>
  );
}
