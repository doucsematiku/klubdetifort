import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DoorOpen, Heart, Leaf, Quote, Sprout } from "lucide-react";
import { PRUVODKYNE } from "@/lib/medailonky";
import Hory from "@/components/design/Hory";
import StickyCta from "@/components/design/StickyCta";
import PruvodkyneFotky from "@/components/PruvodkyneFotky";
import Maskot from "@/components/maskot/Maskot";

export const metadata: Metadata = {
  title: "Kdo bude s dětmi | Klub Fořt",
  description:
    "Průvodkyně Klubíku Fořt — kdo je s dětmi celý rok a s čím do klubíku přichází.",
  alternates: { canonical: "https://klubdetifort.cz/pruvodkyne" },
};

/** Natočení polaroidů pod textem — střídá se, ať řada působí ručně. */
const NATOCENI = ["-rotate-[2.5deg]", "rotate-[2deg]", "-rotate-[1deg]", "rotate-[2.5deg]"];

export default function PruvodkynePage() {
  return (
    <main className="min-h-screen bg-beige">
      {/* ── úvodní pás ── */}
      <header className="relative overflow-hidden bg-forest-deep text-white">
        <div aria-hidden="true" className="dot-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl"
        />
        <Leaf
          aria-hidden="true"
          className="sway pointer-events-none absolute -right-4 bottom-16 h-28 w-28 text-moss/15 sm:right-10 sm:h-40 sm:w-40"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-12 sm:pb-28">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 hover:bg-white/20 transition min-h-11 mb-10 sm:mb-14"
          >
            ← Zpět na hlavní stránku
          </Link>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="hero-in eyebrow text-orange">Klubík Fořt</p>
              <h1 className="hero-in [animation-delay:120ms] mt-4 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl font-extrabold">
                Kdo bude <span className="text-orange squiggle">s dětmi</span>
              </h1>
            </div>

            {/* tváře průvodkyň — jen dekorace, texty jsou níž */}
            <div
              aria-hidden="true"
              className="hero-in [animation-delay:260ms] flex items-center"
            >
              {PRUVODKYNE.map((p, i) => (
                <span
                  key={p.id}
                  className={`relative block h-16 w-16 overflow-hidden rounded-full ring-4 ring-forest-deep shadow-lift sm:h-20 sm:w-20 lg:h-24 lg:w-24 ${
                    i > 0 ? "-ml-4" : ""
                  } ${i % 2 ? "rotate-[4deg]" : "-rotate-[4deg]"}`}
                >
                  <Image
                    src={p.fotky[0].src}
                    alt=""
                    fill
                    sizes="96px"
                    loading="eager"
                    style={p.fotky[0].pozice ? { objectPosition: p.fotky[0].pozice } : undefined}
                    className="object-cover object-top"
                  />
                </span>
              ))}
              <span className="-ml-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange text-dark ring-4 ring-forest-deep shadow-glow sm:h-20 sm:w-20 lg:h-24 lg:w-24">
                <Heart className="h-6 w-6 sm:h-7 sm:w-7" fill="currentColor" />
              </span>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0">
          <Hory className="text-beige" />
        </div>
      </header>

      <div className="grain">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pt-10 sm:pb-24 space-y-12 sm:space-y-20">
          {/* ── medailonky ── */}
          {PRUVODKYNE.map((p, poradi) => {
            const lichy = poradi % 2 === 1;
            const [krestni, ...prijmeni] = p.jmeno.split(" ");
            return (
              <section key={p.id} className="reveal">
                <article className="group card overflow-clip rounded-[2rem] shadow-lift">
                  <div
                    className={`grid ${
                      lichy
                        ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]"
                        : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                    }`}
                  >
                    {/* portréty — kompozice podle počtu fotek */}
                    <div
                      className={`relative isolate px-5 pt-8 pb-4 sm:px-10 sm:pt-12 lg:p-10 xl:p-12 ${
                        lichy ? "bg-sun lg:order-2" : "bg-forest-pale"
                      }`}
                    >
                      <div
                        aria-hidden="true"
                        className="dot-grid-dark absolute inset-0 -z-10 opacity-70"
                      />
                      <div className="lg:sticky lg:top-10">
                        <PruvodkyneFotky
                          jmeno={p.jmeno}
                          fotky={p.fotky}
                          ton={lichy ? "sun" : "forest"}
                        />
                      </div>
                    </div>

                    {/* text */}
                    <div
                      className={`relative px-6 pt-8 pb-8 sm:px-10 sm:pt-10 sm:pb-12 lg:px-14 lg:py-14 ${
                        lichy ? "lg:order-1" : ""
                      }`}
                    >
                      <p className="eyebrow text-forest">{p.role}</p>
                      <h2 className="mt-3 text-[2.5rem] leading-[1] sm:text-5xl lg:text-[3.5rem] font-extrabold text-dark">
                        {krestni}{" "}
                        <span className="text-forest">{prijmeni.join(" ")}</span>
                      </h2>
                      <p className="mt-5 inline-flex items-start gap-2 rounded-2xl bg-forest-pale px-4 py-2 text-sm font-semibold leading-snug text-forest">
                        <Sprout aria-hidden="true" className="mt-px h-4 w-4 flex-shrink-0" />
                        {p.podtitul}
                      </p>

                      <div className="mt-8 space-y-5">
                        {p.odstavce.map((o, i) => {
                          const posledni = i === p.odstavce.length - 1;
                          if (i === 0) {
                            return (
                              <div key={i} className="relative">
                                <Quote
                                  aria-hidden="true"
                                  className="mb-3 h-9 w-9 text-orange"
                                  fill="currentColor"
                                />
                                <p className="text-[1.15rem] sm:text-[1.3rem] leading-[1.6] font-medium text-dark">
                                  {o}
                                </p>
                              </div>
                            );
                          }
                          // krátká závěrečná věta = podpis rukou
                          if (posledni && o.length < 90) {
                            return (
                              <p
                                key={i}
                                className="pt-2 font-hand text-[1.9rem] sm:text-[2.2rem] leading-[1.1] text-forest -rotate-1 origin-left"
                              >
                                {o}
                              </p>
                            );
                          }
                          return (
                            <p
                              key={i}
                              className="text-[1.0625rem] leading-[1.8] text-brown"
                            >
                              {o}
                            </p>
                          );
                        })}
                      </div>

                      {/* fotky z klubíku — polaroidy */}
                      <div
                        className="mt-10 grid gap-3 sm:gap-5"
                        style={{
                          gridTemplateColumns: `repeat(${p.zeZivota.length}, minmax(0,1fr))`,
                        }}
                      >
                        {p.zeZivota.map((f, i) => (
                          <div
                            key={f.src}
                            className={`polaroid p-1.5 pb-5 sm:p-2 sm:pb-8 transition duration-500 hover:rotate-0 hover:-translate-y-1 ${
                              NATOCENI[i % NATOCENI.length]
                            }`}
                          >
                            <div className="group/foto relative aspect-[4/5] overflow-hidden rounded-[0.35rem]">
                              <Image
                                src={f.src}
                                alt={f.popis}
                                fill
                                sizes="(min-width: 1024px) 14rem, 30vw"
                                loading="eager"
                                className="object-cover transition duration-700 group-hover/foto:scale-105"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </section>
            );
          })}

          <section
            id="prijdte-se-podivat"
            className="reveal relative isolate overflow-hidden rounded-[2rem] bg-forest text-white p-7 sm:p-12 lg:p-14 shadow-lift"
          >
            <div aria-hidden="true" className="dot-grid absolute inset-0 -z-10" />
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-20 -z-10 h-72 w-72 rounded-full bg-orange/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-10 -z-10 h-64 w-64 rounded-full bg-moss/30 blur-3xl"
            />
            <Leaf
              aria-hidden="true"
              className="sway pointer-events-none absolute -bottom-6 right-4 -z-10 h-36 w-36 text-white/[0.07] sm:right-12 sm:h-48 sm:w-48"
            />
            <div className="grid gap-7 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-10">
              <span
                aria-hidden="true"
                className="icon-bubble h-14 w-14 rounded-2xl bg-white/10 text-orange ring-1 ring-white/15 sway"
              >
                <DoorOpen className="h-7 w-7" />
              </span>
              <div>
                <h2 className="text-[2rem] leading-[1.08] sm:text-4xl lg:text-[2.75rem] font-extrabold">
                  Chcete se přijít podívat?
                </h2>
                <p className="mt-3 max-w-2xl text-white/80 leading-relaxed sm:text-lg">
                  Nejlepší je potkat se osobně — prohlídky farmy domlouváme
                  individuálně a klidně přijďte i s dětmi.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/prohlidky"
                  className="btn btn-sun btn-shine text-base sm:text-lg whitespace-nowrap"
                >
                  Domluvit prohlídku
                </Link>
                <Link href="/galerie" className="btn btn-glass whitespace-nowrap">
                  Fotky z akcí
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* hřeben na konci stránky — jen dekorace */}
      <div aria-hidden="true">
        <Hory className="text-forest-deep" />
        <div className="dot-grid h-10 bg-forest-deep sm:h-14" />
      </div>

      <StickyCta
        akce={[{ label: "Domluvit prohlídku", href: "/prohlidky", hlavni: true }]}
        schovatU={["prijdte-se-podivat"]}
      />
      {/* Fořťáček — maskot v pravém dolním rohu */}
      <Maskot />
    </main>
  );
}
