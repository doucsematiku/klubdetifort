"use client";

import { useEffect, useState, type FormEvent } from "react";

type DayInfo = {
  iso: string;
  label: string;
  theme: string;
  capacity: number;
  used: number;
  free: number;
  soldOut: boolean;
};

interface FormState {
  parentName: string;
  childName: string;
  childAge: string;
  email: string;
  phone: string;
  days: string[];
  note: string;
  gdpr: boolean;
}

const initialForm: FormState = {
  parentName: "",
  childName: "",
  childAge: "",
  email: "",
  phone: "",
  days: [],
  note: "",
  gdpr: false,
};

const PRICE_PER_DAY = 600;

function formatCZK(amount: number): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PrazdninyForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [days, setDays] = useState<DayInfo[] | null>(null);
  const [loadingDays, setLoadingDays] = useState(true);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formLoadedAt] = useState(() => Date.now());

  useEffect(() => {
    void fetchAvailability();
  }, []);

  async function fetchAvailability() {
    setLoadingDays(true);
    try {
      const res = await fetch("/api/prazdniny-availability", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { days: DayInfo[] };
        setDays(data.days);
      }
    } catch (err) {
      console.error("availability fetch failed", err);
    } finally {
      setLoadingDays(false);
    }
  }

  function toggleDay(iso: string) {
    setForm((prev) => {
      const has = prev.days.includes(iso);
      return {
        ...prev,
        days: has ? prev.days.filter((d) => d !== iso) : [...prev.days, iso],
      };
    });
  }

  function update<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const totalKc = form.days.length * PRICE_PER_DAY;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);

    const formEl = e.target as HTMLFormElement;
    const honeypot = (formEl.querySelector('input[name="website"]') as HTMLInputElement)?.value ?? "";

    try {
      const res = await fetch("/api/prazdniny-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentName: form.parentName,
          childName: form.childName,
          childAge: form.childAge,
          email: form.email,
          phone: form.phone,
          days: form.days,
          note: form.note,
          gdpr: form.gdpr,
          website: honeypot,
          _t: formLoadedAt,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          success: boolean;
          invoiceUrl: string | null;
          invoiceNumber: string | null;
          totalKc: number;
        };
        // Přesun na dedikovanou thank-you stránku (pro GA/Ads konverze + sdílitelnost URL)
        const firstName = form.parentName.trim().split(/\s+/)[0] ?? "";
        const params = new URLSearchParams({
          inv: data.invoiceNumber ?? "",
          total: String(data.totalKc),
          days: String(form.days.length),
          name: firstName,
        });
        window.location.href = `/prazdninovy-program/dekujeme?${params.toString()}`;
        return;
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setStatus("error");
        setErrorMessage(data.error ?? "Něco se nepovedlo. Zkuste to prosím znovu.");
        // pokud server vrátil, že dny jsou plné, refresh kapacity
        if (res.status === 409) void fetchAvailability();
      }
    } catch {
      setStatus("error");
      setErrorMessage("Nepodařilo se odeslat formulář. Zkontrolujte prosím internet.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Dny s kapacitou */}
      <div>
        <label className="block text-sm font-medium text-dark mb-3">
          Vyberte dny, kdy přijde vaše dítě <span className="text-orange-hover">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loadingDays && (
            <p className="text-brown-light text-sm col-span-2">Načítám volnou kapacitu…</p>
          )}
          {!loadingDays && days?.map((d) => {
            const checked = form.days.includes(d.iso);
            const disabled = d.soldOut;
            return (
              <label
                key={d.iso}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  disabled
                    ? "border-beige-dark bg-beige opacity-60 cursor-not-allowed"
                    : checked
                    ? "border-forest bg-forest-pale"
                    : "border-beige-dark bg-white hover:border-forest/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() => toggleDay(d.iso)}
                  className="mt-1 w-4 h-4 rounded text-forest focus:ring-forest/30 accent-forest"
                />
                <div className="flex-1">
                  <div className="font-bold text-dark">{d.label}</div>
                  <div className="text-sm text-brown">
                    Inspirace: <strong>{d.theme}</strong>
                  </div>
                  <div className="text-xs mt-1.5">
                    {d.soldOut ? (
                      <span className="text-red-600 font-semibold">Plně obsazeno</span>
                    ) : d.free <= 2 ? (
                      <span className="text-red-600 font-semibold">
                        {d.free === 1
                          ? "🔥 Poslední volné místo!"
                          : `🔥 Poslední ${d.free} volná místa!`}
                      </span>
                    ) : d.free <= 5 ? (
                      <span className="text-orange-hover font-semibold">
                        Volných míst: {d.free} / {d.capacity}
                      </span>
                    ) : (
                      <span className="text-forest font-medium">
                        Volných míst: {d.free} / {d.capacity}
                      </span>
                    )}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {form.days.length > 0 && (
          <p className="mt-4 text-base text-dark bg-orange/10 border border-orange/30 rounded-xl px-4 py-3">
            Vybráno <strong>{form.days.length}</strong>{" "}
            {form.days.length === 1 ? "den" : form.days.length < 5 ? "dny" : "dní"} ·
            Cena celkem: <strong>{formatCZK(totalKc)}</strong>{" "}
            <span className="text-sm text-brown-light">(bez oběda — připravte dítěti s sebou)</span>
          </p>
        )}
      </div>

      {/* Parent + child */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-dark mb-1.5">
            Jméno rodiče <span className="text-orange-hover">*</span>
          </label>
          <input
            id="parentName"
            name="name"
            autoComplete="name"
            type="text"
            required
            value={form.parentName}
            onChange={(e) => update("parentName", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            placeholder="Jana Nováková"
          />
        </div>

        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-dark mb-1.5">
            Jméno dítěte <span className="text-orange-hover">*</span>
          </label>
          <input
            id="childName"
            type="text"
            required
            value={form.childName}
            onChange={(e) => update("childName", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            placeholder="Honzík (8 let)"
          />
        </div>

        <div>
          <label htmlFor="childAge" className="block text-sm font-medium text-dark mb-1.5">
            Věk dítěte
          </label>
          <input
            id="childAge"
            type="text"
            inputMode="numeric"
            value={form.childAge}
            onChange={(e) => update("childAge", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            placeholder="např. 8"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1.5">
            Telefon <span className="text-orange-hover">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            placeholder="775 123 456"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">
            E-mail <span className="text-orange-hover">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest"
            placeholder="jana@email.cz"
          />
          <p className="text-xs text-brown-light mt-1">
            Pošleme na něj potvrzení rezervace i fakturu.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-dark mb-1.5">
          Poznámka
        </label>
        <textarea
          id="note"
          rows={3}
          value={form.note}
          onChange={(e) => update("note", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest resize-none"
          placeholder="Cokoli, co bychom měli vědět…"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={form.gdpr}
          onChange={(e) => update("gdpr", e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-forest focus:ring-forest/30 accent-forest"
        />
        <span className="text-sm text-brown-light leading-relaxed">
          Souhlasím se zpracováním osobních údajů za účelem rezervace prázdninového programu
          a vystavení faktury. Údaje nebudou předány třetím stranám.{" "}
          <span className="text-orange-hover">*</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "sending" || form.days.length === 0}
        className="w-full sm:w-auto bg-orange hover:bg-orange-hover disabled:opacity-60 disabled:cursor-not-allowed text-dark font-bold px-10 py-4 rounded-full transition-colors text-lg"
      >
        {status === "sending"
          ? "Odesílám…"
          : form.days.length === 0
          ? "Vyberte den"
          : `Závazně rezervovat za ${formatCZK(totalKc)}`}
      </button>

      {status === "error" && errorMessage && (
        <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
