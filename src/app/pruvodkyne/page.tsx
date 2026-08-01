import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PRUVODKYNE } from "@/lib/medailonky";

export const metadata: Metadata = {
  title: "Kdo bude s dětmi | Klub Fořt",
  description:
    "Průvodkyně Klubíku Fořt — kdo je s dětmi celý rok a s čím do klubíku přichází.",
  alternates: { canonical: "https://klubdetifort.cz/pruvodkyne" },
};

export default function PruvodkynePage() {
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
        {/* ── medailonky ── */}
        {PRUVODKYNE.map((p, poradi) => (
          <section key={p.id}>
            <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-dark/5">
              <div
                className={`grid ${
                  poradi % 2 === 1
                    ? "md:grid-cols-[1fr_minmax(0,250px)]"
                    : "md:grid-cols-[minmax(0,250px)_1fr]"
                }`}
              >
                {/* portréty — menší, ať nejsou vidět vady z mobilních fotek */}
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
          </section>
        ))}

        <section className="rounded-2xl bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-dark">
            Chcete se přijít podívat?
          </h2>
          <p className="mt-2 text-brown leading-relaxed">
            Nejlepší je potkat se osobně — prohlídky farmy domlouváme
            individuálně a klidně přijďte i s dětmi.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/prohlidky"
              className="inline-block rounded-full bg-orange hover:bg-orange-hover px-6 py-3 font-bold text-dark transition-colors"
            >
              Domluvit prohlídku
            </Link>
            <Link
              href="/galerie"
              className="inline-block rounded-full border border-dark/15 px-6 py-3 font-semibold text-dark hover:border-dark/40 transition-colors"
            >
              Fotky z akcí
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
