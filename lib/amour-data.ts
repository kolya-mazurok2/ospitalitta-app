import type { MenuSection, VenueMenuData } from './menu-data'

// ---------------------------------------------------------------------------
// Amour Pasticeri — Durrës, Plazh. Prices in Albanian Lek (ALL / L).
// Source: owner CSV + fridge photos, parsed 2026-07-26. en seeded; sq/it additive.
// Dessert items share the engraving placeholder until real photos arrive.
// ---------------------------------------------------------------------------

const PH = '/venue-assets/amour/dessert-placeholder.png'

// ── DRINKS ── (sections → left category tab) ────────────────────────────────

const coffee: MenuSection = {
  key: 'hot-drinks',
  type: 'cocktail',
  i18n: {
    en: { label: 'Coffee & Hot', note: 'We serve espresso and americano with water.' },
    sq: { label: 'Kafe' },
    it: { label: 'Caffè' },
    uk: { label: 'Кава' },
  },
  items: [
    { id: 'cappuccino',     slug: 'cappuccino',     price: 'L150', posterSrc: '/venue-assets/amour/cappuccino.jpg',
      i18n: { en: { name: 'Cappuccino',     desc: 'Equal parts espresso, steamed milk, foam.' } } },
    { id: 'macchiato',      slug: 'macchiato',      price: 'L90', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Macchiato',      desc: 'Espresso with a dash of foamed milk. Large L150.' } } },
    { id: 'espresso',       slug: 'espresso',       price: 'L80', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Espresso',       desc: 'Short, strong, the classic.' } } },
    { id: 'americano',      slug: 'americano',      price: 'L90', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Americano',      desc: 'Espresso stretched with hot water.' } } },
    { id: 'ice-coffee',     slug: 'ice-coffee',     price: 'L150', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Ice Coffee',     desc: 'Chilled coffee over ice.' } } },
    { id: 'hot-chocolate',  slug: 'hot-chocolate',  price: 'L150', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Hot Chocolate',  desc: 'Rich and warming.' } } },
    { id: 'cold-chocolate', slug: 'cold-chocolate', price: 'L150', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Cold Chocolate', desc: 'Cold chocolate drink over ice.' } } },
    { id: 'nescafe',        slug: 'nescafe',        price: 'L150', posterSrc: '/venue-assets/amour/coffee-placeholder.png',
      i18n: { en: { name: 'Nescafé',        desc: 'Instant coffee, hot.' } } },
  ],
}

const drinks: MenuSection = {
  key: 'soft-drinks',
  type: 'cocktail',
  i18n: {
    en: { label: 'Drinks' },
    sq: { label: 'Pije' },
    it: { label: 'Bibite' },
    uk: { label: 'Напої' },
  },
  items: [
    { id: 'red-bull',        slug: 'red-bull',        price: 'L200',
      i18n: { en: { name: 'Red Bull',                 desc: 'Energy drink.' } } },
    { id: 'glina-vitamina', slug: 'glina-vitamina', price: 'L100',
      variants: [{ label: 'Harmony', price: 'L100' }, { label: 'Immunity', price: 'L100' }],
      i18n: { en: { name: 'Glina Vitamina', desc: 'Vitamin water, apple and aloe vera or orange.' } } },
    { id: 'sparkling-water', slug: 'sparkling-water', price: 'L70',
      i18n: { en: { name: 'Sparkling Water',          desc: 'Natural sparkling water.' } } },
    { id: 'glina-still',     slug: 'glina-still',     price: 'L150',
      i18n: { en: { name: 'Glina Still Water',        desc: 'Natural mineral water.' } } },
    { id: 'spring-still',    slug: 'spring-still',    price: 'L150',
      i18n: { en: { name: 'Spring Water',             desc: 'Oligomineral still water.' } } },
    { id: 'bravo', slug: 'bravo', price: 'L150',
      variants: [{ label: 'Peach', price: 'L150' }, { label: 'Red Grape', price: 'L150' }, { label: 'Green Apple', price: 'L150' }],
      i18n: { en: { name: 'Bravo', desc: 'Fruit juice.' } } },
    { id: 'fanta', slug: 'fanta', price: 'L150',
      variants: [{ label: 'Orange', price: 'L150' }, { label: 'Exotic', price: 'L150' }],
      i18n: { en: { name: 'Fanta', desc: 'Fruit soda.' } } },
    { id: 'pepsi',           slug: 'pepsi',           price: 'L150',
      i18n: { en: { name: 'Pepsi',                    desc: 'Cola.' } } },
    { id: 'lemon-soda',      slug: 'lemon-soda',      price: 'L150',
      i18n: { en: { name: 'Lemon Soda',               desc: 'Italian lemon soda (Crodo).' } } },
    { id: 'ivi', slug: 'ivi', price: 'L150',
      variants: [{ label: 'Limon', price: 'L150' }, { label: 'Ricoco', price: 'L150' }],
      i18n: { en: { name: 'ivi', desc: 'Sparkling soda.' } } },
    { id: 'coccodrillo-bitter', slug: 'coccodrillo-bitter', price: 'L150',
      i18n: { en: { name: 'Coccodrillo Bitter',       desc: 'Non-alcoholic bitter aperitif.' } } },
    { id: 'lipton', slug: 'lipton', price: 'L150',
      variants: [{ label: 'Lemon', price: 'L150' }, { label: 'Peach', price: 'L150' }],
      i18n: { en: { name: 'Lipton Ice Tea', desc: 'Chilled iced tea.' } } },
    { id: 'energy-852',      slug: 'energy-852',      price: 'L150',
      i18n: { en: { name: '852 Energy',               desc: 'Energy drink.' } } },
    { id: 'anna-iced-coffee', slug: 'anna-iced-coffee', price: 'L150',
      i18n: { en: { name: 'anna Iced Coffee',         desc: 'Cold coffee drink with milk, cappuccino.' } } },
    { id: 'lufra-dhalle',    slug: 'lufra-dhalle',    price: 'L150',
      i18n: { en: { name: 'Lufra Dhallë',             desc: 'Traditional salted yogurt drink (ayran).' } } },
  ],
}

// ── FOOD ── (foodSections → right category tab) ─────────────────────────────

const desserts: MenuSection = {
  key: 'pastries',
  type: 'food',
  i18n: {
    en: { label: 'Desserts', note: "If you haven't finished your dessert, we'll gladly pack it to go. Enjoy!" },
    sq: { label: 'Ëmbëlsira' },
    it: { label: 'Dolci' },
    uk: { label: 'Десерти' },
  },
  items: [
    // Order = menu-engineering: hook first, top-price champion in slot 2,
    // premiums high, cheap buried, a premium closes the last sweet spot.
    { id: 'trilece',     slug: 'trilece',     price: 'L150', posterSrc: '/venue-assets/amour/trilece.jpg',
      i18n: { en: { name: 'Trileçe',      desc: 'Very sweet. Milk, heavy cream, caramel cake.' } } },
    { id: 'cheesecake',  slug: 'cheesecake',  price: 'L350', posterSrc: '/venue-assets/amour/cheesecake.jpg', videoSrc: '/venue-assets/amour/cheesecake.mp4',
      i18n: { en: { name: 'Cheesecake',   desc: 'Medium sweet. Forest berries.' } } },
    { id: 'strawberry-d', slug: 'strawberry-d', price: 'L300', posterSrc: '/venue-assets/amour/strawberry-d.jpg',
      i18n: { en: { name: 'Strawberry',   desc: 'Medium sweet. Vanilla cream, strawberry.' } } },
    { id: 'millefeuille', slug: 'millefeuille', price: 'L150', posterSrc: '/venue-assets/amour/millefeuille.jpg', badge: 'Best seller', house: true,
      i18n: { en: { name: 'Millefeuille', desc: 'Medium sweet. Puff pastry, vanilla cream.' } } },
    { id: 'apple',       slug: 'apple',       price: 'L300', posterSrc: PH,
      i18n: { en: { name: 'Apple',        desc: 'Medium sweet. Vanilla cream, apple.' } } },
    { id: 'mango',       slug: 'mango',       price: 'L300', posterSrc: PH,
      i18n: { en: { name: 'Mango',        desc: 'Medium sweet. Vanilla cream, mango.' } } },
    { id: 'lotus',       slug: 'lotus',       price: 'L250', posterSrc: '/venue-assets/amour/lotus.jpg',
      i18n: { en: { name: 'Lotus',        desc: 'Medium sweet. Vanilla cream, chocolate, biscuit.' } } },
    { id: 'tiramisu',    slug: 'tiramisu',    price: 'L200', posterSrc: '/venue-assets/amour/tiramisu.jpg',
      i18n: { en: { name: 'Tiramisu Cacao', desc: 'Medium sweet. Biscuit, mascarpone, cacao.' } } },
    { id: 'sacher',      slug: 'sacher',      price: 'L200', posterSrc: '/venue-assets/amour/sacher.jpg',
      i18n: { en: { name: 'Sacher',       desc: 'Medium sweet. Apricot jam, chocolate.' } } },
    { id: 'ferrero',     slug: 'ferrero',     price: 'L200', posterSrc: PH,
      i18n: { en: { name: 'Ferrero',      desc: 'Very sweet. Nuts, chocolate, vanilla cream.' } } },
    { id: 'raffaello',   slug: 'raffaello',   price: 'L200', posterSrc: '/venue-assets/amour/raffaello.jpg',
      i18n: { en: { name: 'Raffaello',    desc: 'Medium sweet. Sponge cake, vanilla cream, Raffaello.' } } },
    { id: 'red-velvet',  slug: 'red-velvet',  price: 'L200', posterSrc: PH,
      i18n: { en: { name: 'Red Velvet',   desc: 'Medium sweet. Red sponge cake, cherry cream.' } } },
    { id: 'mousse',      slug: 'mousse',      price: 'L200', posterSrc: PH,
      i18n: { en: { name: 'Mousse',       desc: 'Medium sweet. Chocolate, vanilla cream.' } } },
    { id: 'snickers',    slug: 'snickers',    price: 'L200', posterSrc: '/venue-assets/amour/snickers.jpg',
      i18n: { en: { name: 'Snickers',     desc: 'Very sweet. Snickers and chocolate flavour.' } } },
    { id: 'panna-cotta', slug: 'panna-cotta', price: 'L200', posterSrc: '/venue-assets/amour/panna-cotta.jpg',
      i18n: { en: { name: 'Panna Cotta',  desc: 'Lightly sweet. Milk and forest fruit.' } } },
    { id: 'forest-fruits', slug: 'forest-fruits', price: 'L180', posterSrc: PH,
      i18n: { en: { name: 'Forest Fruits', desc: 'Medium sweet. Vanilla cream, sponge cake, forest fruits.' } } },
    { id: 'pastasciutta', slug: 'pastasciutta', price: 'L100', posterSrc: '/venue-assets/amour/pasta-choc.jpg',
      variants: [
        { label: 'Chocolate', price: 'L150', posterSrc: '/venue-assets/amour/pasta-choc.jpg' },
        { label: 'Caramel',   price: 'L100', posterSrc: '/venue-assets/amour/pasta-caramel.jpg' },
        { label: 'Pistachio', price: 'L150', posterSrc: '/venue-assets/amour/dessert-placeholder.png' },
      ],
      i18n: { en: { name: 'Pastasciutta', desc: 'Choux pastry with vanilla cream.' } } },
    { id: 'raffaello-paste', slug: 'raffaello-paste', price: 'L200', posterSrc: PH,
      i18n: { en: { name: 'Raffaello Paste', desc: 'Medium sweet. Sponge cake, vanilla cream, Raffaello.' } } },
    { id: 'pistachio',   slug: 'pistachio',   price: 'L300', posterSrc: '/venue-assets/amour/pistachio.jpg',
      i18n: { en: { name: 'Pistachio',    desc: 'Medium sweet. Pistachio, vanilla cream.' } } },
  ],
}

const cakes: MenuSection = {
  key: 'cakes',
  type: 'food',
  i18n: {
    en: { label: 'Cakes', note: 'Our cakes come in two sizes, M and L. Sizes vary from cake to cake, so ask us about each one.' },
    sq: { label: 'Torte' },
    it: { label: 'Torte' },
    uk: { label: 'Торти' },
  },
  items: [
    { id: 'cake-me-peta',    slug: 'cake-me-peta',    price: 'L1000', posterSrc: '/venue-assets/amour/cake-me-peta.jpg',
      sizes: [{ label: 'M', price: 'L1000' }, { label: 'L', price: 'L1200' }],
      i18n: { en: { name: 'Me Peta',    desc: 'Medium sweet. Layers, vanilla cream, sponge cake, forest fruits.' } } },
    { id: 'cake-chocolate',  slug: 'cake-chocolate',  price: 'L1200', posterSrc: '/venue-assets/amour/cake-chocolate.jpg',
      sizes: [{ label: 'M', price: 'L1200' }, { label: 'L', price: 'L1500' }],
      i18n: { en: { name: 'Chocolate', desc: 'Sponge cake, chocolate cream filling, chocolate coating.' } } },
    { id: 'cake-caramel',    slug: 'cake-caramel',    price: 'L1000', posterSrc: '/venue-assets/amour/cake-caramel.jpg',
      sizes: [{ label: 'M', price: 'L1000' }, { label: 'L', price: 'L1200' }],
      i18n: { en: { name: 'Caramel',    desc: 'Very sweet. Sponge cake, caramel cream, vanilla cream.' } } },
    { id: 'cake-berries',    slug: 'cake-berries',    price: 'L1000', posterSrc: '/venue-assets/amour/cake-berries.jpg',
      sizes: [{ label: 'M', price: 'L1000' }, { label: 'L', price: 'L1200' }],
      i18n: { en: { name: 'Berries',    desc: 'Sponge cake, vanilla cream, forest-fruit flavour, berries on top, slightly tart.' } } },
    { id: 'cake-strawberry', slug: 'cake-strawberry', price: 'L1000', posterSrc: '/venue-assets/amour/cake-strawberry.jpg',
      sizes: [{ label: 'M', price: 'L1000' }, { label: 'L', price: 'L1200' }],
      i18n: { en: { name: 'Strawberry', desc: 'Medium sweet. Sponge cake, strawberry vanilla cream, strawberries on top.' } } },
    { id: 'cake-raffaello',  slug: 'cake-raffaello',  price: 'L1000', posterSrc: '/venue-assets/amour/cake-raffaello.jpg',
      sizes: [{ label: 'M', price: 'L1000' }, { label: 'L', price: 'L1200' }],
      i18n: { en: { name: 'Raffaello',  desc: 'Medium sweet. Sponge cake, vanilla cream, touch of chocolate, Raffaello.' } } },
  ],
}

const savory: MenuSection = {
  key: 'savory',
  type: 'food',
  i18n: {
    en: { label: 'Savory' },
    sq: { label: 'Të kripura' },
    it: { label: 'Salati' },
    uk: { label: 'Солоне' },
  },
  items: [
    { id: 'sandwich',   slug: 'sandwich',   price: 'L150',
      i18n: { en: { name: 'Sandwich',   desc: 'Salami, tomato.' } } },
    { id: 'meat-byrek', slug: 'meat-byrek', price: 'L100',
      i18n: { en: { name: 'Meat Byrek', desc: 'Savory filled pastry.' } } },
    { id: 'byrek-veg',  slug: 'byrek-veg',  price: 'L80',
      i18n: { en: { name: 'Byrek',      desc: 'Spinach, potato, cheese, tomato.' } } },
  ],
}

// ---------------------------------------------------------------------------

export const amourMenuData: VenueMenuData = {
  sections: [coffee, drinks],
  foodSections: [desserts, cakes, savory],
  pairings: [],
  foodPairings: [],
  featuredPick: { cocktailRef: '' },
}
