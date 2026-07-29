import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kdo bude s dětmi | Klub Fořt",
  description:
    "Průvodkyně Klubíku Fořt a rozvrh týdne — kdo je s dětmi v pondělí, úterý a ve středu.",
  // TODO: až budou doplněné medailonky a fotky, změnit na index: true
  robots: { index: false, follow: false },
};

/** Rozvrh týdne — kdo má který den službu. Zdroj: rozpis služeb v aplikaci. */
const TYDEN: { den: string; sluzby: { kdo: string; cas: string }[] }[] = [
  {
    den: "Pondělí",
    sluzby: [{ kdo: "Ivana Hrubá", cas: "8:00–16:00" }],
  },
  {
    den: "Úterý",
    sluzby: [
      { kdo: "Lenka Formánková", cas: "8:00–12:00" },
      { kdo: "Ivana Hrubá", cas: "12:00–16:00" },
    ],
  },
  {
    den: "Středa",
    sluzby: [{ kdo: "Lenka Formánková", cas: "8:00–16:00" }],
  },
];

const PRUVODKYNE: { jmeno: string; role: string; medailonek: string }[] = [
  {
    jmeno: "Lenka Formánková",
    role: "průvodkyně",
    medailonek: "", // TODO: doplnit medailonek
  },
  {
    jmeno: "Ivana Hrubá",
    role: "průvodkyně",
    medailonek: "", // TODO: doplnit medailonek
  },
];

export default function PruvodkynePage() {
  return (
    <main className="min-h-screen bg-beige">
      <div className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">Kdo bude s dětmi</h1>
          <p className="mt-4 text-white/80 leading-relaxed">
            V klubíku jsou děti ve dvou stálých dvojicích rukou. Není to velký
            kolektiv, kde se personál střídá — děti mají celý rok stejné
            průvodkyně a ty znají každé z nich jménem.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ── rozvrh týdne ── */}
        <section>
          <h2 className="text-2xl font-bold text-dark">Rozvrh týdne</h2>
          <p className="mt-2 text-dark/70 leading-relaxed">
            Klubík je otevřený <strong>v pondělí, úterý a ve středu</strong>,
            vždy od 8:00 do 16:00. Čtvrtek a pátek jsou zavřené — děti ty dny
            zůstávají doma nebo ve své kmenové škole.
          </p>

          <div className="mt-6 space-y-3">
            {TYDEN.map((d) => (
              <div
                key={d.den}
                className="bg-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-3"
              >
                <p className="font-bold text-dark w-28 shrink-0">{d.den}</p>
                <div className="flex-1 space-y-1">
                  {d.sluzby.map((s) => (
                    <p key={s.kdo + s.cas} className="text-dark/80">
                      {s.kdo}{" "}
                      <span className="text-dark/50 text-sm">— {s.cas}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-dark/60 leading-relaxed">
            Aktuální rozpis na každý konkrétní den — včetně případných zástupů —
            uvidíte po přihlášení v aplikaci u daného dne.
          </p>
        </section>

        {/* ── medailonky ── */}
        <section>
          <h2 className="text-2xl font-bold text-dark">Naše průvodkyně</h2>
          <div className="mt-6 space-y-4">
            {PRUVODKYNE.map((p) => (
              <div key={p.jmeno} className="bg-white rounded-2xl p-6">
                <p className="font-bold text-dark text-lg">{p.jmeno}</p>
                <p className="text-sm text-orange font-semibold">{p.role}</p>
                {p.medailonek ? (
                  <p className="mt-3 text-dark/80 leading-relaxed">
                    {p.medailonek}
                  </p>
                ) : (
                  <p className="mt-3 text-dark/50 leading-relaxed italic">
                    Medailonek doplníme v nejbližších dnech.
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── co to znamená pro rodiče ── */}
        <section className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold text-dark">
            Na koho se obrátit během dne
          </h2>
          <p className="mt-3 text-dark/80 leading-relaxed">
            Nejjednodušší je napsat do aplikace — zpráva dojde celému týmu
            najednou a odpoví ta z nás, které se to týká. Nemusíte řešit, kdo
            má zrovna službu.
          </p>
          <p className="mt-3 text-dark/80 leading-relaxed">
            Když jde o něco naléhavého — dítěti se udělá zle, zdržíte se
            cestou — volejte. Číslo najdete v aplikaci v Profilu.
          </p>
          <Link
            href="/pro-nove-rodice"
            className="inline-block mt-4 text-sm font-semibold text-orange"
          >
            Jak probíhá přihlášení do klubu →
          </Link>
        </section>
      </div>
    </main>
  );
}
