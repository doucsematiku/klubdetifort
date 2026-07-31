import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import CooperationSection from "@/components/CooperationSection";
import ProstorKarta from "@/components/ProstorKarta";

export default function Home() {
  return (
    <>
      <Header />

      <main className="flex-1">
        {/* ============ HERO ============ */}
        <section className="relative min-h-[90vh] flex items-center pt-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/park2.png"
              alt="Hlavní budova BIO farmy Fořt v parku"
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

        {/* ============ PROHLÍDKY — banner ============ */}
        <section id="prohlidky-banner" className="bg-forest text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-10 items-center">
              <div>
                <p className="text-orange font-semibold text-xs sm:text-sm tracking-wide uppercase mb-2">
                  Otevíráme bránu — přijďte s dětmi
                </p>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3">
                  Přijďte se podívat na farmu
                </h2>
                <p className="text-white/85 leading-relaxed max-w-2xl text-sm sm:text-base">
                  Prohlídky areálu domlouváme <strong>individuálně</strong>{" "}— ať máme
                  čas v&nbsp;klidu vás provést a&nbsp;odpovědět na vaše otázky. Napište
                  nám termíny, které by vám vyhovovaly, a&nbsp;my se vám ozveme.
                  Přijďte klidně i&nbsp;s&nbsp;dětmi nasát atmosféru BIO farmy Fořt.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/prohlidky"
                  className="bg-orange hover:bg-orange-hover text-dark font-bold px-7 py-3.5 rounded-full transition-colors text-center text-base sm:text-lg whitespace-nowrap"
                >
                  Domluvit prohlídku →
                </Link>
                <p className="text-white/60 text-xs text-center">
                  Termíny navrhujete vy — až do konce srpna
                </p>
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
                  text: "Nejsme instituce. Jsme skupinka lidí, které spojuje touha objevovat a růst — děti i dospělí, každý svým tempem.",
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
                  src="/images/park.png"
                  alt="Kamenný stůl v parku farmy Fořt — venkovní zázemí"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-dark mb-2">Život v přírodě</h3>
                  <p className="text-brown leading-relaxed">
                    Děti jsou v prostředí živé BIO farmy. Po domluvě s&nbsp;majiteli
                    farmy se mohou občas připojit k&nbsp;jejímu dění — třeba
                    pozorovat zvířata nebo růst plodin. Hlavní náplní programu je
                    však klidná hra, tvoření a&nbsp;pobyt v&nbsp;přírodě.
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
                { src: "/images/klubik/klubik-12.jpg", alt: "Děti tvoří z barevných papírů na trávě" },
                { src: "/images/klubik/klubik-06.jpg", alt: "Odpočinek na dece ve stínu stromů v parku farmy" },
                { src: "/images/klubik/klubik-21.jpg", alt: "Společné dílo dětí — malovaná plachta s barevnými stuhami" },
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

            <p className="mt-6 text-center text-brown">
              <Link href="/galerie" className="font-semibold text-forest underline">
                Podívejte se na fotky z letní akce pro děti →
              </Link>
            </p>
          </div>
        </section>

        {/* ============ BIO STRAVA ============ */}
        <section className="py-20 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src="/images/klubik/klubik-27.jpg"
                  alt="Děti krájí jablka na svačinu u venkovního stolu"
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

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 rounded-2xl overflow-hidden">
                  <Image
                    src="/images/klubik/klubik-38.jpg"
                    alt="Děti kreslí a zapisují si vlastní pozorování venku"
                    width={900}
                    height={600}
                    className="w-full h-56 sm:h-72 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="/images/klubik/klubik-53.jpg"
                    alt="Průvodkyně a děti nad společnou prací"
                    width={600}
                    height={600}
                    className="w-full h-40 sm:h-52 object-cover"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src="/images/klubik/klubik-51.jpg"
                    alt="Děti zkoumají nález venku v parku"
                    width={600}
                    height={600}
                    className="w-full h-40 sm:h-52 object-cover"
                  />
                </div>
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
                  fotky: [
                    { src: "/images/klubik/prostor-badatelna-1.jpg", alt: "Světlá místnost s kobercem a podsedáky" },
                    { src: "/images/klubik/prostor-badatelna-2.jpg", alt: "Místnost s mapou a policemi u okna" },
                    { src: "/images/klubik/prostor-badatelna-3.jpg", alt: "Badatelská místnost s dřevěným stropem" },
                  ],
                },
                {
                  title: "Společenská místnost",
                  desc: "Srdce naší farmy — kamna, velký stůl, společné tvoření a rituály dne.",
                  fotky: [
                    { src: "/images/klubik/prostor-spolecenska-1.jpg", alt: "Velký zelený stůl a průchod do kuchyně" },
                    { src: "/images/klubik/prostor-spolecenska-2.jpg", alt: "Posezení u kamen s pohovkou" },
                    { src: "/images/klubik/prostor-spolecenska-3.jpg", alt: "Jídelní kout u oken do zahrady" },
                    { src: "/images/klubik/prostor-spolecenska-4.jpg", alt: "Obrázky a zrcadlo na stěně místnosti" },
                  ],
                },
                {
                  title: "Klidová místnost a teráska",
                  desc: "Zastřešená teráska s výhledem na louky a pasoucí se krávy — místo na odpočinek, čtení a ticho.",
                  fotky: [
                    { src: "/images/klubik/prostor-klidova-1.jpg", alt: "Krytá teráska s lehátky a výhledem do krajiny" },
                    { src: "/images/klubik/prostor-klidova-2.jpg", alt: "Výhled z terásky na pastvinu s kravami" },
                    { src: "/images/klubik/prostor-klidova-3.jpg", alt: "Pohled z místnosti na terásku" },
                    { src: "/images/klubik/prostor-klidova-4.jpg", alt: "Dřevěná teráska s lehátky" },
                    { src: "/images/klubik/prostor-klidova-5.jpg", alt: "Teráska ze strany, zastřešená a s výhledem" },
                  ],
                },
                {
                  title: "Badatelské procházky v okolí farmy",
                  desc: "Vyrážíme do krajiny kolem farmy — k potoku, na louky a do lesa. Co děti cestou najdou, spolu prozkoumáme, a pak si to třeba i namalujeme.",
                  fotky: [
                    { src: "/images/klubik/klubik-43.jpg", alt: "Výprava krajinou pod Krkonošemi" },
                    { src: "/images/klubik/klubik-48.jpg", alt: "Zkoumání potoka" },
                    { src: "/images/klubik/klubik-39.jpg", alt: "Malování venku na dece" },
                  ],
                },
                {
                  title: "Malí kulináři",
                  desc: "Krájíme, pečeme a opékáme z toho, co dá farma — od jablek po hadovku nad ohněm. Co si děti samy uchystají, chutná nejvíc.",
                  fotky: [
                    { src: "/images/klubik/klubik-29.jpg", alt: "Krájení jablek na svačinu" },
                    { src: "/images/klubik/klubik-31.jpg", alt: "Hadovka z těsta nad ohněm" },
                    { src: "/images/klubik/klubik-30.jpg", alt: "Nachystaná jablka k pečení" },
                    { src: "/images/klubik/prostor-kuchyne.jpg", alt: "Kuchyňský pult na farmě s kalendářem sezónních plodin" },
                  ],
                },
                {
                  title: "Park farmy a krajina",
                  desc: "Nádherný park s dávnými stromy a rozlehlé louky Krkonoš — přirozené hřiště, místo pro výlety a zkoumání přírody.",
                  fotky: [
                    { src: "/images/park.png", alt: "Kamenný stůl v parku farmy" },
                    { src: "/images/klubik/klubik-03.jpg", alt: "Děti na kamenném stole v parku" },
                    { src: "/images/park3.png", alt: "Ohniště s dřevěnými špalky" },
                    { src: "/images/klubik/klubik-06.jpg", alt: "Odpočinek na dece ve stínu stromů" },
                    { src: "/images/park4.png", alt: "Divoká zahrada na farmě" },
                    { src: "/images/klubik/klubik-11.jpg", alt: "Společné dílo rozvěšené mezi stromy" },
                    { src: "/images/klubik/klubik-14.jpg", alt: "Malování na plachtu v parku" },
                    { src: "/images/klubik/prostor-park.jpg", alt: "Pohled z okna farmy do parku" },
                  ],
                },
              ].map((space) => (
                <ProstorKarta key={space.title} prostor={space} />
              ))}
            </div>

            <p className="mt-6 text-center text-sm text-brown/70">
              U prostorů s víc fotkami klepněte na malé náhledy — velká fotka se
              vymění.
            </p>
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

        {/* ============ AKCE - START ZDARMA + SLEVA ============ */}
        <section className="py-12 sm:py-16 bg-orange relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="animate-bounce inline-block bg-white text-forest font-extrabold text-xl sm:text-3xl px-6 py-3 rounded-full shadow-lg mb-5">
              ZÁŘÍ a ŘÍJEN 2026 ZDARMA
            </p>
            <p className="text-dark text-base sm:text-lg font-semibold max-w-2xl mx-auto mb-6">
              První dva měsíce v klubu jsou pro přihlášené děti zcela zdarma —
              přijďte zažít, jak to u nás funguje, bez finančního závazku.
            </p>

            <p className="inline-block bg-white/90 text-forest font-bold text-sm sm:text-base px-5 py-2 rounded-full shadow mb-6">
              + Sleva 30 % pro prvních 10 přihlášených
            </p>

            <div>
              <a
                href="#kontakt"
                className="inline-block bg-dark hover:bg-brown text-white font-bold px-8 py-4 rounded-full transition-colors text-lg"
              >
                Chci přihlásit dítě
              </a>
            </div>
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

            {/* Hiring banner */}
            <div className="bg-white border-2 border-forest rounded-2xl p-6 sm:p-8 mb-10 text-center">
              <div className="inline-block bg-forest/10 text-forest font-bold text-sm px-4 py-1.5 rounded-full mb-4">
                Hledáme do týmu
              </div>
              <h3 className="text-2xl font-bold text-dark mb-3">
                Průvodce / Průvodkyně
              </h3>
              <p className="text-brown max-w-xl mx-auto leading-relaxed mb-4">
                Hledáme ještě jednoho průvodce nebo průvodkyni pro náš vzdělávací klub.
                Pokud máte zkušenosti s prací s dětmi, sdílíte naše hodnoty a baví vás
                provázet děti na cestě za poznáním — ozvěte se nám. Rádi se s vámi
                potkáme.
              </p>
              <p className="text-sm text-brown-light">
                Využijte formulář níže — v sekci „Mám zájem o" vyberte <strong>Průvodcování / Mentoring</strong> a přiložte své CV v PDF.
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
                      <span className="text-brown-light text-sm">ředitel{" "}
                        <a
                          href="https://doucse.cz"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-forest hover:underline"
                        >
                          Vzdělávacího centra Doučse z.s.
                        </a>
                      </span>
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
