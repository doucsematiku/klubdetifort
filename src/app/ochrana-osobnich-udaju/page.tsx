import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Check, ShieldCheck } from "lucide-react";
import Hory from "@/components/design/Hory";

export const metadata: Metadata = {
  title: "Zásady zpracování osobních údajů | Klub Fořt",
  description:
    "Jak Vzdělávací centrum Doučse z.s. zpracovává osobní údaje zájemců, rodičů a dětí ve Vzdělávacím klubu Farma Fořt a v aplikaci klubu.",
};

/** Kapitola zásad. */
function Section({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={`kapitola-${num}`} className="scroll-mt-24 border-t border-dark/10 pt-10 first:border-t-0 first:pt-0">
      <h2 className="mb-4 flex items-start gap-3.5 text-[1.45rem] leading-[1.15] sm:text-[1.75rem] font-extrabold text-dark">
        <span className="mt-0.5 flex h-9 min-w-9 flex-shrink-0 items-center justify-center rounded-xl bg-forest px-1.5 font-display text-base font-extrabold leading-none text-white sm:mt-0 sm:h-10 sm:min-w-10">
          {num}.
        </span>{" "}
        <span className="pt-0.5 sm:pt-0">{title}</span>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Odrážka seznamu — fajfka v kolečku místo tečky. */
function Bod({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-[0.3rem] flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-forest-pale text-forest"
      >
        <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
      </span>
      <span>{children}</span>
    </li>
  );
}

/** Řádek tabulky „co – proč – jak dlouho“. */
function Row({
  what,
  why,
  basis,
  how,
}: {
  what: string;
  why: string;
  basis: string;
  how: string;
}) {
  return (
    <tr className="border-t border-dark/5 align-top even:bg-cream/70">
      <td className="py-3.5 pl-5 pr-4 font-semibold text-dark">{what}</td>
      <td className="py-3.5 pr-4">{why}</td>
      <td className="py-3.5 pr-4">{basis}</td>
      <td className="py-3.5 pr-5 font-medium text-forest">{how}</td>
    </tr>
  );
}

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* ============ ÚVODNÍ PÁS ============ */}
      <div className="relative overflow-hidden bg-forest-deep text-white">
        <div aria-hidden="true" className="dot-grid absolute inset-0" />
        <div aria-hidden="true" className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-orange/25 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-10 -left-16 h-56 w-56 rounded-full bg-moss/25 blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20 sm:pt-12 sm:pb-28">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/10 backdrop-blur hover:bg-white/20 transition"
          >
            ← Zpět na hlavní stránku
          </Link>
          <span aria-hidden="true" className="hero-in icon-bubble mt-10 flex bg-white/10 text-orange ring-1 ring-white/15 sm:mt-12">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="hero-in [animation-delay:120ms] mt-5 text-[2.5rem] leading-[1.05] sm:text-6xl font-extrabold">
            Zásady zpracování osobních údajů
          </h1>
          <p className="hero-in [animation-delay:240ms] mt-5 text-lg text-white/75 leading-relaxed">
            Vzdělávací klub Farma Fořt, web klubdetifort.cz a aplikace klubu
          </p>
          <p className="hero-in [animation-delay:320ms] mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white/85 ring-1 ring-white/15">
            <CalendarDays className="h-4 w-4 text-orange" aria-hidden="true" />
            Účinné od 1. srpna 2026
          </p>
        </div>
        <div className="absolute inset-x-0 -bottom-px">
          <Hory className="text-cream" />
        </div>
      </div>

      {/* ============ OBSAH ============ */}
      <div className="relative grain">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-24">
          <div className="card flex flex-col gap-4 p-6 ring-1 ring-dark/5 sm:flex-row sm:items-start sm:gap-5 sm:p-8 mb-14">
            <span aria-hidden="true" className="icon-bubble bg-forest-pale text-forest">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-dark/85 leading-relaxed sm:text-lg">
              Tyto zásady popisují, jaké údaje o vás a o vašich dětech
              zpracováváme, proč to děláme, komu se údaje dostanou do ruky, jak
              dlouho je držíme a co s tím můžete udělat. Týkají se zájemců
              o klub, rodičů a dětí docházejících do klubu i návštěvníků webu.
            </p>
          </div>

          <div className="space-y-10 text-[1.0625rem] leading-relaxed text-brown [&_strong]:font-bold [&_strong]:text-dark">
            <Section num={1} title="Kdo údaje zpracovává">
              <p>
                Správcem osobních údajů je{" "}
                <strong>Vzdělávací centrum Doučse, z.s.</strong>, IČO 222 01 581,
                se sídlem Korunní 2569/108, Vinohrady, 101 00 Praha 10, zapsaný ve
                spolkovém rejstříku vedeném Městským soudem v Praze, sp. zn.
                L 79729 (dále jen „správce“ nebo „klub“).
              </p>
              <p>
                Kontakt ve věcech ochrany osobních údajů:{" "}
                <a
                  href="mailto:reditel@doucse.cz"
                  className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
                >
                  reditel@doucse.cz
                </a>
                , tel.{" "}
                <a href="tel:+420775917363" className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light">
                  775 917 363
                </a>
                , adresa provozovny: Fořt 29, 543 44 Černý Důl.
              </p>
              <p>
                Nejmenovali jsme pověřence pro ochranu osobních údajů — nemáme
                k tomu zákonnou povinnost. Vaše dotazy vyřizuje přímo statutární
                zástupce spolku.
              </p>
            </Section>

            <Section num={2} title="Koho se zpracování týká">
              <ul className="space-y-2.5">
                <Bod>
                  <strong>Zájemci o klub</strong> — kdo nám napsal přes formulář
                  na webu, přihlásil se na prohlídku farmy nebo prázdninový
                  program
                </Bod>
                <Bod>
                  <strong>Rodiče a zákonní zástupci</strong> dětí docházejících do
                  klubu
                </Bod>
                <Bod>
                  <strong>Děti</strong> docházející do klubu
                </Bod>
                <Bod>
                  <strong>Oprávněné osoby</strong> uvedené rodiči v evidenčním
                  listu (kdo smí dítě vyzvednout)
                </Bod>
                <Bod>
                  <strong>Průvodkyně a spolupracovníci</strong> klubu
                </Bod>
              </ul>
            </Section>

            <Section num={3} title="Jaké údaje, k čemu a jak dlouho">
              <div className="card overflow-hidden ring-1 ring-dark/5 -mx-1 sm:mx-0">
                <div className="overflow-x-auto overscroll-x-contain">
                  <table className="w-full text-sm leading-relaxed min-w-[640px]">
                    <thead>
                      <tr className="bg-forest-pale text-left font-display text-forest">
                        <th className="py-3.5 pl-5 pr-4 font-bold">Údaje</th>
                        <th className="py-3.5 pr-4 font-bold">Účel</th>
                        <th className="py-3.5 pr-4 font-bold">Právní základ</th>
                        <th className="py-3.5 pr-5 font-bold">Doba uložení</th>
                      </tr>
                    </thead>
                    <tbody>
                      <Row
                        what="Jméno, e-mail, telefon zájemce, informace o dítěti z formuláře"
                        why="Odpověď na dotaz, domluva prohlídky, evidence zájmu"
                        basis="Oprávněný zájem, resp. opatření před uzavřením smlouvy [čl. 6/1/b a f]"
                        how="3 roky od posledního kontaktu"
                      />
                      <Row
                        what="Identifikační a kontaktní údaje rodičů a dítěte, kmenová škola, údaje ze smlouvy a evidenčního listu"
                        why="Uzavření a plnění smlouvy o docházce, evidence docházky"
                        basis="Plnění smlouvy [čl. 6/1/b]"
                        how="Po dobu docházky a 3 roky po skončení smlouvy (promlčecí lhůta)"
                      />
                      <Row
                        what="Oprávněné osoby (jméno, vztah k dítěti, telefon)"
                        why="Bezpečné předávání dítěte"
                        basis="Plnění smlouvy a oprávněný zájem na bezpečí dítěte [čl. 6/1/b a f]"
                        how="Po dobu docházky, poté 1 rok"
                      />
                      <Row
                        what="Zdravotní údaje dítěte — alergie, diety, chronická onemocnění, léky, psychická omezení"
                        why="Bezpečná péče o dítě, strava, první pomoc"
                        basis="Výslovný souhlas rodičů [čl. 9/2/a]; v ohrožení života životně důležitý zájem [čl. 9/2/c]"
                        how="Po dobu docházky, výmaz do 1 roku po jejím skončení"
                      />
                      <Row
                        what="Docházka, odhlášky, objednané obědy, čas vyzvednutí, vzkazy v aplikaci"
                        why="Provoz klubu, objednávky stravy, komunikace"
                        basis="Plnění smlouvy [čl. 6/1/b]"
                        how="3 roky"
                      />
                      <Row
                        what="Fakturační údaje, faktury, platby, kredit"
                        why="Vyúčtování služeb, účetnictví a daně"
                        basis="Plnění smlouvy a právní povinnost [čl. 6/1/b a c]"
                        how="10 let (účetní a daňové předpisy)"
                      />
                      <Row
                        what="Nahrané podepsané dokumenty (smlouva, souhlasy)"
                        why="Doklad o uzavření smlouvy a udělených souhlasech"
                        basis="Plnění smlouvy, oprávněný zájem na doložení [čl. 6/1/b a f]"
                        how="Po dobu docházky a 3 roky poté"
                      />
                      <Row
                        what="Záznamy o úrazech a mimořádných událostech"
                        why="Ochrana zdraví dětí, doložení postupu, pojistné události"
                        basis="Oprávněný zájem a právní povinnost [čl. 6/1/f a c]"
                        how="10 let od události"
                      />
                      <Row
                        what="Fotografie a videozáznamy z činnosti klubu"
                        why="Dokumentace a prezentace klubu"
                        basis="Neidentifikující záběry: oprávněný zájem [čl. 6/1/f]. Záběry, kde je dítě poznat: souhlas rodiče ke konkrétní fotografii [čl. 6/1/a]"
                        how="Do odvolání souhlasu, nejdéle 5 let od pořízení"
                      />
                      <Row
                        what="Přihlašovací údaje a provozní záznamy v aplikaci (log akcí)"
                        why="Bezpečnost aplikace, dohledání změn"
                        basis="Oprávněný zájem [čl. 6/1/f]"
                        how="3 roky"
                      />
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-dark/60">
                Odkazy v hranatých závorkách míří na články nařízení (EU) 2016/679
                (GDPR).
              </p>
            </Section>

            <Section num={4} title="Zdravotní údaje dítěte">
              <p>
                Zdravotní údaje patří do zvláštní kategorie osobních údajů
                a nakládáme s nimi zvlášť opatrně. Zpracováváme jen to, co nám
                sami uvedete v evidenčním listu, a jen v rozsahu nutném pro
                bezpečnou péči o dítě.
              </p>
              <p>
                V aplikaci jsou tyto údaje{" "}
                <strong className="bg-[linear-gradient(transparent_58%,#FFE19A_58%)] [box-decoration-break:clone]">chráněné samostatným heslem</strong> a zobrazí se pouze
                rodičům daného dítěte, průvodkyním a provozovateli. Kuchyně vidí
                pouze počty porcí a nutná dietní omezení — bez jmen dětí. Souhlas
                se zpracováním zdravotních údajů můžete kdykoli odvolat; pak ale
                nemůžeme zajistit péči, která na těchto údajích stojí.
              </p>
            </Section>

            <Section num={5} title="Fotografie dětí">
              <p>
                Fotíme a natáčíme zásadně tak, aby děti{" "}
                <strong className="bg-[linear-gradient(transparent_58%,#FFE19A_58%)] [box-decoration-break:clone]">nebyly identifikovatelné</strong> — záběry zezadu,
                z odstupu, detaily práce a tvoření. Takové záběry používáme
                k prezentaci klubu na webu, na sociálních sítích a v propagačních
                materiálech na základě oprávněného zájmu.
              </p>
              <p>
                Fotografii, na které je dítě poznat (zejména je-li vidět obličej),
                zveřejníme <strong className="bg-[linear-gradient(transparent_58%,#FFE19A_58%)] [box-decoration-break:clone]">pouze se souhlasem rodiče ke konkrétní
                fotografii</strong>. Konkrétní fotky posíláme ke schválení do
                aplikace: u každé můžete schválit, zamítnout, nebo schválit
                s podmínkou (například zakrytí obličeje). Souhlas je dobrovolný,
                není podmínkou docházky a lze jej kdykoli odvolat — fotku pak bez
                zbytečného odkladu stáhneme ze všech zdrojů, které máme pod
                kontrolou.
              </p>
            </Section>

            <Section num={6} title="Komu se údaje dostanou">
              <p>
                Osobní údaje neprodáváme a nepředáváme třetím stranám pro jejich
                marketing. K údajům se dostanou pouze:
              </p>
              <ul className="space-y-2.5">
                <Bod>
                  <strong>pracovníci klubu</strong> v rozsahu, který potřebují ke
                  své práci (průvodkyně, vedení klubu; kuchyně jen počty porcí
                  a dietní omezení)
                </Bod>
                <Bod>
                  <strong>dodavatelé technického zázemí</strong> — provoz webu
                  a aplikace, databáze a úložiště, odesílání e-mailů, zálohování
                </Bod>
                <Bod>
                  <strong>fakturace a účetnictví</strong> — fakturační systém
                  a účetní spolku
                </Bod>
                <Bod>
                  <strong>orgány veřejné moci</strong>, ukládá-li nám to zákon,
                  a osoby nutné k ochraně našich práv (právní zástupce,
                  pojišťovna, soud)
                </Bod>
              </ul>
              <p>
                Všichni dodavatelé jsou vázáni smlouvou o zpracování osobních
                údajů podle GDPR a zpracovávají údaje jen podle našich pokynů.
                Údaje ukládáme v Evropské unii; pokud by některý dodavatel
                zpracovával data mimo EU, děje se tak na základě standardních
                smluvních doložek schválených Evropskou komisí. Konkrétní seznam
                dodavatelů vám na vyžádání rádi sdělíme.
              </p>
            </Section>

            <Section num={7} title="Automatizované zpracování">
              <p>
                Nahrané dokumenty (podepsaná smlouva, souhlas) projdou při
                nahrání automatickou předkontrolou — ověřuje, zda jde o správný
                dokument, zda je čitelný, zda je podepsaný a zda se jeho znění
                shoduje s naší předlohou. Předkontrolu pro nás provádí nástroj
                umělé inteligence externího poskytovatele (OpenAI) v roli
                zpracovatele: dokument použije jen k této kontrole a nepoužívá
                ho k učení svých modelů.
              </p>
              <p>
                Jde o pomůcku, nikoli o rozhodnutí:{" "}
                <strong className="bg-[linear-gradient(transparent_58%,#FFE19A_58%)] [box-decoration-break:clone]">o přijetí dokumentu vždy rozhoduje člověk</strong>. Žádné
                rozhodování s právními účinky neděláme automatizovaně a neprovádíme
                profilování.
              </p>
            </Section>

            <Section num={8} title="Jak údaje chráníme">
              <ul className="space-y-2.5">
                <Bod>
                  přístup do aplikace jen na jméno a heslo, role s minimem
                  oprávnění (rodič vidí jen své děti, kuchyně jen počty porcí)
                </Bod>
                <Bod>
                  nahrané dokumenty v neveřejném úložišti, zdravotní údaje navíc
                  za heslem
                </Bod>
                <Bod>šifrovaný přenos (HTTPS) a šifrované úložiště</Bod>
                <Bod>
                  záznam o každé změně v aplikaci (kdo, kdy, co) a denní zálohy
                </Bod>
                <Bod>
                  přístup ke schránkám a účtům jen pro osoby, které ho pro svou
                  práci potřebují
                </Bod>
              </ul>
            </Section>

            <Section num={9} title="Vaše práva">
              <p>Ve vztahu ke svým údajům (a k údajům svého dítěte) máte právo:</p>
              <ul className="space-y-2.5">
                <Bod>vědět, jaké údaje o vás zpracováváme, a získat jejich kopii</Bod>
                <Bod>nechat opravit nepřesné údaje</Bod>
                <Bod>
                  nechat údaje vymazat, pominul-li důvod pro jejich zpracování
                </Bod>
                <Bod>omezit zpracování nebo proti němu vznést námitku</Bod>
                <Bod>na přenositelnost údajů zpracovávaných automatizovaně</Bod>
                <Bod>
                  kdykoli odvolat udělený souhlas (odvolání nemá vliv na
                  zpracování do té doby)
                </Bod>
                <Bod>
                  podat stížnost u{" "}
                  <a
                    href="https://www.uoou.cz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
                  >
                    Úřadu pro ochranu osobních údajů
                  </a>
                </Bod>
              </ul>
              <p>
                Napište nám na{" "}
                <a
                  href="mailto:reditel@doucse.cz"
                  className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
                >
                  reditel@doucse.cz
                </a>
                . Odpovíme nejpozději do jednoho měsíce; ve složitějších případech
                vás o prodloužení včas vyrozumíme. Abychom údaje nevydali
                nesprávné osobě, můžeme si ověřit vaši totožnost.
              </p>
            </Section>

            <Section num={10} title="Cookies a analytika">
              <p>
                Web používá nezbytné technické cookies, bez kterých by nefungoval.
                Ty nastavujeme vždy — souhlas k nim zákon nevyžaduje.
              </p>
              <p>
                Nad rámec toho bychom rádi měřili návštěvnost webu — kolik lidí
                na něj přišlo a odkud (Google Analytics, Google Ads, Meta).
                Tohle měření
                spustíme <strong className="bg-[linear-gradient(transparent_58%,#FFE19A_58%)] [box-decoration-break:clone]">až poté, co k němu dáte souhlas</strong> v liště,
                která se objeví při první návštěvě. Dokud nesouhlasíte, nenačte se
                do stránky vůbec nic od Googlu ani Meta a žádné takové cookies
                nevzniknou. Web funguje úplně stejně.
              </p>
              <p>
                Souhlas můžete kdykoliv změnit nebo odvolat odkazem{" "}
                <strong>Nastavení souhlasu</strong> dole na každé stránce.
                Podrobnosti o zpracování u těchto služeb najdete na{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
                >
                  stránkách Google
                </a>{" "}
                a{" "}
                <a
                  href="https://www.facebook.com/privacy/policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-forest underline decoration-orange decoration-2 underline-offset-4 hover:text-forest-light"
                >
                  Meta
                </a>
                . Aplikace klubu žádné analytické ani reklamní cookies nepoužívá —
                jen přihlašovací.
              </p>
            </Section>

            <Section num={11} title="Změny těchto zásad">
              <p>
                Zásady můžeme aktualizovat, změní-li se způsob našeho fungování
                nebo právní úprava. Aktuální znění je vždy na této stránce
                a v aplikaci klubu; o podstatných změnách rodiče informujeme
                e-mailem.
              </p>
              <p className="text-sm text-dark/60">
                Souvisí:{" "}
                Provozním řádem klubu
                .
              </p>
            </Section>
          </div>

          <div className="mt-14 pt-8 border-t border-dark/10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="btn btn-sun"
            >
              ← Zpět na hlavní stránku
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
