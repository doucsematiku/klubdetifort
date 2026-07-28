"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import AcknowledgementChecklist from "@/components/AcknowledgementChecklist";
import {
  allAcksAccepted,
  initialAcksState,
  type AcksState,
} from "@/lib/prohlidky-acks";
import { MAX_DATE } from "@/lib/prohlidky-config";

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
  const errorRef = useRef<HTMLDivElement | null>(null);

  // Dnešní datum (lokální TZ) jako spodní mez date inputů. Nastaveno až po mountu,
  // aby nedošlo k hydration mismatch mezi serverem a klientem.
  useEffect(() => {
    setMinDate(new Date().toLocaleDateString("en-CA"));
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
      <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-forest-pale text-forest mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-dark mb-3">Děkujeme, máme to!</h3>
        <p className="text-brown leading-relaxed">
          Vaše návrhy termínů jsme přijali a brzy se vám ozveme, abychom domluvili
          konkrétní čas individuální prohlídky. Souhrn vašich návrhů jsme vám
          právě poslali na e-mail.
        </p>
        <a
          href="/"
          className="inline-block mt-6 text-forest font-semibold hover:underline"
        >
          ← Zpět na hlavní stránku
        </a>
      </div>
    );
  }

  // ============ FORM ============
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-10">
      <h3 className="text-xl sm:text-2xl font-bold text-dark mb-2">
        Domluvte si individuální prohlídku
      </h3>
      <p className="text-brown text-sm mb-6 leading-relaxed">
        Prohlídky děláme individuálně, ať máme čas v&nbsp;klidu vás provést
        a&nbsp;odpovědět na vaše otázky. Napište nám prosím <strong>alespoň 3 termíny</strong>
        {" "}(do&nbsp;konce srpna), kdy by se vám hodilo přijít, a&nbsp;my se vám ozveme
        s&nbsp;konkrétním návrhem.
      </p>

      <form onSubmit={submit} className="space-y-5">
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
          <label htmlFor="childrenInfo" className="block text-sm font-medium text-dark mb-1.5">
            Pro které děti se hlásíte? *
          </label>
          <textarea
            id="childrenInfo"
            rows={3}
            required
            value={form.childrenInfo}
            onChange={(e) => update("childrenInfo", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors resize-none"
            placeholder="např. Honzík (7 let, půjde do 2. třídy) a Anička (5 let, předškolák)"
          />
        </div>

        <div>
          <label htmlFor="childrenCount" className="block text-sm font-medium text-dark mb-1.5">
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
            className="w-full sm:w-32 px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
          />
        </div>

        <div className="bg-beige rounded-xl p-4 sm:p-5">
          <p className="text-sm font-semibold text-dark mb-1">
            Vaše navrhované termíny <span className="text-brown-light font-normal">(min. 3, do konce srpna)</span>
          </p>
          <p className="text-xs text-brown-light mb-3">
            Ideálně různé dny a&nbsp;časy — ať máme z&nbsp;čeho vybírat a&nbsp;rychle se domluvíme.
          </p>
          <div className="space-y-3">
            {form.navrhy.map((n, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                <div>
                  <label className="block text-xs text-brown-light mb-1">Datum</label>
                  <input
                    type="date"
                    required={i < 3}
                    min={minDate || undefined}
                    max={MAX_DATE}
                    value={n.datum}
                    onChange={(e) => updateNavrh(i, "datum", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brown-light mb-1">Čas od</label>
                  <input
                    type="time"
                    required={i < 3}
                    value={n.cas_od}
                    onChange={(e) => updateNavrh(i, "cas_od", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-brown-light mb-1">Čas do</label>
                  <input
                    type="time"
                    required={i < 3}
                    value={n.cas_do}
                    onChange={(e) => updateNavrh(i, "cas_do", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest text-sm"
                  />
                </div>
                {form.navrhy.length > 3 ? (
                  <button
                    type="button"
                    onClick={() => removeNavrh(i)}
                    className="text-brown-light hover:text-orange text-sm font-medium px-3 py-2.5"
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
              className="mt-3 text-forest text-sm font-semibold hover:underline"
            >
              + Přidat další termín
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">
            Poznámka (nepovinné)
          </label>
          <textarea
            rows={3}
            value={form.poznamka}
            onChange={(e) => update("poznamka", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors resize-none"
            placeholder="Cokoliv, co je dobré vědět dopředu — alergie, speciální potřeby, atd."
          />
        </div>

        <AcknowledgementChecklist
          value={acks}
          onChange={(k, v) => setAcks((p) => ({ ...p, [k]: v }))}
          heading="Než si domluvíte prohlídku — co je dobré vědět"
        />

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={form.gdpr}
            onChange={(e) => update("gdpr", e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-beige-dark text-forest focus:ring-forest/30 accent-forest"
          />
          <span className="text-sm text-brown-light leading-relaxed">
            Souhlasím se zpracováním osobních údajů za účelem domluvy
            termínu prohlídky. Údaje nebudou předány třetím stranám. *
          </span>
        </label>

        {errorMsg && (
          <div
            ref={errorRef}
            role="alert"
            aria-live="assertive"
            className="p-4 rounded-lg bg-red-50 border-2 border-red-300 text-red-900 flex gap-3"
          >
            <span className="text-xl flex-shrink-0" aria-hidden="true">⚠️</span>
            <p className="text-sm leading-relaxed font-medium">{errorMsg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === "sending" || !allAcksAccepted(acks) || !form.gdpr}
          className="w-full sm:w-auto bg-orange hover:bg-orange-hover disabled:opacity-50 disabled:cursor-not-allowed text-dark font-bold px-10 py-4 rounded-full transition-colors text-lg"
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
      <label htmlFor={id} className="block text-sm font-medium text-dark mb-1.5">
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
        className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
      />
    </div>
  );
}
