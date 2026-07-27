import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Provozní řád | Klub Fořt",
  description:
    "Provozní řád Vzdělávacího klubu Farma Fořt — provozní doba, předávání dětí, stravování, zdraví, bezpečnost a pravidla soužití.",
};

/** Odstavec uvnitř kapitoly. */
function P({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`leading-relaxed${className ? ` ${className}` : ""}`}>
      {children}
    </p>
  );
}

/** Kapitola provozního řádu. */
function Chapter({
  num,
  title,
  children,
}: {
  num: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24" id={`kapitola-${num}`}>
      <h2 className="text-xl font-bold text-dark mb-3">
        {num}. {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

const CHAPTERS = [
  "Kdo jsme a co je Klubík",
  "Pro koho je klub určen a jak se do něj přihlásit",
  "Provozní doba a školní rok",
  "Rytmus dne",
  "Předávání a vyzvedávání dítěte",
  "Docházka, odhlašování a dny navíc",
  "Stravování a pitný režim",
  "Co si dítě přináší a jak má být vybavené",
  "Zdraví, nemoc a první pomoc",
  "Bezpečnost a pravidla pobytu na farmě",
  "Pravidla soužití a co děláme, když nefungují",
  "Program, výlety a odpolední kroužky",
  "Komunikace s rodiči",
  "Platby",
  "Fotografie a osobní údaje",
  "Připomínky, podněty a stížnosti",
  "Účinnost a změny",
];

export default function ProvozniRadPage() {
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
          <h1 className="text-3xl sm:text-4xl font-bold">Provozní řád</h1>
          <p className="mt-3 text-white/80">
            Vzdělávací klub Farma Fořt — školní rok 2026/2027
          </p>
          <p className="mt-1 text-white/50 text-sm">
            Účinný od 1. září 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-12">
          <p className="text-dark/80 leading-relaxed">
            Tento provozní řád popisuje, jak to u nás v klubu chodí — kdy máme
            otevřeno, jak si děti předáváme, co si dítě nosí s sebou, co dělat
            při nemoci a na čem se spolu domlouváme. Je závazný pro všechny, kdo
            se na provozu klubu podílejí, a je nedílnou součástí smlouvy
            o docházce. Psali jsme ho tak, aby se dal přečíst i v pátek večer.
          </p>
          <div className="mt-6 pt-6 border-t border-dark/10">
            <p className="text-sm font-semibold text-dark mb-2">Obsah</p>
            <ol className="text-sm text-dark/70 space-y-1 list-decimal pl-5">
              {CHAPTERS.map((c, i) => (
                <li key={c}>
                  <a
                    href={`#kapitola-${i + 1}`}
                    className="hover:text-orange transition-colors"
                  >
                    {c}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-10 text-dark/80">
          <Chapter num={1} title={CHAPTERS[0]}>
            <P>
              Klub provozuje spolek{" "}
              <strong>Vzdělávací centrum Doučse, z.s.</strong>, IČO 222 01 581,
              se sídlem Korunní 2569/108, Vinohrady, 101 00 Praha 10, zapsaný ve
              spolkovém rejstříku vedeném Městským soudem v Praze, sp. zn.
              L 79729 (dále jen „provozovatel“). Za klub jedná Ing. et Bc. Ivan
              Jadrný,{" "}
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
              .
            </P>
            <P>
              Provozním místem je <strong>BIO farma Fořt, Fořt 29, 543 44
              Černý Důl</strong> — zázemí v historické budově, park, zahrada
              a přilehlá příroda Krkonoš.
            </P>
            <P>
              Klub <strong>není školou ani školským zařízením</strong> zapsaným
              v rejstříku škol a školských zařízení, není mateřskou školou ani
              registrovanou dětskou skupinou. Neposkytuje vzdělávání podle
              školského zákona. Je komunitním vzdělávacím programem spolku,
              docházka probíhá na základě soukromoprávní smlouvy a odpovědnost
              za plnění povinné školní docházky nesou i nadále rodiče, resp.
              kmenová škola dítěte.
            </P>
            <P>
              Dospělým, kteří jsou s dětmi, říkáme <strong>průvodci</strong>
              {" "}(v ženském rodě průvodkyně). Nejsou učiteli ve smyslu
              školského zákona — provázejí děti při jejich vlastní práci a hře.
            </P>
          </Chapter>

          <Chapter num={2} title={CHAPTERS[1]}>
            <P>
              Klub je určen dětem ve věku <strong>6–12 let</strong> (odpovídá
              1.–5. ročníku), které plní povinnou školní docházku formou
              individuálního vzdělávání podle § 41 školského zákona a jsou
              zapsané na kmenové škole. Kapacita je{" "}
              <strong>nejvýše 10 dětí na den</strong>.
            </P>
            <P>
              Přihlášení proběhne takto: domluvíme si osobní setkání a prohlídku
              farmy, vyplníte přihlášku a evidenční list dítěte, podepíšeme
              smlouvu o docházce a souhlas se zpracováním osobních údajů. Od nás
              pak dostanete přístup do aplikace klubu na adrese{" "}
              <a
                href="https://app.klubdetifort.cz"
                className="text-orange hover:underline"
              >
                app.klubdetifort.cz
              </a>
              , kde si zafixujete dny docházky.
            </P>
            <P>
              Podmínkou zahájení docházky je odevzdaný evidenční list a nahrané
              podepsané dokumenty v aplikaci. Bez schválené smlouvy dítě do
              klubu nastoupit nemůže.
            </P>
            <P>
              Nemáte-li ještě schválené individuální vzdělávání, pomůžeme vám
              s přihláškou i s hledáním vstřícné kmenové školy — ozvěte se nám
              včas, proces na škole nějakou dobu trvá.
            </P>
          </Chapter>

          <Chapter num={3} title={CHAPTERS[2]}>
            <P>
              Ve školním roce 2026/2027 je klub v provozu{" "}
              <strong>od 1. září 2026 do 30. června 2027</strong>, a to{" "}
              <strong>v pondělí, úterý a ve středu od 8:00 do 16:00</strong>.
            </P>
            <P>
              Zavřeno máme ve dnech <strong>státních svátků</strong> a{" "}
              <strong>o vánočních prázdninách od 23. prosince 2026 do
              2. ledna 2027</strong>. V průběhu roku můžeme vyhlásit nejvýše{" "}
              <strong>čtyři dny volna</strong> (typicky pracovní den přiléhající
              ke svátku nebo víkendu) — oznámíme je v aplikaci s předstihem. Za
              tyto dny se nic nevrací a nepočítají se do odhlášených dnů pro
              výpočet kreditu.
            </P>
            <P>
              V červenci a srpnu běžná docházka neprobíhá. Prázdninové akce
              a příměstské programy vypisujeme samostatně — najdete je
              v kalendáři aplikace i na webu.
            </P>
            <P>
              Ostatní prázdniny (podzimní, pololetní, jarní, velikonoční)
              běžnou docházku nepřerušují — klub je otevřený, pokud
              v kalendáři neuvidíte jinak.
            </P>
          </Chapter>

          <Chapter num={4} title={CHAPTERS[3]}>
            <P>
              Rytmus dne je orientační. Držíme ho proto, aby se v něm děti
              vyznaly, ale konkrétní náplň se přizpůsobuje počasí, ročnímu
              období a tomu, co děti právě potřebují.
            </P>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>8:00–9:00</strong> — příchod dětí, volná hra, klidné
                rozkoukání
              </li>
              <li>
                <strong>9:00</strong> — společný kruh: pozdravení, plán dne,
                domluva
              </li>
              <li>
                <strong>9:15–12:00</strong> — hlavní blok: práce na vlastních
                úkolech a projektech, tvoření, pobyt venku, práce na zahradě či
                u zvířat
              </li>
              <li>
                <strong>12:00</strong> — společný oběd (kdo ho má objednaný),
                úklid
              </li>
              <li>
                <strong>12:30–13:00</strong> — klidová část: četba, odpočinek,
                tiché bytí; první odchody dětí
              </li>
              <li>
                <strong>13:00–16:00</strong> — odpolední blok: pohyb, výtvarná
                tvorba, hra v parku a zahradě, svačina
              </li>
              <li>
                <strong>16:00</strong> — rozchod, případně navazující kroužky
              </li>
            </ul>
            <P>
              Program dne (a jeho případné změny) zapisují průvodkyně do
              aplikace — v kalendáři ho uvidíte u konkrétního dne.
            </P>
          </Chapter>

          <Chapter num={5} title={CHAPTERS[4]}>
            <P>
              <strong>Ráno:</strong> dítě přiveďte mezi 8:00 a 9:00. Předání je
              osobní — rodič předá dítě průvodkyni pozdravem a očním kontaktem,
              teprve tím klub přebírá odpovědnost za dítě. Prosíme, nenechávejte
              dítě u brány „samo dojít“.
            </P>
            <P>
              <strong>Odpoledne:</strong> čas vyzvednutí volíte u každého dne
              v aplikaci — <strong>12:00, 13:00 nebo 16:00</strong>. Průvodkyně
              ho vidí v seznamu dětí na den. Potřebujete-li výjimečně jiný čas,
              domluvte se předem.
            </P>
            <P>
              Dítě předáváme <strong>výhradně rodičům nebo osobám uvedeným
              v evidenčním listu</strong> (oprávněné osoby). Uveďte prosím
              alespoň dvě oprávněné osoby s telefonním kontaktem a udržujte
              seznam aktuální v aplikaci. Jednorázovou výjimku (dnes vyzvedne
              babička kamarádky) je nutné oznámit předem písemně — stačí zpráva
              v aplikaci nebo e-mail.
            </P>
            <P>
              Má-li dítě odcházet <strong>samostatně</strong>, potřebujeme k tomu
              písemný souhlas rodičů s uvedením času; zodpovědnost za dítě
              končí okamžikem, kdy podle souhlasu opustí areál.
            </P>
            <P>
              <strong>Pozdní vyzvednutí:</strong> nevyzvednete-li dítě do konce
              provozní doby, postaráme se o ně nejdéle dvě hodiny po 16:00
              a účtujeme poplatek dle ceníku za každou započatou hodinu (objeví
              se v měsíčním vyúčtování). Prosíme, dejte nám vždy vědět
              telefonicky, že jdete pozdě — dítě, které neví, čeká hůř.
              Nepodaří-li se nám oprávněné osoby zastihnout, musíme postupovat
              podle zákona (vyrozumět OSPOD, případně Policii ČR).
            </P>
            <P>
              Průvodkyně může <strong>odmítnout převzetí dítěte</strong>, jeví-li
              známky akutního nebo infekčního onemocnění nebo stavu, který by
              ohrozil je samo či ostatní děti (viz kapitola 9).
            </P>
          </Chapter>

          <Chapter num={6} title={CHAPTERS[5]}>
            <P>
              Dny docházky si na začátku roku <strong>zafixujete v aplikaci</strong>
              {" "}podle sjednaného tarifu (1, 2 nebo 3 dny v týdnu z pondělí,
              úterý a středy). Fixace platí na celý školní rok; změnit ji lze
              podle volné kapacity.
            </P>
            <P>
              <strong>Odhlášení:</strong> dítě můžete z konkrétního dne odhlásit
              kdykoliv v aplikaci, i ráno v den docházky. Prosíme, dělejte to
              vždy přes aplikaci, ne SMS — průvodkyně tak hned vidí, s kým
              počítat, a můžete připojit vzkaz. Za odhlášený den se příspěvek
              nevrací.
            </P>
            <P>
              <strong>Kredit:</strong> odhlásíte-li dítě v jednom měsíci z více
              než poloviny jeho dnů, připíšeme vám v měsíčním vyúčtování kredit
              ve výši 20 % z fakturovaného měsíčního příspěvku. Počítají se jen
              dny odhlášené nejpozději do 23:59 předchozího dne. Kredit se
              automaticky čerpá na obědy, dny navíc, kroužky a akce.
            </P>
            <P>
              <strong>Den navíc:</strong> je-li volné místo, můžete dítě přihlásit
              i na den mimo tarif, nejpozději do <strong>7:00</strong> daného
              dne. Cena je uvedena v ceníku, faktura se vystaví hned při
              přihlášení.
            </P>
          </Chapter>

          <Chapter num={7} title={CHAPTERS[6]}>
            <P>
              Obědy vaříme převážně z produkce BIO farmy (kvalita Demeter).
              Společný oběd je pro nás rituál, ne jen jídlo.
            </P>
            <P>
              Oběd <strong>není objednáván automaticky</strong> — objednáte si ho
              v aplikaci, buď hromadně ke všem svým dnům, nebo po jednotlivých
              dnech. <strong>Objednat i odhlásit oběd lze nejpozději 7 dní
              předem</strong>; při pozdějším odhlášení dne oběd propadá a hradí
              se (kuchyně nakupuje suroviny dopředu). Obědy se účtují zpětně
              v měsíčním vyúčtování.
            </P>
            <P>
              Nemá-li dítě na daný den objednaný oběd, přibalte mu prosím
              plnohodnotné jídlo na cca 12:00.
            </P>
            <P>
              <strong>Svačiny a pití</strong> na celý den zajišťují rodiče.
              Prosíme bez sladkostí, sladkých limonád a energetických nápojů —
              vděčně přijmeme ovoce, zeleninu, pečivo, oříšky. Pitný režim
              (voda, čaj) doplňujeme v zázemí po celý den.
            </P>
            <P>
              <strong>Alergie, diety a jiná omezení</strong> uveďte v evidenčním
              listu a hlaste nám prosím i jejich změny. Kuchyně vidí pouze
              počty porcí a nutná dietní omezení — jména dětí ani jiné údaje ne.
            </P>
          </Chapter>

          <Chapter num={8} title={CHAPTERS[7]}>
            <P>
              Jsme venku za každého počasí, jen s výjimkou extrémů (silná
              bouřka, náledí, mráz pod −12 °C, vichřice). Platí staré severské:
              neexistuje špatné počasí, jen špatné oblečení.
            </P>
            <P>Dítě potřebuje každý den:</P>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                oblečení „na cibuli“ podle počasí, do kterého se smí ušpinit
              </li>
              <li>pláštěnku nebo nepromokavou bundu a kalhoty, gumáky</li>
              <li>
                náhradní oblečení a ponožky v batohu (v zimě dvoje rukavice)
              </li>
              <li>
                lahev s pitím, svačinu, kapesníky; podle sezóny pokrývku hlavy,
                opalovací krém, repelent
              </li>
              <li>přezůvky do zázemí</li>
              <li>
                vlastní pracovní materiál, na kterém dítě pracuje (učebnice,
                sešity, portfolio) — pokud s ním chce pracovat
              </li>
            </ul>
            <P>
              Věci prosím <strong>podepište</strong>. Klub neručí za zašpinění
              a běžné opotřebení oblečení — počítejte s tím, že práce na zahradě
              a hra v lese jsou vidět.
            </P>
            <P>
              Do klubu <strong>nepatří</strong> mobilní telefony a jiná
              elektronika (pokud se v konkrétním případě nedomluvíme jinak),
              cennosti, sladkosti, nože a předměty ohrožující zdraví. Za ztrátu
              takových věcí neručíme.
            </P>
          </Chapter>

          <Chapter num={9} title={CHAPTERS[8]}>
            <P>
              Do klubu patří <strong>zdravé dítě</strong>. Nechte je prosím doma
              při teplotě, zvracení, průjmu, silné rýmě s kašlem, vyrážce
              neznámého původu, zánětu spojivek a při vších. Průvodkyně může
              převzetí dítěte odmítnout — nevěří-li, že dítě zvládne celý den
              venku, nebo hrozí-li nákaza ostatních. Za takto odmítnutý den se
              nic nevrací.
            </P>
            <P>
              <strong>Onemocní-li dítě během dne</strong>, zavoláme vám
              a domluvíme se na vyzvednutí v čase odpovídajícím jeho stavu.
              Do té doby je dítě v klidu v zázemí.
            </P>
            <P>
              <strong>Léky</strong> podáváme jen výjimečně a pouze na základě
              písemného pokynu rodičů s přesným dávkováním (nejlépe zápisem
              v aplikaci). Léky, které dítě potřebuje akutně (astma, alergie,
              epipen), předejte průvodkyni osobně a označte je.
            </P>
            <P>
              <strong>Chronická onemocnění, alergie, dietní a psychická omezení</strong>
              {" "}uveďte v evidenčním listu. Tyto údaje jsou v aplikaci{" "}
              <strong>chráněné zvlášť heslem</strong> a vidí je jen rodiče
              daného dítěte, průvodkyně a provozovatel.
            </P>
            <P>
              <strong>První pomoc a úrazy:</strong> průvodkyně jsou proškolené
              v poskytování první pomoci a v zázemí i v terénu máme lékárničku.
              Drobná ošetření (odřenina, klíště, hmyzí bodnutí) zvládneme na
              místě a vždy vám je ohlásíme při předání dítěte. Při vážnějším
              úrazu voláme nejprve záchrannou službu, poté vás. O každém úrazu
              vedeme záznam.
            </P>
            <P>
              <strong>Klíšťata</strong> jsou v Krkonoších realita. Děti
              prohlížíme a nalezené klíště odstraníme a místo označíme;
              informujeme vás týž den. Očkování proti klíšťové encefalitidě
              doporučujeme, ale nevyžadujeme.
            </P>
            <P>
              Klub <strong>nemá sjednané úrazové pojištění dětí</strong> —
              provozovatel má pojištění odpovědnosti za újmu způsobenou
              provozem. Úrazové pojištění dítěte si prosím sjednejte sami,
              považujeme to za rozumné.
            </P>
          </Chapter>

          <Chapter num={10} title={CHAPTERS[9]}>
            <P>
              Jsme na živé zemědělské farmě. To je pro děti obrovský dar
              a zároveň to znamená jasná pravidla, která si s dětmi na začátku
              roku a pak průběžně opakujeme:
            </P>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                pohybujeme se jen ve vymezené části areálu a v dohledu či
                doslechu průvodkyně; na zavolání jménem se ozýváme
              </li>
              <li>
                do provozních částí farmy (stáje, sklady, dílny, technika)
                vstupujeme jen s dospělým
              </li>
              <li>
                ke zvířatům chodíme jen s dospělým a podle jeho pokynů; zvířata
                nekrmíme bez svolení
              </li>
              <li>
                s nářadím, nožem a u ohně pracujeme pod dohledem dospělého a po
                zaškolení
              </li>
              <li>
                neochutnáváme rostliny a plody, které neznáme; před jídlem si
                myjeme ruce
              </li>
              <li>
                k vodě, stroji ani na žebřík nechodíme sami; do lesa chodíme
                společně
              </li>
              <li>
                cizí psi do areálu klubu nesmí; se psy farmy se seznamujeme
                s dospělým
              </li>
            </ul>
            <P>
              Průvodkyně vždy ví, kolik dětí má a kde jsou, a má u sebe nabitý
              telefon a lékárničku. Při výletech mimo areál známe místo srazu
              i návratu a rodiče o něm vědí předem z aplikace.
            </P>
          </Chapter>

          <Chapter num={11} title={CHAPTERS[10]}>
            <P>
              Vedeme děti k laskavosti a k tomu, aby nesly důsledky svých činů.
              Nikoho neponižujeme, nekřičíme na děti a nepoužíváme tresty.
              Nefunguje-li něco, mluvíme o tom — nejdřív s dítětem, potom
              s vámi.
            </P>
            <P>
              Základní pravidla soužití jsou tři: <strong>neubližuji sobě,
              neubližuji druhým, neničím věci a prostředí kolem sebe.</strong>
              {" "}Vše ostatní se z nich dá odvodit.
            </P>
            <P>
              Objeví-li se opakované chování, které narušuje bezpečí nebo provoz
              klubu, postupujeme takto: (1) domluva s dítětem, (2) rozhovor
              s rodiči a společný plán, (3) písemné upozornění, (4) v krajním
              případě ukončení docházky výpovědí podle smlouvy. Bod 4 je pro nás
              selhání, ne nástroj — ale bezpečí ostatních dětí je přednější.
            </P>
          </Chapter>

          <Chapter num={12} title={CHAPTERS[11]}>
            <P>
              <strong>Program dne</strong> zapisují průvodkyně do aplikace.
              Změní-li se něco podstatného (jiné místo srazu, výlet, jiný konec
              dne), označíme den jako změnu a rodičům přihlášených dětí odejde
              e-mail.
            </P>
            <P>
              <strong>Výlety a mimořádné akce</strong> vyhlašujeme v kalendáři
              s popisem, kapacitou a případnou cenou. Placené akce se hradí
              předem, přihláška je závazná úhradou. U některých akcí je
              checklist — potvrzení podmínek nebo dodání podkladů; bez něj dítě
              na akci vzít nemůžeme.
            </P>
            <P>
              <strong>Odpolední kroužky</strong> běží po 16:00 za příplatek dle
              ceníku. U každého kroužku najdete v aplikaci téma, kdo ho vede
              a medailonek průvodkyně.
            </P>
          </Chapter>

          <Chapter num={13} title={CHAPTERS[12]}>
            <P>
              Hlavním kanálem je <strong>aplikace klubu</strong> — docházka,
              obědy, program, platby, vzkazy. Prosíme, udržujte v ní své
              kontakty aktuální a používejte ji; ušetří to nám i vám spoustu
              zpráv.
            </P>
            <P>
              Podstatná sdělení posíláme navíc <strong>e-mailem</strong>. Na
              rychlou domluvu (nemoc, zpoždění) je telefon.
            </P>
            <P>
              Chcete-li mluvit o dítěti do hloubky, domluvme si{" "}
              <strong>konzultaci</strong> — během dne mají průvodkyně děti na
              starosti a nemohou se věnovat delšímu hovoru. Nejméně jednou za
              rok si sedneme společně nad tím, jak se dítěti u nás daří.
            </P>
            <P>
              Kontakt na provozovatele:{" "}
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
              .
            </P>
          </Chapter>

          <Chapter num={14} title={CHAPTERS[13]}>
            <P>
              Měsíční příspěvek na provoz se hradí <strong>předem</strong> na
              základě faktury, splatnost do 25. dne předchozího měsíce. Za{" "}
              <strong>září a říjen 2026 se příspěvek nehradí</strong> (adaptační
              období) — bezplatná je jen docházka podle tarifu, obědy a ostatní
              služby se hradí i v tomto období.
            </P>
            <P>
              Obědy, neuhrazené dny navíc a další doplatky se účtují zpětně
              jedním <strong>měsíčním vyúčtováním</strong> se splatností do
              10. dne následujícího měsíce. Akce a kroužky se hradí předem.
            </P>
            <P>
              Chodí-li do klubu více sourozenců, náleží{" "}
              <strong>sourozenecká sleva 5 %</strong> z měsíčního příspěvku za
              každé takové dítě. Aktuální ceny najdete v ceníku, který je
              přílohou smlouvy, a ve svém profilu v aplikaci.
            </P>
          </Chapter>

          <Chapter num={15} title={CHAPTERS[14]}>
            <P>
              Činnost klubu dokumentujeme fotografiemi a videem zásadně tak, aby
              na nich <strong>děti nebyly identifikovatelné</strong> — záběry
              zezadu, z odstupu, detaily práce a tvoření. Nechceme fotit děti,
              chceme ukazovat, co se v klubu děje.
            </P>
            <P>
              Fotografii, na které je dítě <strong>poznat</strong>, zveřejníme
              jen tehdy, když ji předem <strong>schválíte</strong>. Konkrétní
              fotky vám posíláme ke schválení do aplikace — u každé můžete
              schválit, zamítnout, nebo schválit s podmínkou (například „ano,
              ale zakryjte obličej“). Schválení je dobrovolné, není podmínkou
              docházky a lze je kdykoli odvolat; zveřejněnou fotku pak
              odstraníme ze všech zdrojů, které máme pod kontrolou.
            </P>
            <P>
              Jak nakládáme s osobními údaji dětí a rodičů, včetně zdravotních
              údajů, popisují{" "}
              <Link
                href="/ochrana-osobnich-udaju"
                className="text-orange hover:underline"
              >
                Zásady zpracování osobních údajů
              </Link>
              .
            </P>
            <P>
              Prosíme i vás: fotografie z akcí klubu, na kterých jsou cizí děti,
              nezveřejňujte na sociálních sítích bez souhlasu jejich rodičů.
            </P>
          </Chapter>

          <Chapter num={16} title={CHAPTERS[15]}>
            <P>
              Cokoliv vás trápí, řekněte nám to prosím co nejdřív a napřímo —
              nejlépe průvodkyni, které se to týká, nebo rovnou provozovateli na{" "}
              <a
                href="mailto:reditel@doucse.cz"
                className="text-orange hover:underline"
              >
                reditel@doucse.cz
              </a>
              . Na písemné podněty odpovídáme nejpozději do 14 dnů. Nedojdeme-li
              ke shodě, můžeme se sejít společně; spotřebitelské spory ze
              smlouvy je možné řešit mimosoudně u České obchodní inspekce
              (www.coi.cz).
            </P>
          </Chapter>

          <Chapter num={17} title={CHAPTERS[16]}>
            <P>
              Tento provozní řád je účinný od <strong>1. září 2026</strong> a je
              nedílnou součástí smlouvy o docházce. Změny oznamujeme v aplikaci
              a e-mailem, u podstatných změn zpravidla alespoň měsíc předem.
            </P>
            <P className="text-sm text-dark/60">
              Vzdělávací centrum Doučse, z.s. · Vzdělávací klub Farma Fořt ·
              Fořt 29, 543 44 Černý Důl
            </P>
          </Chapter>
        </div>

        <div className="mt-12 pt-8 border-t border-dark/10 flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange/90 transition-colors"
          >
            ← Zpět na hlavní stránku
          </Link>
          <Link
            href="/ochrana-osobnich-udaju"
            className="inline-flex items-center gap-2 bg-white text-dark font-bold px-6 py-3 rounded-full hover:bg-white/80 transition-colors"
          >
            Zásady zpracování osobních údajů
          </Link>
        </div>
      </div>
    </main>
  );
}
