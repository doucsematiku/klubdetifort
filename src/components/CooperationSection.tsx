"use client";

import { useState, useRef, type FormEvent } from "react";
import { HandHeart, Package, PiggyBank, UserRound, type LucideIcon } from "lucide-react";

/** ikony karet v pořadí karet (čistá dekorace) */
const IKONY: { ikona: LucideIcon; bublina: string }[] = [
  { ikona: UserRound, bublina: "bg-forest text-white" },
  { ikona: HandHeart, bublina: "bg-sun text-brown" },
  { ikona: PiggyBank, bublina: "bg-orange/25 text-brown" },
  { ikona: Package, bublina: "bg-forest-pale text-forest" },
];

const POLE =
  "w-full min-h-[3.25rem] border border-beige-dark bg-cream/70 rounded-2xl px-4 py-3 text-base text-dark placeholder:text-brown-light/50 hover:border-brown-light/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange/25 focus:border-orange transition-all";

interface CoopFormData {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  gdpr: boolean;
}

const initialForm: CoopFormData = {
  name: "",
  email: "",
  phone: "",
  interest: "",
  message: "",
  gdpr: false,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export default function CooperationSection() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CoopFormData>(initialForm);
  const [formLoadedAt, setFormLoadedAt] = useState(0);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const fileRef = useRef<HTMLInputElement>(null);

  function update(field: keyof CoopFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError("");
    const file = e.target.files?.[0];
    if (!file) {
      setCvFile(null);
      return;
    }
    if (file.type !== "application/pdf") {
      setFileError("Nahrajte prosím soubor ve formátu PDF.");
      setCvFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Soubor je příliš velký (max 5 MB).");
      setCvFile(null);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setCvFile(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = new FormData();
      body.append("name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone);
      body.append("interest", form.interest);
      body.append("message", form.message);
      body.append("gdpr", String(form.gdpr));
      body.append("_t", String(formLoadedAt));
      if (cvFile) {
        body.append("cv", cvFile);
      }

      const res = await fetch("/api/cooperation", {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="text-center py-8">
        <p className="text-forest font-bold text-xl mb-2">
          Děkujeme za váš zájem!
        </p>
        <p className="text-brown">
          Ozveme se vám co nejdříve. Těšíme se na spolupráci.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
        {[
          {
            title: "Průvodce / Mentor",
            text: "Máte zkušenosti s prací s dětmi a chcete být součástí našeho týmu? Hledáme průvodce, kteří sdílejí naše hodnoty.",
          },
          {
            title: "Dobrovolník / Pomocník",
            text: "Chcete přiložit ruku k dílu? Pomoc s organizací akcí, údržbou zázemí nebo kreativními projekty — každá ruka se počítá.",
          },
          {
            title: "Finanční podpora",
            text: "Darem nebo sponzoringem nám pomůžete pokrýt náklady na vybavení, pomůcky a provoz klubu. Každá koruna se počítá.",
          },
          {
            title: "Materiální podpora",
            text: "Knihy, pomůcky, sportovní vybavení, nábytek, nářadí — pokud máte něco, co by se nám hodilo, rádi to přijmeme.",
          },
        ].map((item, i) => {
          const { ikona: Ikona, bublina } = IKONY[i % IKONY.length];
          return (
            <div
              key={item.title}
              className="reveal card card-lift flex gap-4 p-5 sm:block sm:p-7"
            >
              <span aria-hidden="true" className={`icon-bubble h-11 w-11 sm:mb-4 ${bublina}`}>
                <Ikona className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-bold text-dark text-lg leading-snug mb-1.5">{item.title}</h3>
                <p className="text-sm text-brown leading-relaxed">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={() => { setOpen(!open); if (!open) setFormLoadedAt(Date.now()); }}
          className="btn btn-forest text-lg w-full sm:w-auto sm:px-9"
        >
          {open ? "Skrýt formulář" : "Chci se zapojit"}
          <svg
            className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {open && (
        <form
          onSubmit={handleSubmit}
          className="fade-in max-w-2xl mx-auto mt-8 bg-white rounded-[2rem] p-6 sm:p-10 shadow-lift space-y-5"
        >
          {/* Honeypot — hidden from humans, filled by bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">
                Jméno *
              </label>
              <input
                type="text"
                name="name"
                autoComplete="name"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jan Novák"
                className={POLE}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="jan@email.cz"
                className={POLE}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="775 123 456"
                className={POLE}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">
                Mám zájem o *
              </label>
              <select
                required
                value={form.interest}
                onChange={(e) => update("interest", e.target.value)}
                className={POLE}
              >
                <option value="">Vyberte...</option>
                <option value="pruvodce">Průvodcování / Mentoring</option>
                <option value="dobrovolnik">Dobrovolnictví / Pomoc</option>
                <option value="financni">Finanční podpora / Sponzoring</option>
                <option value="materialni">Materiální podpora</option>
                <option value="jine">Jiné</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Zpráva
            </label>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
              placeholder="Napište nám o sobě, svých zkušenostech nebo jak byste nám chtěli pomoci..."
              className={`${POLE} resize-none`}
            />
          </div>

          {/* CV upload */}
          <div>
            <label className="block text-sm font-semibold text-dark mb-1">
              Životopis (PDF, max 5 MB)
            </label>
            <div className="relative">
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full text-sm text-brown file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-forest-pale file:text-forest hover:file:bg-forest/10 file:cursor-pointer cursor-pointer border-2 border-dashed border-beige-dark bg-cream/70 rounded-2xl p-2"
              />
            </div>
            {cvFile && (
              <p className="text-sm text-forest mt-1.5">
                {cvFile.name} ({(cvFile.size / 1024).toFixed(0)} kB)
              </p>
            )}
            {fileError && (
              <p className="text-sm text-red-600 mt-1.5">{fileError}</p>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={form.gdpr}
              onChange={(e) => update("gdpr", e.target.checked)}
              className="mt-1 w-4 h-4 accent-forest"
            />
            <span className="text-sm text-brown-light">
              Souhlasím se zpracováním osobních údajů za účelem odpovědi na můj
              dotaz. Údaje nebudou předány třetím stranám. *
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn btn-sun w-full sm:w-auto disabled:opacity-50"
          >
            {status === "sending" ? "Odesílám..." : "Odeslat zprávu"}
          </button>

          {status === "error" && (
            <p className="text-red-600 text-sm">
              Něco se pokazilo. Zkuste to znovu nebo nám zavolejte na 775 917 363.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
