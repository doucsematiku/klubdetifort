"use client";

import { useState, type FormEvent } from "react";

interface FormData {
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childGrade: string;
  ivStatus: string;
  message: string;
  gdpr: boolean;
}

const initialForm: FormData = {
  parentName: "",
  email: "",
  phone: "",
  childName: "",
  childGrade: "",
  ivStatus: "",
  message: "",
  gdpr: false,
};

export default function ContactForm() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [formLoadedAt] = useState(() => Date.now());

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const formEl = e.target as HTMLFormElement;
    const honeypot = (formEl.querySelector('input[name="website"]') as HTMLInputElement)?.value ?? "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot, _t: formLoadedAt }),
      });

      if (res.ok) {
        window.location.href = "/dekujeme";
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, filled by bots */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Parent name */}
        <div>
          <label htmlFor="parentName" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            Jméno rodiče *
          </label>
          <input
            id="parentName"
            name="name"
            autoComplete="name"
            type="text"
            required
            value={form.parentName}
            onChange={(e) => update("parentName", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
            placeholder="Jana Nováková"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            E-mail *
          </label>
          <input
            id="email"
            name="email"
            autoComplete="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
            placeholder="jana@email.cz"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            Telefon *
          </label>
          <input
            id="phone"
            name="phone"
            autoComplete="tel"
            type="tel"
            required
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
            placeholder="775 123 456"
          />
        </div>

        {/* Child name */}
        <div>
          <label htmlFor="childName" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            Jméno dítěte
          </label>
          <input
            id="childName"
            type="text"
            value={form.childName}
            onChange={(e) => update("childName", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
            placeholder="Honzík"
          />
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="childGrade" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            Ročník ZŠ
          </label>
          <select
            id="childGrade"
            value={form.childGrade}
            onChange={(e) => update("childGrade", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
          >
            <option value="">Vyberte...</option>
            <option value="1">1. třída</option>
            <option value="2">2. třída</option>
            <option value="3">3. třída</option>
            <option value="4">4. třída</option>
            <option value="5">5. třída</option>
          </select>
        </div>

        {/* IV status */}
        <div>
          <label htmlFor="ivStatus" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
            Individuální vzdělávání
          </label>
          <select
            id="ivStatus"
            value={form.ivStatus}
            onChange={(e) => update("ivStatus", e.target.value)}
            className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all"
          >
            <option value="">Vyberte...</option>
            <option value="ano">Ano, máme schválené IV</option>
            <option value="planuji">Teprve plánujeme</option>
            <option value="zajima">Chceme se dozvědět víc</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-dark mb-1.5 pl-1">
          Zpráva nebo dotaz
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full min-h-[3.25rem] px-4 py-3 rounded-2xl border border-beige-dark bg-cream/70 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all resize-none"
          placeholder="Napište nám cokoliv — rádi zodpovíme vaše otázky..."
        />
      </div>

      {/* GDPR */}
      <label className="flex items-start gap-3 cursor-pointer rounded-2xl bg-forest-pale/60 p-4">
        <input
          type="checkbox"
          required
          checked={form.gdpr}
          onChange={(e) => update("gdpr", e.target.checked)}
          className="mt-0.5 w-5 h-5 flex-shrink-0 rounded border-beige-dark text-forest focus:ring-forest/30 accent-forest"
        />
        <span className="text-sm text-brown-light leading-relaxed">
          Souhlasím se zpracováním osobních údajů za účelem odpovědi na můj
          dotaz. Údaje nebudou předány třetím stranám. *
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-sun btn-shine w-full sm:w-auto sm:px-10 text-lg disabled:opacity-60"
      >
        {status === "sending" ? "Odesílám..." : "Odeslat zprávu"}
      </button>

      {status === "error" && (
        <p className="text-red-600 text-sm">
          Něco se nepovedlo. Zkuste to prosím znovu, nebo nám zavolejte na 775 917 363.
        </p>
      )}
    </form>
  );
}
