"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { MEDAILONEK_COOKIE } from "@/lib/medailonky";

/**
 * Jednoduchá zámek na stránku s návrhem medailonků. Nejde o citlivá data,
 * jen nechceme, aby neschválený návrh viděl kdokoliv, kdo trefí adresu.
 * Kód se uloží do cookie a stránku pak vykreslí až server.
 */
export default function MedailonekGate() {
  const router = useRouter();
  const [kod, setKod] = useState("");
  const [chyba, setChyba] = useState(false);

  function odesli(e: FormEvent) {
    e.preventDefault();
    const cisty = kod.trim();
    if (!/^\d{3,8}$/.test(cisty)) {
      setChyba(true);
      return;
    }
    document.cookie = `${MEDAILONEK_COOKIE}=${cisty}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
    setChyba(false);
    router.refresh();
    // kdyby byl kód špatně, server vrátí zase tenhle formulář
    setTimeout(() => setChyba(true), 1500);
  }

  return (
    <main className="min-h-screen bg-beige flex items-center justify-center px-4 py-20">
      <form
        onSubmit={odesli}
        className="bg-white rounded-2xl p-8 w-full max-w-sm text-center"
      >
        <h1 className="text-xl font-bold text-dark">Zatím jen pro pozvané</h1>
        <p className="mt-2 text-sm text-dark/70 leading-relaxed">
          Tahle stránka je ještě rozpracovaná. Zadejte prosím kód, který jste
          dostali v e-mailu.
        </p>
        <input
          value={kod}
          onChange={(e) => {
            setKod(e.target.value);
            setChyba(false);
          }}
          inputMode="numeric"
          autoFocus
          placeholder="kód"
          className="mt-5 w-full text-center tracking-[0.4em] text-lg rounded-xl border border-dark/15 px-4 py-3 outline-none focus:border-orange"
        />
        {chyba && (
          <p className="mt-2 text-sm text-red-600">
            Kód nesedí, zkuste to prosím znovu.
          </p>
        )}
        <button
          type="submit"
          className="mt-4 w-full rounded-xl bg-orange hover:bg-orange-hover transition-colors px-4 py-3 font-semibold text-dark"
        >
          Zobrazit
        </button>
      </form>
    </main>
  );
}
