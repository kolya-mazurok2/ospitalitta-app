import type { MenuSection, VenueMenuData, PlaceholderKind, FoodPairing, Pairing } from './menu-data'
import { applyPlaceholders, applyCoffeeTastes } from './menu-data'

// ---------------------------------------------------------------------------
// Amour Pasticeri — Durrës, Plazh. Prices in Albanian Lek (ALL / L).
// Source: owner CSV + fridge photos, parsed 2026-07-26. en seeded; sq/it additive.
// Dessert items share the engraving placeholder until real photos arrive.
// ---------------------------------------------------------------------------

const PH = '/venue-assets/amour/dessert-placeholder.png'
const COFFEE_PH = '/venue-assets/amour/coffee-placeholder.png'
const COFFEE_WATER_PH = '/venue-assets/amour/coffee-water-placeholder.png'
const FRUIT_PH = '/venue-assets/amour/fruit-placeholder.png'
const CAKE_SLICE_PH = '/venue-assets/amour/cake-slice-placeholder.png'

// Placeholder illustration per kind — filled into items via applyPlaceholders() below.
// Real photo always wins; only items with no photo fall back to these by their `ph`.
const PLACEHOLDERS: Partial<Record<PlaceholderKind, string>> = {
  coffee: COFFEE_PH,               // plain cup — most hot drinks
  'coffee-water': COFFEE_WATER_PH, // cup + water — espresso & americano only
  fruit: FRUIT_PH,  // apple engraving — generic fruit-dessert placeholder
  'cake-slice': CAKE_SLICE_PH, // berry-glaze slice engraving
  eclair: PH,       // [TODO] eclair engraving
  dessert: PH,
  drink: PH,        // [TODO] drink engraving
}

// ── DRINKS ── (sections → left category tab) ────────────────────────────────

const coffee: MenuSection = {
  key: 'hot-drinks',
  type: 'cocktail',
  i18n: {
    en: { label: 'Coffee', note: 'We serve espresso and americano with water.' },
    sq: { label: 'Kafe',   note: 'Espresson dhe amerikanon i shërbejmë me ujë.' },
    it: { label: 'Caffè',  note: 'Serviamo espresso e americano con acqua.' },
    pl: { label: 'Kawa',   note: 'Espresso i americano podajemy z wodą.' },
    uk: { label: 'Кава',   note: 'Еспресо й американо подаємо з водою.' },
    de: { label: 'Kaffee', note: 'Espresso und Americano servieren wir mit Wasser.' },
    fr: { label: 'Café',   note: "Nous servons l'espresso et l'americano avec de l'eau." },
    no: { label: 'Kaffe',  note: 'Vi serverer espresso og americano med vann.' },
  },
  items: [
    { id: 'cappuccino',     slug: 'cappuccino',     price: '150', posterSrc: '/venue-assets/amour/cappuccino.jpg', coffee: 'cappuccino',
      i18n: {
        en: { name: 'Cappuccino', desc: 'Espresso, steamed milk and foam, one third each.' },
        sq: { name: 'Cappuccino', desc: 'Espresso, qumësht i avulluar dhe shkumë, nga një e treta secila.' },
        it: { name: 'Cappuccino', desc: 'Espresso, latte montato e schiuma, un terzo ciascuno.' },
        pl: { name: 'Cappuccino', desc: 'Espresso, spienione mleko i pianka, po jednej trzeciej.' },
        uk: { name: 'Cappuccino', desc: 'Еспресо, парне молоко й піна, по третині кожного.' },
        de: { name: 'Cappuccino', desc: 'Espresso, aufgeschäumte Milch und Schaum, je ein Drittel.' },
        fr: { name: 'Cappuccino', desc: 'Espresso, lait vapeur et mousse, un tiers chacun.' },
        no: { name: 'Cappuccino', desc: 'Espresso, dampet melk og skum, en tredjedel av hver.' },
      } },
    { id: 'espresso',       slug: 'espresso',       price: '80', ph: 'coffee-water', coffee: 'espresso',
      i18n: {
        en: { name: 'Espresso', desc: '30 ml, brewed under high pressure.', note: 'Served with a glass of water.' },
        sq: { name: 'Espresso', desc: '30 ml, i përgatitur nën presion të lartë.', note: 'Shërbehet me një gotë ujë.' },
        it: { name: 'Espresso', desc: '30 ml, estratto ad alta pressione.', note: "Servito con un bicchiere d'acqua." },
        pl: { name: 'Espresso', desc: '30 ml, parzone pod wysokim ciśnieniem.', note: 'Podawane ze szklanką wody.' },
        uk: { name: 'Espresso', desc: '30 мл, приготоване під високим тиском.', note: 'Подається зі склянкою води.' },
        de: { name: 'Espresso', desc: '30 ml, unter hohem Druck gebrüht.', note: 'Wird mit einem Glas Wasser serviert.' },
        fr: { name: 'Espresso', desc: '30 ml, extrait sous haute pression.', note: "Servi avec un verre d'eau." },
        no: { name: 'Espresso', desc: '30 ml, brygget under høyt trykk.', note: 'Serveres med et glass vann.' },
      } },
    { id: 'americano',      slug: 'americano',      price: '90', posterSrc: '/venue-assets/amour/americano.png', coffee: 'americano',
      i18n: {
        en: { name: 'Americano', desc: 'Espresso topped up with hot water.', note: 'Served with a glass of water.' },
        sq: { name: 'Americano', desc: 'Espresso i mbushur me ujë të nxehtë.', note: 'Shërbehet me një gotë ujë.' },
        it: { name: 'Americano', desc: 'Espresso allungato con acqua calda.', note: "Servito con un bicchiere d'acqua." },
        pl: { name: 'Americano', desc: 'Espresso dopełnione gorącą wodą.', note: 'Podawane ze szklanką wody.' },
        uk: { name: 'Americano', desc: 'Еспресо, доповнене гарячою водою.', note: 'Подається зі склянкою води.' },
        de: { name: 'Americano', desc: 'Espresso mit heißem Wasser aufgefüllt.', note: 'Wird mit einem Glas Wasser serviert.' },
        fr: { name: 'Americano', desc: "Espresso allongé à l'eau chaude.", note: "Servi avec un verre d'eau." },
        no: { name: 'Americano', desc: 'Espresso fylt opp med varmt vann.', note: 'Serveres med et glass vann.' },
      } },
    { id: 'ice-coffee',     slug: 'ice-coffee',     price: '150', ph: 'coffee', coffee: 'ice-coffee',
      i18n: {
        en: { name: 'Ice Coffee', desc: 'Espresso poured over ice.' },
        sq: { name: 'Ice Coffee', desc: 'Espresso i derdhur mbi akull.' },
        it: { name: 'Ice Coffee', desc: 'Espresso versato sul ghiaccio.' },
        pl: { name: 'Ice Coffee', desc: 'Espresso zalane lodem.' },
        uk: { name: 'Ice Coffee', desc: 'Еспресо, залите на лід.' },
        de: { name: 'Ice Coffee', desc: 'Espresso über Eis gegossen.' },
        fr: { name: 'Ice Coffee', desc: 'Espresso versé sur de la glace.' },
        no: { name: 'Ice Coffee', desc: 'Espresso helt over is.' },
      } },
    { id: 'macchiato',      slug: 'macchiato',      price: '90', ph: 'coffee', coffee: 'macchiato',
      sizes: [{ label: 'S', price: '90' }, { label: 'M', price: '150' }],
      i18n: {
        en: { name: 'Macchiato', desc: 'Espresso marked with a spoonful of milk foam.' },
        sq: { name: 'Macchiato', desc: 'Espresso i shënuar me një lugë shkumë qumështi.' },
        it: { name: 'Macchiato', desc: 'Espresso macchiato con un cucchiaio di schiuma di latte.' },
        pl: { name: 'Macchiato', desc: 'Espresso z łyżką mlecznej pianki.' },
        uk: { name: 'Macchiato', desc: 'Еспресо з ложкою молочної піни.' },
        de: { name: 'Macchiato', desc: 'Espresso mit einem Löffel Milchschaum.' },
        fr: { name: 'Macchiato', desc: "Espresso taché d'une cuillère de mousse de lait." },
        no: { name: 'Macchiato', desc: 'Espresso med en skje melkeskum.' },
      } },
    { id: 'hot-chocolate',  slug: 'hot-chocolate',  price: '150', ph: 'coffee', coffee: 'hot-chocolate',
      i18n: {
        en: { name: 'Hot Chocolate',  desc: 'Melted chocolate with milk.' },
        sq: { name: 'Hot Chocolate',  desc: 'Çokollatë e shkrirë me qumësht.' },
        it: { name: 'Hot Chocolate',  desc: 'Cioccolato fuso con latte.' },
        pl: { name: 'Hot Chocolate',  desc: 'Roztopiona czekolada z mlekiem.' },
        uk: { name: 'Hot Chocolate', desc: 'Розтоплений шоколад з молоком.' },
        de: { name: 'Hot Chocolate',  desc: 'Geschmolzene Schokolade mit Milch.' },
        fr: { name: 'Hot Chocolate',  desc: 'Chocolat fondu au lait.' },
        no: { name: 'Hot Chocolate',  desc: 'Smeltet sjokolade med melk.' },
      } },
    { id: 'cold-chocolate', slug: 'cold-chocolate', price: '150', ph: 'coffee', coffee: 'cold-chocolate',
      i18n: {
        en: { name: 'Cold Chocolate',  desc: 'Cold chocolate with milk, over ice.' },
        sq: { name: 'Cold Chocolate',  desc: 'Çokollatë e ftohtë me qumësht, mbi akull.' },
        it: { name: 'Cold Chocolate',  desc: 'Cioccolato freddo con latte, sul ghiaccio.' },
        pl: { name: 'Cold Chocolate',  desc: 'Zimna czekolada z mlekiem, z lodem.' },
        uk: { name: 'Cold Chocolate', desc: 'Холодний шоколад з молоком, на льоду.' },
        de: { name: 'Cold Chocolate',  desc: 'Kalte Schokolade mit Milch, auf Eis.' },
        fr: { name: 'Cold Chocolate',  desc: 'Chocolat froid au lait, sur glace.' },
        no: { name: 'Cold Chocolate',  desc: 'Kald sjokolade med melk, på is.' },
      } },
    { id: 'nescafe',        slug: 'nescafe',        price: '150', ph: 'coffee', coffee: 'nescafe',
      i18n: {
        en: { name: 'Nescafé', desc: 'Instant coffee.' },
        sq: { name: 'Nescafé', desc: 'Kafe e çastit.' },
        it: { name: 'Nescafé', desc: 'Caffè solubile.' },
        pl: { name: 'Nescafé', desc: 'Kawa rozpuszczalna.' },
        uk: { name: 'Nescafé', desc: 'Розчинна кава.' },
        de: { name: 'Nescafé', desc: 'Löslicher Kaffee.' },
        fr: { name: 'Nescafé', desc: 'Café soluble.' },
        no: { name: 'Nescafé', desc: 'Pulverkaffe.' },
      } },
  ],
}

const drinks: MenuSection = {
  key: 'soft-drinks',
  type: 'cocktail',
  views: ['list'],
  i18n: {
    en: { label: 'Drinks' },
    sq: { label: 'Pije' },
    it: { label: 'Bibite' },
    pl: { label: 'Napoje' },
    uk: { label: 'Напої' },
    de: { label: 'Getränke' },
    fr: { label: 'Boissons' },
    no: { label: 'Drikke' },
  },
  items: [
    { id: 'red-bull',        slug: 'red-bull',        price: '200',
      i18n: { en: { name: 'Red Bull',                 desc: 'Energy drink.' } } },
    { id: 'glina-vitamina', slug: 'glina-vitamina', price: '100',
      variants: [{ label: 'Harmony', price: '100' }, { label: 'Immunity', price: '100' }],
      i18n: { en: { name: 'Glina Vitamina', desc: 'Vitamin water, apple and aloe vera or orange.' } } },
    { id: 'sparkling-water', slug: 'sparkling-water', price: '70',
      i18n: { en: { name: 'Sparkling Water',          desc: 'Natural sparkling water.' } } },
    { id: 'glina-still',     slug: 'glina-still',     price: '150',
      i18n: { en: { name: 'Glina Still Water',        desc: 'Natural mineral water.' } } },
    { id: 'spring-still',    slug: 'spring-still',    price: '150',
      i18n: { en: { name: 'Spring Water',             desc: 'Oligomineral still water.' } } },
    { id: 'bravo', slug: 'bravo', price: '150',
      variants: [{ label: 'Peach', price: '150' }, { label: 'Red Grape', price: '150' }, { label: 'Green Apple', price: '150' }],
      i18n: { en: { name: 'Bravo', desc: 'Fruit juice.' } } },
    { id: 'fanta', slug: 'fanta', price: '150',
      variants: [{ label: 'Orange', price: '150' }, { label: 'Exotic', price: '150' }],
      i18n: { en: { name: 'Fanta', desc: 'Fruit soda.' } } },
    { id: 'pepsi',           slug: 'pepsi',           price: '150',
      i18n: { en: { name: 'Pepsi',                    desc: 'Cola.' } } },
    { id: 'lemon-soda',      slug: 'lemon-soda',      price: '150',
      i18n: { en: { name: 'Lemon Soda',               desc: 'Italian lemon soda (Crodo).' } } },
    { id: 'ivi', slug: 'ivi', price: '150',
      variants: [{ label: 'Limon', price: '150' }, { label: 'Ricoco', price: '150' }],
      i18n: { en: { name: 'ivi', desc: 'Sparkling soda.' } } },
    { id: 'coccodrillo-bitter', slug: 'coccodrillo-bitter', price: '150',
      i18n: { en: { name: 'Coccodrillo Bitter',       desc: 'Non-alcoholic bitter aperitif.' } } },
    { id: 'lipton', slug: 'lipton', price: '150',
      variants: [{ label: 'Lemon', price: '150' }, { label: 'Peach', price: '150' }],
      i18n: { en: { name: 'Lipton Ice Tea', desc: 'Chilled iced tea.' } } },
    { id: 'energy-852',      slug: 'energy-852',      price: '150',
      i18n: { en: { name: 'B52',                      desc: 'Energy drink.' } } },
    { id: 'anna-iced-coffee', slug: 'anna-iced-coffee', price: '150',
      i18n: { en: { name: 'Iced Coffee',              desc: 'Cold coffee drink with milk, cappuccino.' } } },
    { id: 'lufra-dhalle',    slug: 'lufra-dhalle',    price: '150',
      i18n: { en: { name: 'Lufra Dhallë',             desc: 'Traditional salted yogurt drink (ayran).' } } },
  ],
}

// ── FOOD ── (foodSections → right category tab) ─────────────────────────────

const desserts: MenuSection = {
  key: 'pastries',
  type: 'food',
  i18n: {
    en: { label: 'Desserts',  note: "If you haven't finished your dessert, we'll gladly pack it to go. Enjoy!" },
    sq: { label: 'Ëmbëlsira', note: 'Nëse nuk e mbaroni ëmbëlsirën, me kënaqësi jua paketojmë për ta marrë me vete. Shijoni!' },
    it: { label: 'Dolci',     note: 'Se non finisci il dolce, te lo incartiamo volentieri da portare via. Buon appetito!' },
    pl: { label: 'Desery',    note: 'Jeśli nie dokończysz deseru, chętnie zapakujemy go na wynos. Smacznego!' },
    uk: { label: 'Десерти',   note: 'Якщо не доїли десерт, залюбки спакуємо з собою. Смачного!' },
    de: { label: 'Desserts',  note: 'Wenn du dein Dessert nicht schaffst, packen wir es dir gerne zum Mitnehmen ein. Guten Appetit!' },
    fr: { label: 'Desserts',  note: "Si vous ne finissez pas votre dessert, nous vous l'emballons volontiers à emporter. Bon appétit !" },
    no: { label: 'Desserter', note: 'Hvis du ikke blir ferdig med desserten, pakker vi den gjerne til deg. Vel bekomme!' },
  },
  items: [
    // Order = menu-engineering: hook first, top-price champion in slot 2,
    // premiums high, cheap buried, a premium closes the last sweet spot.
    { id: 'trilece',     slug: 'trilece',     price: '150', posterSrc: '/venue-assets/amour/trilece.jpg',
      i18n: { en: { name: 'Trileçe',      desc: 'Very sweet. Milk, heavy cream, caramel cake.' } } },
    { id: 'cheesecake',  slug: 'cheesecake',  price: '350', posterSrc: '/venue-assets/amour/cheesecake.jpg', videoSrc: '/venue-assets/amour/cheesecake.mp4',
      i18n: { en: { name: 'Cheesecake',   desc: 'Medium sweet. Forest berries.' } } },
    { id: 'pastasciutta', slug: 'pastasciutta', price: '100', posterSrc: '/venue-assets/amour/pasta-choc.jpg',
      variants: [
        { label: 'Chocolate', price: '150', posterSrc: '/venue-assets/amour/pasta-choc.jpg' },
        { label: 'Caramel',   price: '100', posterSrc: '/venue-assets/amour/pasta-caramel.jpg' },
        { label: 'Pistachio', price: '150', posterSrc: '/venue-assets/amour/pasta-pistachio.jpg' },
      ],
      i18n: { en: { name: 'Pastasciutta', desc: 'Medium sweet. Choux pastry with vanilla cream.' } } },
    { id: 'strawberry-d', slug: 'strawberry-d', price: '300', posterSrc: '/venue-assets/amour/strawberry-d.jpg',
      i18n: { en: { name: 'Strawberry',   desc: 'Medium sweet. Vanilla cream with strawberry pieces inside.' } } },
    { id: 'millefeuille', slug: 'millefeuille', price: '150', posterSrc: '/venue-assets/amour/millefeuille.jpg', badge: 'Best seller', house: true,
      i18n: { en: { name: 'Millefeuille', desc: 'Medium sweet. Puff pastry, vanilla cream.' } } },
    { id: 'apple',       slug: 'apple',       price: '300', ph: 'fruit',
      i18n: { en: { name: 'Apple',        desc: 'Medium sweet. Vanilla cream with apple pieces inside.' } } },
    { id: 'mango',       slug: 'mango',       price: '300', ph: 'fruit',
      i18n: { en: { name: 'Mango',        desc: 'Medium sweet. Vanilla cream with mango pieces inside.' } } },
    { id: 'lotus',       slug: 'lotus',       price: '250', posterSrc: '/venue-assets/amour/lotus.jpg',
      i18n: { en: { name: 'Lotus',        desc: 'Medium sweet. Vanilla cream, chocolate, biscuit.' } } },
    { id: 'tiramisu',    slug: 'tiramisu',    price: '200', posterSrc: '/venue-assets/amour/tiramisu.jpg',
      i18n: { en: { name: 'Tiramisu Cacao', desc: 'Medium sweet. Biscuit, mascarpone, cacao.' } } },
    { id: 'sacher',      slug: 'sacher',      price: '200', posterSrc: '/venue-assets/amour/sacher.jpg',
      i18n: { en: { name: 'Sacher',       desc: 'Medium sweet. Apricot jam, chocolate.' } } },
    { id: 'ferrero',     slug: 'ferrero',     price: '200', ph: 'cake-slice',
      i18n: { en: { name: 'Ferrero',      desc: 'Very sweet. Nuts, chocolate, vanilla cream.' } } },
    { id: 'raffaello',   slug: 'raffaello',   price: '200', posterSrc: '/venue-assets/amour/raffaello.jpg',
      i18n: { en: { name: 'Raffaello',    desc: 'Medium sweet. Sponge cake, vanilla cream, Raffaello.' } } },
    { id: 'red-velvet',  slug: 'red-velvet',  price: '200', ph: 'cake-slice',
      i18n: { en: { name: 'Red Velvet',   desc: 'Medium sweet. Red sponge cake, cherry cream.' } } },
    { id: 'mousse',      slug: 'mousse',      price: '200', ph: 'cake-slice',
      i18n: { en: { name: 'Mousse',       desc: 'Medium sweet. Chocolate, vanilla cream.' } } },
    { id: 'snickers',    slug: 'snickers',    price: '200', posterSrc: '/venue-assets/amour/snickers.jpg',
      i18n: { en: { name: 'Snickers',     desc: 'Very sweet. Snickers and chocolate flavour.' } } },
    { id: 'panna-cotta', slug: 'panna-cotta', price: '200', posterSrc: '/venue-assets/amour/panna-cotta.jpg',
      i18n: { en: { name: 'Panna Cotta',  desc: 'Lightly sweet. Milk and forest fruit.' } } },
    { id: 'forest-fruits', slug: 'forest-fruits', price: '180', ph: 'dessert',
      i18n: { en: { name: 'Forest Fruits', desc: 'Medium sweet. Sponge cake and vanilla cream with forest-fruit pieces inside.' } } },
    { id: 'raffaello-paste', slug: 'raffaello-paste', price: '200', ph: 'dessert',
      i18n: { en: { name: 'Raffaello Paste', desc: 'Medium sweet. Sponge cake, vanilla cream, Raffaello.' } } },
    { id: 'pistachio',   slug: 'pistachio',   price: '300', posterSrc: '/venue-assets/amour/pistachio.jpg',
      i18n: { en: { name: 'Pistachio',    desc: 'Medium sweet. Pistachio, vanilla cream.' } } },
  ],
}

const cakes: MenuSection = {
  key: 'cakes',
  type: 'food',
  i18n: {
    en: { label: 'Cakes',  note: 'Our cakes come in two sizes, M and L. Sizes vary from cake to cake, so ask us about each one.' },
    sq: { label: 'Torte',  note: 'Tortat tona vijnë në dy madhësi, M dhe L. Madhësitë ndryshojnë nga torta në tortë, prandaj na pyesni për secilën.' },
    it: { label: 'Torte',  note: 'Le nostre torte sono in due misure, M e L. Le misure variano da torta a torta, quindi chiedeteci per ciascuna.' },
    pl: { label: 'Ciasta', note: 'Nasze ciasta są w dwóch rozmiarach, M i L. Rozmiary różnią się między ciastami, więc pytajcie o każde.' },
    uk: { label: 'Торти',  note: 'Наші торти у двох розмірах, M і L. Розміри різняться від торта до торта, тож питайте про кожен.' },
    de: { label: 'Kuchen', note: 'Unsere Kuchen gibt es in zwei Größen, M und L. Die Größen variieren je nach Kuchen, fragen Sie uns nach jedem.' },
    fr: { label: 'Gâteaux', note: "Nos gâteaux existent en deux tailles, M et L. Les tailles varient d'un gâteau à l'autre, demandez-nous pour chacun." },
    no: { label: 'Kaker',  note: 'Kakene våre finnes i to størrelser, M og L. Størrelsene varierer fra kake til kake, så spør oss om hver enkelt.' },
  },
  items: [
    { id: 'cake-me-peta',    slug: 'cake-me-peta',    price: '1000', posterSrc: '/venue-assets/amour/cake-me-peta.jpg',
      sizes: [{ label: 'M', price: '1000' }, { label: 'L', price: '1200' }],
      i18n: { en: { name: 'Me Peta',    desc: 'Medium sweet. Layers, vanilla cream, sponge cake, forest fruits.' } } },
    { id: 'cake-chocolate',  slug: 'cake-chocolate',  price: '1200', posterSrc: '/venue-assets/amour/cake-chocolate.jpg',
      sizes: [{ label: 'M', price: '1200' }, { label: 'L', price: '1500' }],
      i18n: { en: { name: 'Chocolate', desc: 'Medium sweet. Sponge cake, chocolate cream filling, chocolate coating.' } } },
    { id: 'cake-caramel',    slug: 'cake-caramel',    price: '1000', posterSrc: '/venue-assets/amour/cake-caramel.jpg',
      sizes: [{ label: 'M', price: '1000' }, { label: 'L', price: '1200' }],
      i18n: { en: { name: 'Caramel',    desc: 'Very sweet. Sponge cake, caramel cream, vanilla cream.' } } },
    { id: 'cake-berries',    slug: 'cake-berries',    price: '1000', posterSrc: '/venue-assets/amour/cake-berries.jpg',
      sizes: [{ label: 'M', price: '1000' }, { label: 'L', price: '1200' }],
      i18n: { en: { name: 'Berries',    desc: 'Medium sweet. Sponge cake, vanilla cream, forest-fruit flavour, berries on top, slightly tart.' } } },
    { id: 'cake-strawberry', slug: 'cake-strawberry', price: '1000', posterSrc: '/venue-assets/amour/cake-strawberry.jpg',
      sizes: [{ label: 'M', price: '1000' }, { label: 'L', price: '1200' }],
      i18n: { en: { name: 'Strawberry', desc: 'Medium sweet. Sponge cake, strawberry vanilla cream, strawberries on top.' } } },
    { id: 'cake-raffaello',  slug: 'cake-raffaello',  price: '1000', posterSrc: '/venue-assets/amour/cake-raffaello.jpg',
      sizes: [{ label: 'M', price: '1000' }, { label: 'L', price: '1200' }],
      i18n: { en: { name: 'Raffaello',  desc: 'Medium sweet. Sponge cake, vanilla cream, touch of chocolate, Raffaello.' } } },
  ],
}

const savory: MenuSection = {
  key: 'savory',
  type: 'food',
  views: ['list'],
  i18n: {
    en: { label: 'Snacks' },
    sq: { label: 'Të kripura' },
    it: { label: 'Salati' },
    pl: { label: 'Przekąski' },
    uk: { label: 'Солоне' },
    de: { label: 'Snacks' },
    fr: { label: 'En-cas' },
    no: { label: 'Snacks' },
  },
  items: [
    { id: 'sandwich',   slug: 'sandwich',   price: '150',
      i18n: { en: { name: 'Sandwich',   desc: 'Salami, tomato.' } } },
    { id: 'meat-byrek', slug: 'meat-byrek', price: '100',
      i18n: { en: { name: 'Meat Byrek', desc: 'Savory filled pastry.' } } },
    { id: 'byrek-veg',  slug: 'byrek-veg',  price: '80',
      i18n: { en: { name: 'Byrek',      desc: 'Spinach, potato, cheese, tomato.' } } },
  ],
}

// ---------------------------------------------------------------------------

// Dessert → coffee pairings. Rules + rationale live in docs/pairing-rules.md.
// Each dessert lists 3 coffees (best first); `why` is a translation-safe one-liner about coffee #1.
const dessertPairings: FoodPairing[] = [
  { dishRef: 'trilece',         cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the caramel.' } } },
  { dishRef: 'cheesecake',      cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk softens the sour berries.' } } },
  { dishRef: 'pastasciutta',    cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the cream.' } } },
  { dishRef: 'strawberry-d',    cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the cream.' } } },
  { dishRef: 'millefeuille',    cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the cream.' } } },
  { dishRef: 'apple',           cocktailRefs: ['americano', 'cappuccino', 'macchiato'],   i18n: { en: { why: 'Mild coffee suits the apple.' } } },
  { dishRef: 'mango',           cocktailRefs: ['ice-coffee', 'cappuccino', 'macchiato'],  i18n: { en: { why: 'Cold coffee suits the mango.' } } },
  { dishRef: 'lotus',           cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the caramel.' } } },
  { dishRef: 'tiramisu',        cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Espresso matches the cacao.' } } },
  { dishRef: 'sacher',          cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the chocolate.' } } },
  { dishRef: 'ferrero',         cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the sweetness.' } } },
  { dishRef: 'raffaello',       cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the coconut.' } } },
  { dishRef: 'red-velvet',      cocktailRefs: ['americano', 'cappuccino', 'macchiato'],   i18n: { en: { why: 'Mild coffee suits the cherry.' } } },
  { dishRef: 'mousse',          cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the chocolate.' } } },
  { dishRef: 'snickers',        cocktailRefs: ['espresso', 'americano', 'macchiato'],   i18n: { en: { why: 'Bitter cuts the sweetness.' } } },
  { dishRef: 'panna-cotta',     cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the cream.' } } },
  { dishRef: 'forest-fruits',   cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk softens the sour fruit.' } } },
  { dishRef: 'raffaello-paste', cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the coconut.' } } },
  { dishRef: 'pistachio',       cocktailRefs: ['cappuccino', 'macchiato', 'ice-coffee'], i18n: { en: { why: 'Milk matches the pistachio.' } } },
]

// Coffee → dessert pairings (reverse direction; shown on the coffee detail page).
// 3 desserts that best fit each coffee, best first; wisdom follows the same rules as dessert→coffee.
const coffeePairings: Pairing[] = [
  { cocktailRef: 'espresso',   dishes: [{ itemRef: 'tiramisu', price: '200' }, { itemRef: 'sacher', price: '200' }, { itemRef: 'mousse', price: '200' }],        i18n: { en: { wisdom: 'Bitter cuts the sweetness.' } } },
  { cocktailRef: 'americano',  dishes: [{ itemRef: 'trilece', price: '150' }, { itemRef: 'lotus', price: '250' }, { itemRef: 'ferrero', price: '200' }],           i18n: { en: { wisdom: 'Bitter cuts the sweetness.' } } },
  { cocktailRef: 'macchiato',  dishes: [{ itemRef: 'pastasciutta', price: '100' }, { itemRef: 'millefeuille', price: '150' }, { itemRef: 'pistachio', price: '300' }], i18n: { en: { wisdom: 'Milk matches the cream.' } } },
  { cocktailRef: 'cappuccino', dishes: [{ itemRef: 'cheesecake', price: '350' }, { itemRef: 'raffaello', price: '200' }, { itemRef: 'panna-cotta', price: '200' }],  i18n: { en: { wisdom: 'Milk matches the cream.' } } },
  { cocktailRef: 'ice-coffee', dishes: [{ itemRef: 'mango', price: '300' }, { itemRef: 'cheesecake', price: '350' }, { itemRef: 'strawberry-d', price: '300' }],     i18n: { en: { wisdom: 'Cold coffee suits fruit.' } } },
]

export const amourMenuData: VenueMenuData = applyCoffeeTastes(
  applyPlaceholders(
    {
      currency: 'L',
      sections: [coffee, drinks],
      foodSections: [desserts, cakes, savory],
      pairings: coffeePairings,
      foodPairings: dessertPairings,
      featuredPick: { cocktailRef: '' },
    },
    PLACEHOLDERS,
  ),
)
