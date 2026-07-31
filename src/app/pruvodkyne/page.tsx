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
  TYDEN,
} from "@/lib/medailonky";

export const metadata: Metadata = {
  title: "Kdo bude s dětmi | Klub Fořt",
  description:
    "Průvodkyně Klubíku Fořt a rozvrh týdne — kdo je s dětmi v pondělí, úterý a ve středu.",
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
        {/* ── návrh, ne hotová stránka ── */}
        <div className="rounded-2xl border-2 border-orange bg-orange/10 p-5">
          <p className="font-bold text-dark">Návrh — zatím to nikdo jiný nevidí</p>
          <p className="mt-1 text-dark/75 leading-relaxed text-sm">
            Takhle by stránka vypadala na webu. Není veřejná, nejde na ni dojít
            z menu ani ji nenajdete přes Google — otevře ji jen ten, kdo má kód.
            Až medailonky odklepnete, zámek sundáme a stránku pustíme ven.
          </p>
        </div>

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

          <div className="mt-6 space-y-10">
            {PRUVODKYNE.map((p) => (
              <article key={p.id} className="bg-white rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex gap-3 sm:flex-col shrink-0">
                    {p.fotky.map((f) => (
                      <figure key={f.src} className="w-32 sm:w-44">
                        <Image
                          src={f.src}
                          alt={`${p.jmeno} — ${f.popis}`}
                          width={352}
                          height={440}
                          className="rounded-xl object-cover w-full h-40 sm:h-52"
                        />
                        <figcaption className="mt-1 text-xs text-dark/45">
                          {f.popis}
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-dark text-xl">{p.jmeno}</h3>
                    <p className="text-sm text-orange font-semibold">{p.role}</p>
                    <p className="mt-1 text-sm text-dark/60">
                      S dětmi bývá {p.kdy}.
                    </p>
                    <div className="mt-4 space-y-3">
                      {p.odstavce.map((o, i) => (
                        <p key={i} className="text-dark/80 leading-relaxed">
                          {o}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                {p.otazka && (
                  <p className="mt-6 rounded-xl bg-beige-dark/40 px-4 py-3 text-sm text-dark/75 leading-relaxed">
                    <strong>Poznámka pro vás:</strong> {p.otazka}
                  </p>
                )}

                <MedailonekSouhlas
                  id={p.id}
                  jmeno={p.jmeno}
                  kod={MEDAILONEK_KOD}
                />
              </article>
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
