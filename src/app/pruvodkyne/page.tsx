import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import MedailonekGate from "@/components/MedailonekGate";
import MedailonekSouhlas from "@/components/MedailonekSouhlas";
import {
  MEDAILONEK_COOKIE,
  MEDAILONEK_KOD,
  PRUVODKYNE,
} from "@/lib/medailonky";

export const metadata: Metadata = {
  title: "Kdo bude s dětmi | Klub Fořt",
  description:
    "Průvodkyně Klubíku Fořt — kdo je s dětmi celý rok a s čím do klubíku přichází.",
  // TODO: až medailonky schválí průvodkyně, zámek pryč a index: true
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PruvodkynePage({
  searchParams,
}: {
  searchParams: Promise<{ kod?: string }>;
}) {
  const { kod } = await searchParams;
  const zCookie = (await cookies()).get(MEDAILONEK_COOKIE)?.value;
  if (kod !== MEDAILONEK_KOD && zCookie !== MEDAILONEK_KOD) {
    return <MedailonekGate />;
  }

  return (
    <main className="min-h-screen bg-beige">
      {/* ── hlavička ── */}
      <header className="bg-dark text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange">
            Klubík Fořt
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Kdo bude s dětmi
          </h1>
          <div className="mt-5 h-px w-16 bg-orange" />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* ── návrh, ne hotová stránka ── */}
        <div className="rounded-2xl border border-orange/60 bg-orange/10 px-5 py-4">
          <p className="font-bold text-dark">Návrh — zatím to nikdo jiný nevidí</p>
          <p className="mt-1 text-sm text-dark/70 leading-relaxed">
            Takhle by stránka vypadala na webu. Není veřejná, nejde na ni dojít
            z menu ani ji nenajdete přes Google — otevře ji jen ten, kdo má kód.
            Až medailonky odklepnete, zámek sundáme a stránku pustíme ven.
          </p>
        </div>

        {/* ── medailonky ── */}
        {PRUVODKYNE.map((p, poradi) => (
          <section key={p.id}>
            <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-dark/5">
              <div
                className={`grid ${
                  poradi % 2 === 1
                    ? "md:grid-cols-[1fr_minmax(0,340px)]"
                    : "md:grid-cols-[minmax(0,340px)_1fr]"
                }`}
              >
                {/* fotky — bez popisků, čísla jen kvůli výběru v návrhu */}
                <div
                  className={`grid grid-cols-2 md:grid-cols-1 gap-px bg-dark/5 ${
                    poradi % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  {p.fotky.map((f, i) => (
                    <div key={f.src} className="relative">
                      <Image
                        src={f.src}
                        alt={`${p.jmeno} — ${f.popis}`}
                        width={680}
                        height={850}
                        loading="eager"
                        style={f.pozice ? { objectPosition: f.pozice } : undefined}
                        className="h-full w-full object-cover object-top aspect-[4/5]"
                      />
                      {p.fotky.length > 1 && (
                        <span className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-dark/60 text-xs font-bold text-white backdrop-blur-sm">
                          {i + 1}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* text */}
                <div
                  className={`p-7 sm:p-9 ${poradi % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                    {p.role}
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-dark">
                    {p.jmeno}
                  </h2>
                  <p className="mt-1 text-sm text-dark/50">{p.podtitul}</p>
                  <div className="mt-5 h-px w-12 bg-orange/70" />

                  <div className="mt-5 space-y-4">
                    {p.odstavce.map((o, i) => (
                      <p
                        key={i}
                        className={`leading-[1.75] ${
                          i === 0
                            ? "text-[17px] text-dark/90"
                            : "text-dark/70"
                        }`}
                      >
                        {o}
                      </p>
                    ))}
                  </div>

                  {/* dvě fotky z klubíku — atmosféra, ne portrét */}
                  <div
                    className="mt-6 grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${p.zeZivota.length}, minmax(0,1fr))`,
                    }}
                  >
                    {p.zeZivota.map((f) => (
                      <Image
                        key={f.src}
                        src={f.src}
                        alt={f.popis}
                        width={600}
                        height={400}
                        loading="eager"
                        className="h-24 w-full rounded-xl object-cover sm:h-36"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* ── otázka a odklepnutí — jen v návrhu, na veřejný web nepůjde ── */}
            {p.otazka && (
              <p className="mt-4 rounded-2xl bg-beige-dark/50 px-5 py-4 text-sm text-dark/75 leading-relaxed">
                <strong>Poznámka pro vás:</strong> {p.otazka}
              </p>
            )}
            <MedailonekSouhlas id={p.id} jmeno={p.jmeno} kod={MEDAILONEK_KOD} />
          </section>
        ))}
      </div>
    </main>
  );
}
