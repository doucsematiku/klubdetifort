import type { Metadata } from "next";
import Link from "next/link";

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
    <section id={`kapitola-${num}`} className="scroll-mt-24">
      <h2 className="text-xl font-bold text-dark mb-3">
        {num}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
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
    <tr className="border-t border-dark/10 align-top">
      <td className="py-3 pr-4 font-semibold text-dark">{what}</td>
      <td className="py-3 pr-4">{why}</td>
      <td className="py-3 pr-4">{basis}</td>
      <td className="py-3">{how}</td>
    </tr>
  );
}

export default function GDPRPage() {
  return (
    <main className="min-h-screen bg-beige">
      {/* Header */}
      <div className="bg-dark text-white py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 text-sm"
          >
            ← Zpět na hlavní stránku
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold">
            Zásady zpracování osobních údajů
          </h1>
          <p className="mt-3 text-white/80">
            Vzdělávací klub Farma Fořt, web klubdetifort.cz a aplikace klubu
          </p>
          <p className="mt-1 text-white/50 text-sm">
            Účinné od 1. srpna 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-12">
          <p className="text-dark/80 leading-relaxed">
            Tyto zásady popisují, jaké údaje o vás a o vašich dětech
            zpracováváme, proč to děláme, komu se údaje dostanou do ruky, jak
            dlouho je držíme a co s tím můžete udělat. Týkají se zájemců
            o klub, rodičů a dětí docházejících do klubu i návštěvníků webu.
          </p>
        </div>

        <div className="space-y-10 text-dark/80">
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
                className="text-orange hover:underline"
              >
                reditel@doucse.cz
              </a>
              , tel.{" "}
              <a href="tel:+420775917363" className="text-orange hover:underline">
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
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Zájemci o klub</strong> — kdo nám napsal přes formulář
                na webu, přihlásil se na prohlídku farmy nebo prázdninový
                program
              </li>
              <li>
                <strong>Rodiče a zákonní zástupci</strong> dětí docházejících do
                klubu
              </li>
              <li>
                <strong>Děti</strong> docházející do klubu
              </li>
              <li>
                <strong>Oprávněné osoby</strong> uvedené rodiči v evidenčním
                listu (kdo smí dítě vyzvednout)
              </li>
              <li>
                <strong>Průvodkyně a spolupracovníci</strong> klubu
              </li>
            </ul>
          </Section>

          <Section num={3} title="Jaké údaje, k čemu a jak dlouho">
            <div className="overflow-x-auto -mx-6 sm:mx-0 px-6 sm:px-0">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-dark">
                    <th className="pb-2 pr-4 font-bold">Údaje</th>
                    <th className="pb-2 pr-4 font-bold">Účel</th>
                    <th className="pb-2 pr-4 font-bold">Právní základ</th>
                    <th className="pb-2 font-bold">Doba uložení</th>
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
              <strong>chráněné samostatným heslem</strong> a zobrazí se pouze
              rodičům daného dítěte, průvodkyním a provozovateli. Kuchyně vidí
              pouze počty porcí a nutná dietní omezení — bez jmen dětí. Souhlas
              se zpracováním zdravotních údajů můžete kdykoli odvolat; pak ale
              nemůžeme zajistit péči, která na těchto údajích stojí.
            </p>
          </Section>

          <Section num={5} title="Fotografie dětí">
            <p>
              Fotíme a natáčíme zásadně tak, aby děti{" "}
              <strong>nebyly identifikovatelné</strong> — záběry zezadu,
              z odstupu, detaily práce a tvoření. Takové záběry používáme
              k prezentaci klubu na webu, na sociálních sítích a v propagačních
              materiálech na základě oprávněného zájmu.
            </p>
            <p>
              Fotografii, na které je dítě poznat (zejména je-li vidět obličej),
              zveřejníme <strong>pouze se souhlasem rodiče ke konkrétní
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
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>pracovníci klubu</strong> v rozsahu, který potřebují ke
                své práci (průvodkyně, vedení klubu; kuchyně jen počty porcí
                a dietní omezení)
              </li>
              <li>
                <strong>dodavatelé technického zázemí</strong> — provoz webu
                a aplikace, databáze a úložiště, odesílání e-mailů, zálohování
              </li>
              <li>
                <strong>fakturace a účetnictví</strong> — fakturační systém
                a účetní spolku
              </li>
              <li>
                <strong>orgány veřejné moci</strong>, ukládá-li nám to zákon,
                a osoby nutné k ochraně našich práv (právní zástupce,
                pojišťovna, soud)
              </li>
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
              Nahrané dokumenty (podepsaná smlouva, souhlas) kontroluje
              automatický nástroj — ověřuje, zda jde o správný dokument, zda je
              čitelný a zda je podepsaný. Jde o pomůcku, nikoli o rozhodnutí:{" "}
              <strong>o přijetí dokumentu vždy rozhoduje člověk</strong>. Žádné
              rozhodování s právními účinky neděláme automatizovaně a neprovádíme
              profilování.
            </p>
          </Section>

          <Section num={8} title="Jak údaje chráníme">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                přístup do aplikace jen na jméno a heslo, role s minimem
                oprávnění (rodič vidí jen své děti, kuchyně jen počty porcí)
              </li>
              <li>
                nahrané dokumenty v neveřejném úložišti, zdravotní údaje navíc
                za heslem
              </li>
              <li>šifrovaný přenos (HTTPS) a šifrované úložiště</li>
              <li>
                záznam o každé změně v aplikaci (kdo, kdy, co) a denní zálohy
              </li>
              <li>
                přístup ke schránkám a účtům jen pro osoby, které ho pro svou
                práci potřebují
              </li>
            </ul>
          </Section>

          <Section num={9} title="Vaše práva">
            <p>Ve vztahu ke svým údajům (a k údajům svého dítěte) máte právo:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>vědět, jaké údaje o vás zpracováváme, a získat jejich kopii</li>
              <li>nechat opravit nepřesné údaje</li>
              <li>
                nechat údaje vymazat, pominul-li důvod pro jejich zpracování
              </li>
              <li>omezit zpracování nebo proti němu vznést námitku</li>
              <li>na přenositelnost údajů zpracovávaných automatizovaně</li>
              <li>
                kdykoli odvolat udělený souhlas (odvolání nemá vliv na
                zpracování do té doby)
              </li>
              <li>
                podat stížnost u{" "}
                <a
                  href="https://www.uoou.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  Úřadu pro ochranu osobních údajů
                </a>
              </li>
            </ul>
            <p>
              Napište nám na{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-orange hover:underline"
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
              Nad rámec toho bychom rádi měřili návštěvnost webu a účinnost naší
              reklamy (Google Analytics, Google Ads, Meta). Tohle měření
              spustíme <strong>až poté, co k němu dáte souhlas</strong> v liště,
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
                className="text-orange hover:underline"
              >
                stránkách Google
              </a>{" "}
              a{" "}
              <a
                href="https://www.facebook.com/privacy/policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange hover:underline"
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

        <div className="mt-12 pt-8 border-t border-dark/10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
          >
            ← Zpět na hlavní stránku
          </Link>
        </div>
      </div>
    </main>
  );
}
