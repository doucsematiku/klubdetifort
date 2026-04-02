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
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function update(field: keyof FormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm(initialForm);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-forest-pale rounded-2xl p-8 sm:p-12 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h3 className="text-2xl font-bold text-forest mb-2">
          Děkujeme za váš zájem!
        </h3>
        <p className="text-brown">
          Vaši zprávu jsme přijali a brzy se vám ozveme.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Parent name */}
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-dark mb-1.5">
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
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
            placeholder="Jana Nováková"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">
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
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
            placeholder="jana@email.cz"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-dark mb-1.5">
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
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
            placeholder="775 123 456"
          />
        </div>

        {/* Child name */}
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-dark mb-1.5">
            Jméno dítěte
          </label>
          <input
            id="childName"
            type="text"
            value={form.childName}
            onChange={(e) => update("childName", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
            placeholder="Honzík"
          />
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="childGrade" className="block text-sm font-medium text-dark mb-1.5">
            Ročník ZŠ
          </label>
          <select
            id="childGrade"
            value={form.childGrade}
            onChange={(e) => update("childGrade", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
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
          <label htmlFor="ivStatus" className="block text-sm font-medium text-dark mb-1.5">
            Individuální vzdělávání
          </label>
          <select
            id="ivStatus"
            value={form.ivStatus}
            onChange={(e) => update("ivStatus", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors"
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
        <label htmlFor="message" className="block text-sm font-medium text-dark mb-1.5">
          Zpráva nebo dotaz
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-beige-dark bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest transition-colors resize-none"
          placeholder="Napište nám cokoliv — rádi zodpovíme vaše otázky..."
        />
      </div>

      {/* GDPR */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={form.gdpr}
          onChange={(e) => update("gdpr", e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-beige-dark text-forest focus:ring-forest/30 accent-forest"
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
        className="w-full sm:w-auto bg-orange hover:bg-orange-hover disabled:opacity-60 text-dark font-bold px-10 py-4 rounded-full transition-colors text-lg"
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
