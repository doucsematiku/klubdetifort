"use client";

import { useState, type FormEvent } from "react";

type Verdikt = "schvaluji" | "pripominka";

/**
 * Odklepnutí medailonku samotnou průvodkyní. Buď „souhlasím, může na web",
 * nebo připomínka s komentářem — obojí se pošle do klubu i jí na mail.
 */
export default function MedailonekSouhlas({
  id,
  jmeno,
  kod,
}: {
  id: string;
  jmeno: string;
  kod: string;
}) {
  const [verdikt, setVerdikt] = useState<Verdikt | null>(null);
  const [email, setEmail] = useState("");
  const [komentar, setKomentar] = useState("");
  const [stav, setStav] = useState<"formular" | "odesilam" | "hotovo">("formular");
  const [chyba, setChyba] = useState("");

  async function odesli(e: FormEvent) {
    e.preventDefault();
    setChyba("");
    if (!verdikt) return setChyba("Vyberte prosím jednu z možností.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setChyba("Doplňte prosím svůj e-mail, ať víme, od koho odpověď je.");
    if (verdikt === "pripominka" && komentar.trim().length < 3)
      return setChyba("Napište prosím, co chcete změnit.");

    setStav("odesilam");
    try {
      const res = await fetch("/api/medailonek-souhlas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          jmeno,
          verdikt,
          email: email.trim(),
          komentar: komentar.trim(),
          kod,
        }),
      });
      if (!res.ok) throw new Error("Odeslání se nepodařilo.");
      setStav("hotovo");
    } catch (err) {
      setStav("formular");
      setChyba(
        err instanceof Error
          ? `${err.message} Zkuste to prosím znovu, nebo napište na reditel@doucse.cz.`
          : "Odeslání se nepodařilo."
      );
    }
  }

  if (stav === "hotovo") {
    return (
      <div className="mt-6 rounded-2xl bg-forest-pale p-5">
        <p className="font-semibold text-forest">Děkujeme, odpověď máme.</p>
        <p className="mt-1 text-sm text-dark/70 leading-relaxed">
          {verdikt === "schvaluji"
            ? "Medailonek dáme na web v téhle podobě. Kdyby vás cokoliv napadlo, napište na reditel@doucse.cz."
            : "Text upravíme podle vaší připomínky a pošleme vám ho znovu ke schválení."}
        </p>
      </div>
    );
  }

  const moznost =
    "flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors text-left";

  return (
    <form onSubmit={odesli} className="mt-6 rounded-2xl bg-beige p-5">
      <p className="font-semibold text-dark">Souhlasíte se zveřejněním?</p>
      <p className="mt-1 text-sm text-dark/60 leading-relaxed">
        Nic nedáme na web dřív, než to odklepnete. Když se vám něco nezdá —
        text, fotka, cokoliv — napište to a opravíme.
      </p>

      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => setVerdikt("schvaluji")}
          className={`${moznost} ${
            verdikt === "schvaluji"
              ? "border-forest bg-forest text-white"
              : "border-dark/15 bg-white text-dark hover:border-forest"
          }`}
        >
          ✓ Souhlasím, může na web
        </button>
        <button
          type="button"
          onClick={() => setVerdikt("pripominka")}
          className={`${moznost} ${
            verdikt === "pripominka"
              ? "border-orange bg-orange text-dark"
              : "border-dark/15 bg-white text-dark hover:border-orange"
          }`}
        >
          ✎ Chci něco upravit
        </button>
      </div>

      <label className="mt-4 block text-sm text-dark/70">
        Váš e-mail
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vas@email.cz"
          className="mt-1 w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-dark outline-none focus:border-orange"
        />
      </label>

      <label className="mt-3 block text-sm text-dark/70">
        {verdikt === "pripominka"
          ? "Co upravit?"
          : "Chcete něco vzkázat? (nepovinné)"}
        <textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          rows={4}
          placeholder="Např. který odstavec vyhodit, kterou fotku použít, co doplnit…"
          className="mt-1 w-full rounded-xl border border-dark/15 bg-white px-4 py-3 text-dark outline-none focus:border-orange"
        />
      </label>

      {chyba && <p className="mt-2 text-sm text-red-600">{chyba}</p>}

      <button
        type="submit"
        disabled={stav === "odesilam"}
        className="mt-4 rounded-xl bg-dark px-6 py-3 font-semibold text-white disabled:opacity-50"
      >
        {stav === "odesilam" ? "Odesílám…" : "Odeslat odpověď"}
      </button>
    </form>
  );
}
