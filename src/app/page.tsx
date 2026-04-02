import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import CooperationSection from "@/components/CooperationSection";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/file_00000000dd50720a8ca783401aa451d0.png"
              alt="Děti zkoumající přírodu na farmě Fořt"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/70 via-dark/50 to-dark/30" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <p className="text-orange font-semibold text-sm sm:text-base tracking-wide uppercase mb-4">
                Startujeme v září 2026
              </p>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Vzdělávací klub
                <br />
                na BIO farmě
                <span className="text-orange"> Fořt</span>
              </h1>
              <p className="text-lg sm:text-xl text-white/90 leading-relaxed mb-4 italic">
                „Pevné kořeny pro svobodný let."
              </p>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-xl">
                Komunitní prostor pro děti na individuálním vzdělávání.
                Příroda Krkonoš, život na farmě a radost z poznávání —
                to vše v bezpečném společenství.
              </p>
              <div className="animate-bounce inline-block bg-white/95 text-forest font-extrabold text-sm sm:text-base px-5 py-2.5 rounded-full shadow-lg mb-6">
                SLEVA 30 % pro prvních 10 přihlášených!
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#kontakt"
                  className="bg-orange hover:bg-orange-hover text-dark font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-colors text-center text-base sm:text-lg"
                >
                  Mám zájem — ozvěte se mi
                </a>
                <a
                  href="#o-nas"
                  className="border-2 border-white/40 hover:border-white text-white font-semibold px-8 py-4 rounded-full transition-colors text-center"
                >
                  Zjistit více
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ O NÁS ============ */}
        <section id="o-nas" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                Nejsme škola. Jsme společenství.
              </h2>
              <p className="text-lg text-brown leading-relaxed">
                Věříme, že návrat k přírodě a ke klidnému tempu je tou nejlepší
                cestou pro rozvoj dětí. Náš klub vytváří bezpečný prostor, kde se
                děti učí rozumět světu kolem sebe — svým tempem, s radostí
                a&nbsp;v&nbsp;kontaktu s&nbsp;živou přírodou.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Dětství jako prožitek",
                  text: "Štěstí není výkon. Dítě u nás má prostor pro hru, ticho i bezpečí — je přijímáno takové, jaké je.",
                },
                {
                  title: "Respekt k rytmu",
                  text: "Vnímáme přírodní cykly a biorytmy dětí. Každý potřebuje jiný čas na růst, na hru i na objevování.",
                },
                {
                  title: "Péče o živé",
                  text: "Prostředí farmy nás učí úctě k půdě, zvířatům i jídlu, které nás sytí.",
                },
                {
                  title: "Radost z poznání",
                  text: "Podporujeme přirozenou zvídavost. Kvalitní materiály, které dětem dávají smysl a baví je.",
                },
                {
                  title: "Srdce na pravém místě",
                  text: "Vedeme děti k laskavosti, empatii a morálním hodnotám skrze každodenní společné prožitky.",
                },
                {
                  title: "Komunita a rodina",
                  text: "Nejsme instituce. Jsme skupina, která společně žije, objevuje a roste — děti i dospělí.",
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="bg-forest-pale rounded-2xl p-6 sm:p-8 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg font-bold text-forest mb-3">
                    {value.title}
                  </h3>
                  <p className="text-brown text-sm leading-relaxed">
                    {value.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ JAK TRÁVÍME ČAS ============ */}
        <section className="py-20 sm:py-28 bg-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-16 text-center">
              Jak u nás trávíme čas
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/1769935805824.png"
                  alt="Děti tvoří u stolu u kamen v historické budově"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Život v přírodě</h3>
                  <p className="text-brown leading-relaxed">
                    Děti se přirozeně zapojují do rytmu farmy — od péče o zvířata
                    po pozorování růstu plodin. Každé dítě se zapojuje podle své
                    chuti, věku a síly.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Kvalitní strava</h3>
                  <p className="text-brown leading-relaxed">
                    Děti mají možnost obědvat plnohodnotnou bio stravu přímo
                    z produkce farmy. Společný oběd v Demeter kvalitě je pro nás
                    rituálem a zdravým palivem pro tělo i mysl.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Tvoření a ticho</h3>
                  <p className="text-brown leading-relaxed">
                    Čas na odpočinek, četbu, výtvarnou tvorbu, pohyb v hale
                    nebo jen tiché bytí v přírodě. Bez spěchu, bez tlaku.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { src: "/images/file_00000000f25471f49713aef020d23bf5.png", alt: "Kuchyně na farmě — sušené bylinky, společné vaření" },
                { src: "/images/1769935847552.png", alt: "Děti kreslí a odpočívají v útulné místnosti" },
                { src: "/images/file_000000005258720a8e6f6a8434c011f7.png", alt: "Studovna se zelenými závěsy — děti se soustředí" },
              ].map((photo) => (
                <div key={photo.src} className="rounded-2xl overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={640}
                    height={420}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ BIO STRAVA ============ */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/file_00000000852471f4a2cec4aab459b9af_2.png"
                  alt="Farmářská kuchyně — společná příprava jídel na farmě"
                  width={800}
                  height={530}
                  className="w-full h-80 sm:h-[420px] object-cover"
                />
              </div>
              <div>
                <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                  Přímo z farmy na talíř
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                  Lokální BIO strava z&nbsp;produkce farmy
                </h2>
                <p className="text-lg text-brown leading-relaxed mb-6">
                  Děti u nás obědvají plnohodnotnou stravu připravenou z&nbsp;čerstvých
                  surovin přímo z&nbsp;BIO farmy Fořt. Žádné polotovary, žádné
                  dodavatelské firmy — jídlo roste tam, kde se děti učí.
                </p>
                <div className="space-y-4 mb-8">
                  {[
                    "Zelenina, ovoce a bylinky z vlastních políček farmy",
                    "Mléčné výrobky a vejce od farmářských zvířat",
                    "Strava v Demeter kvalitě — nejvyšší BIO standard",
                    "Společný oběd jako denní rituál a příležitost k setkání",
                    "Děti se podílejí na přípravě — učí se odkud jídlo pochází",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                      </span>
                      <span className="text-brown">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-brown-light leading-relaxed">
                  Farma Fořt je certifikovaný BIO producent. Děti tak dostávají
                  to nejlepší, co krajina Krkonoš nabízí — čerstvé, sezónní
                  a s&nbsp;příběhem. Oběd stojí 80&nbsp;Kč.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROGRAM ============ */}
        <section id="program" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-forest font-semibold text-sm uppercase tracking-wide mb-3">
                  Pro koho jsme
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6">
                  Program Badatelé
                </h2>
                <p className="text-lg text-brown leading-relaxed mb-8">
                  Pro děti 1.–5. ročníku ZŠ, které jsou vzdělávány v režimu
                  individuálního vzdělávání. Vaše dítě zůstává zapsáno na
                  kmenové škole — my mu poskytujeme inspirativní zázemí
                  a průvodce na jeho cestě.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    "Studijní zázemí v historické budově na farmě",
                    "Metodická podpora a individuální vedení",
                    "Projektové učení propojené s životem na farmě",
                    "Prostor pro soustředěnou práci i volnou hru",
                    "Pomůžeme vám najít vhodnou kmenovou školu",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-forest-pale flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-forest" />
                      </span>
                      <span className="text-brown">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-beige rounded-xl p-5 mb-4">
                  <p className="text-brown leading-relaxed text-sm">
                    <span className="font-bold text-dark">A co po 5. třídě?</span>{" "}
                    Plánujeme postupné rozšíření až do 9. ročníku. Startujeme
                    s&nbsp;prvním stupněm, ale naším cílem je, aby děti mohly
                    zůstat spolu po celou dobu základního vzdělávání. Kamarádi
                    se nerozprchnou — rosteme společně.
                  </p>
                </div>

                <p className="text-sm text-brown-light mb-8">
                  Docházka 2&nbsp;dny v&nbsp;týdnu od&nbsp;2&nbsp;730&nbsp;Kč/měs.
                </p>

                <a
                  href="#kontakt"
                  className="inline-block bg-orange hover:bg-orange-hover text-dark font-bold px-8 py-4 rounded-full transition-colors"
                >
                  Chci přihlásit dítě
                </a>
              </div>

              <div className="relative h-96 sm:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="/images/file_000000005b1871f4948ccf97b62c7d18.png"
                  alt="Klidná studijní místnost s polštáři a svíčkou"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ ZÁZEMÍ ============ */}
        <section id="zazemi" className="py-20 sm:py-28 bg-forest-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Učebna bez zdí
              </h2>
              <p className="text-lg text-brown max-w-2xl mx-auto">
                Naše prostředí stimuluje zvídavost a umožňuje dětem pohyb
                v bezpečné náruči přírody Krkonoš.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Badatelské prostory",
                  desc: "Klidná a vybavená místnost v historické budově pro soustředěné učení.",
                  img: "/images/file_000000005258720a8e6f6a8434c011f7.png",
                },
                {
                  title: "Společenská místnost",
                  desc: "Srdce naší farmy — kamna, velký stůl, společné tvoření a rituály dne.",
                  img: "/images/1769935805824.png",
                },
                {
                  title: "Klidový prostor",
                  desc: "Místo pro odpočinek, čtení a ticho. Polštáře, svíčky a klid.",
                  img: "/images/file_000000005b1871f4948ccf97b62c7d18.png",
                },
                {
                  title: "Venkovní altán",
                  desc: "Zastřešený prostor uprostřed parku — ideální pro výtvarné aktivity, čtení i společné svačiny na čerstvém vzduchu.",
                  img: "/images/pavan-naik-HANPH-sgVMM-unsplash.jpg",
                },
                {
                  title: "Krytá sportovní hala",
                  desc: "Obrovská hala, kde se běžně trénují koně a konají farmářské akce. Pro děti slouží ke sportu, hrám a pohybu za každého počasí.",
                  img: "/images/maksim-shutov-SID1C6IX_xQ-unsplash.jpg",
                },
                {
                  title: "Park farmy a krajina",
                  desc: "Nádherný park s dávnými stromy a rozlehlé louky Krkonoš — přirozené hřiště, místo pro výlety a zkoumání přírody.",
                  img: "/images/mohamed-b-tnFTEWxVC1Y-unsplash.jpg",
                },
              ].map((space) => (
                <div
                  key={space.title}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  <Image
                    src={space.img}
                    alt={space.title}
                    width={640}
                    height={420}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-bold text-dark mb-1">{space.title}</h3>
                    <p className="text-sm text-brown leading-relaxed">
                      {space.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ AKTIVITY ============ */}
        <section id="aktivity" className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6 text-center">
              Život v pohybu
            </h2>
            <p className="text-lg text-brown text-center max-w-2xl mx-auto mb-16">
              Vzdělávání nekončí za branami farmy. Pořádáme aktivity, které
              rozšiřují obzory a budují komunitu.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Výlety a expedice",
                  text: "Poznávání okolní krajiny, orientace v terénu a úcta k regionu.",
                },
                {
                  title: "Plavání a lyže",
                  text: "Pravidelný plavecký výcvik a zimní kurzy v krkonošských střediscích.",
                },
                {
                  title: "Sezónní slavnosti",
                  text: "Dožínky, slunovraty, masopust — slavíme rytmy roku společně s rodinami.",
                },
                {
                  title: "Sport a pohyb",
                  text: "Bruslení, atletika, cyklistika — podle zájmu a sezóny, v malé skupince.",
                },
              ].map((activity) => (
                <div
                  key={activity.title}
                  className="bg-beige rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="font-bold text-dark mb-2">{activity.title}</h3>
                  <p className="text-sm text-brown leading-relaxed">
                    {activity.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRO RODIČE ============ */}
        <section id="pro-rodice" className="py-20 sm:py-28 bg-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-6 text-center">
                Pro rodiče
              </h2>
              <p className="text-lg text-brown text-center mb-12">
                Důležité informace o tom, jak to u nás funguje.
              </p>

              <div className="space-y-6">
                {[
                  {
                    q: "Jak funguje individuální vzdělávání?",
                    a: "Vaše dítě zůstává zapsáno na kmenové škole a absolvuje pravidelná pololetní přezkoušení. Vy jako rodiče zůstáváte hlavními garanty vzdělávání. My poskytujeme inspirativní prostředí, zázemí a metodickou podporu.",
                  },
                  {
                    q: "Kdo jsou průvodci?",
                    a: "Naši průvodci nejsou učiteli ve smyslu školského zákona. Jsou to mentoři, kteří dětem pomáhají s jejich individuálními plány a rozvojem. Provází je na cestě poznáním s laskavostí a respektem.",
                  },
                  {
                    q: "Nemáme ještě schválené IV. Pomůžete nám?",
                    a: "Ano. Pomůžeme vám s procesem přihlášení k individuálnímu vzdělávání i s hledáním vhodné kmenové školy. Stačí se nám ozvat.",
                  },
                  {
                    q: "Jaký je právní rámec?",
                    a: "Jsme komunitní vzdělávací program spolku Vzdělávací centrum Doučse z.s. Nejsme školou, mateřskou školou ani registrovanou dětskou skupinou. Účast probíhá na základě soukromoprávní smlouvy.",
                  },
                  {
                    q: "Kde se to nachází?",
                    a: "BIO farma Fořt leží v Černém Dole u Rudníku, nedaleko Vrchlabí, přímo v srdci Krkonoš. Adresa: Fořt 29, 543 44.",
                  },
                ].map((faq) => (
                  <div
                    key={faq.q}
                    className="bg-white rounded-2xl p-6 sm:p-8"
                  >
                    <h3 className="font-bold text-dark mb-2">{faq.q}</h3>
                    <p className="text-brown leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ AKCE - SLEVA ============ */}
        <section className="py-10 sm:py-14 bg-orange relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="animate-bounce inline-block bg-white text-forest font-extrabold text-lg sm:text-2xl px-6 py-3 rounded-full shadow-lg mb-6">
              SLEVA 30 % pro prvních 10 přihlášených!
            </p>
            <p className="text-dark text-base sm:text-lg font-medium max-w-2xl mx-auto">
              Připojte se k nám jako jedni z prvních a získejte slevu 30&nbsp;%
              na roční příspěvek. Nabídka platí do naplnění kapacity.
            </p>
            <a
              href="#kontakt"
              className="inline-block mt-6 bg-dark hover:bg-brown text-white font-bold px-8 py-4 rounded-full transition-colors text-lg"
            >
              Chci slevu — přihlásit se
            </a>
          </div>
        </section>

        {/* ============ CTA BANNER ============ */}
        <section className="py-16 sm:py-20 bg-forest text-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-orange font-semibold text-sm uppercase tracking-wide mb-4">
              Od 1. září 2026
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Rozjíždíme to. Přidejte se k nám.
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Hledáme rodiny, které chtějí pro své děti něco víc než jen lavici
              a učebnici. Pokud vás naše vize oslovuje, ozvěte se —
              rádi si popovídáme.
            </p>
            <a
              href="#kontakt"
              className="inline-block bg-orange hover:bg-orange-hover text-dark font-bold px-10 py-4 rounded-full transition-colors text-lg"
            >
              Mám zájem — napište mi
            </a>
          </div>
        </section>

        {/* ============ SPOLUPRÁCE ============ */}
        <section id="spoluprace" className="py-20 sm:py-28 bg-forest-pale">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                Spolupráce a podpora
              </h2>
              <p className="text-lg text-brown max-w-2xl mx-auto">
                Budujeme něco nového a každá pomoc se počítá. Chcete být součástí
                našeho příběhu? Hledáme průvodce, dobrovolníky i podporovatele.
              </p>
            </div>
            <CooperationSection />
          </div>
        </section>

        {/* ============ DOUČSE ZÁŠTITA ============ */}
        <section className="py-12 bg-white border-t border-beige-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
              <Image
                src="/images/doucse_logo.png"
                alt="Doučse — vzdělávací centrum"
                width={48}
                height={48}
              />
              <p className="text-brown text-sm max-w-lg">
                Pod záštitou{" "}
                <a
                  href="https://doucse.cz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest font-semibold hover:underline"
                >
                  Vzdělávacího centra Doučse z.s.
                </a>{" "}
                — více než 8 let zkušeností ve vzdělávání dětí po celé ČR.
              </p>
            </div>
          </div>
        </section>

        {/* ============ KONTAKT ============ */}
        <section id="kontakt" className="py-20 sm:py-28 bg-beige">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-dark mb-4">
                  Ozvěte se nám
                </h2>
                <p className="text-brown leading-relaxed mb-8">
                  Máte zájem, otázky, nebo si chcete jen popovídat?
                  Vyplňte formulář, zavolejte nebo napište e-mail.
                  Rádi se s vámi spojíme.
                </p>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-dark">Kontaktní osoba</p>
                    <p className="text-brown font-medium">
                      Ing. et Bc. Ivan Jadrný
                      <br />
                      <span className="text-brown-light text-sm">ředitel Vzdělávacího centra Doučse z.s.</span>
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Telefon</p>
                    <a
                      href="tel:+420775917363"
                      className="text-forest font-bold text-lg hover:text-forest-light transition-colors"
                    >
                      775 917 363
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">E-mail</p>
                    <a
                      href="mailto:reditel@doucse.cz"
                      className="text-forest font-bold hover:text-forest-light transition-colors"
                    >
                      reditel@doucse.cz
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-dark">Adresa</p>
                    <p className="text-brown">
                      Fořt 29, 543 44
                      <br />
                      Černý Důl – Rudník u Vrchlabí
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm">
                  <ContactForm />
                </div>
              </div>
            </div>

            {/* Mapa */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-dark mb-2 text-center">
                Kde nás najdete
              </h3>
              <p className="text-brown text-center mb-6">
                BIO farma Fořt — v srdci Krkonoš, kousek od Vrchlabí
              </p>
              <div className="rounded-2xl overflow-hidden shadow-lg ring-1 ring-beige-dark">
                <iframe
                  src="https://frame.mapy.cz/?x=15.6928&y=50.5972&z=14&l=0&m=firm&p=50.5972%2C15.6928"
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="h-[280px] sm:h-[350px]"
                  title="Mapa — BIO farma Fořt, Černý Důl"
                />
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <a
                  href="https://www.google.com/maps/search/Fořt+29,+543+44+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest text-sm font-semibold hover:underline"
                >
                  Google Maps &rarr;
                </a>
                <a
                  href="https://mapy.cz/zakladni?q=Fořt+29+Černý+Důl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest text-sm font-semibold hover:underline"
                >
                  Mapy.cz &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
