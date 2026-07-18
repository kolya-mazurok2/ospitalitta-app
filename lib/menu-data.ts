/**
 * Canonical BB menu data — source until Supabase is wired.
 * All text fields wrapped in i18n. Only en seeded; sq/it added additively.
 * Lifted verbatim from BB Menu Mobile v2.dc.html and reshaped to DEC-010.
 */

export type GlassType = 'wine' | 'collins' | 'rocks' | 'martini' | 'coupe'
export type TasteKey = 'bitter' | 'sour' | 'sweet' | 'spicy' | 'zero'
export type TierKey  = 'tier-600' | 'tier-700' | 'tier-800' | 'tier-900' | 'tier-1000'
export type FoodKey  = 'pizza' | 'burgers' | 'sharing'
                     | 'cold' | 'warm' | 'salads' | 'pasta' | 'mains' | 'fresh-fish'
                     | 'hot-drinks' | 'cold-coffees' | 'soft-drinks' | 'bio-juices'
                     | 'beers' | 'wine' | 'cocktails'
                     | 'breakfast' | 'sandwiches' | 'small-plates'
                     | 'pastries' | 'waffles' | 'crepes' | 'ice-cream'

export const TASTE_KEYS: ReadonlySet<string> = new Set<TasteKey>(['bitter','sour','sweet','spicy','zero'])
export type Locale = string

export interface I18nText {
  [locale: string]: { name: string; desc: string }
}

export interface MenuItem {
  id: string
  slug: string
  price: string          // 'L500' — flat
  glass?: GlassType
  lvl?: 1 | 2 | 3       // intensity marks (bitter/sour/sweet)
  flavor?: 'sweet' | 'sour' // zero items only
  loved?: boolean
  house?: boolean
  badge?: string         // label pill: "For 2", "For sharing", etc.
  videoSrc?: string
  posterSrc?: string
  i18n: I18nText
}

export interface MenuSection {
  key: TasteKey | TierKey | FoodKey
  type: 'cocktail' | 'food'
  i18n: { [locale: string]: { label: string; sub?: string; badge?: string; note?: string } }
  items: MenuItem[]
}

export interface PairingDish {
  itemRef: string   // matches MenuItem.slug
  price: string
}

export interface Pairing {
  cocktailRef: string
  dishes: PairingDish[]
  i18n: { [locale: string]: { wisdom: string } }
}

export interface FoodPairing {
  dishRef: string
  cocktailRefs: string[]
  i18n: { [locale: string]: { why: string } }
}

export interface FeaturedPick {
  cocktailRef: string
  i18n?: { [locale: string]: { desc?: string } }
}

export interface FoodFeaturedPick {
  itemRef: string             // slug of a food item (must exist in one of foodSections)
  showAfterSection: FoodKey   // render callout at bottom of this section's tab
  i18n: { [locale: string]: { label: string; desc?: string } }
}

export interface VenueMenuData {
  sections: MenuSection[]
  foodSections: MenuSection[]
  pairings: Pairing[]
  foodPairings: FoodPairing[]
  featuredPick: FeaturedPick
  foodFeaturedPick?: FoodFeaturedPick
  tasteWhy?: Record<string, { lead: string; post: string }>
}

// ---------------------------------------------------------------------------
// BB cocktail sections
// ---------------------------------------------------------------------------

const bitter: MenuSection = {
  key: 'bitter',
  type: 'cocktail',
  i18n: {
    en: { label: 'Bitter', sub: 'Grown-up and bittersweet, the before-dinner ones' },
    sq: { label: 'Të hidhura' },
    it: { label: 'Amaro' },
    pl: { label: 'Gorzkie' },
    hu: { label: 'Keserű' },
    de: { label: 'Bitter' },
    fr: { label: 'Amer' },
    no: { label: 'Bitter' },
  },
  items: [
    { id: 'aperol-spritz', slug: 'aperol-spritz', price: 'L500', glass: 'wine', lvl: 1, loved: true,
      posterSrc: '/venue-assets/bottle-brothers/aperol-spritz.jpg',
      i18n: { en: { name: 'Aperol Spritz', desc: 'Lightly bitter, gently sweet. Orange, citrus, sparkling. Light and easy, opens slow.' } } },
    { id: 'campari-spritz', slug: 'campari-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/campari-spritz.jpg',
      i18n: { en: { name: 'Campari Spritz', desc: 'Strongly bitter. Citrus and soda, sparkling. Sharp from the first sip, dry to the end.' } } },
    { id: 'negroni-strawberry-basil', slug: 'negroni-strawberry-basil', price: 'L500', glass: 'rocks', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/negroni-strawberry-basil.jpg',
      i18n: { en: { name: 'Negroni Strawberry & Basil', desc: 'Medium bitter, lightly sweet. Strawberry, berry, basil, green grass. Strawberry leads, basil opens at the end.' } } },
    { id: 'barrel-aged-coconut-negroni', slug: 'barrel-aged-coconut-negroni', price: 'L1000', glass: 'rocks', lvl: 3, house: true,
      posterSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.jpg',
      i18n: { en: { name: 'Barrel-Aged Coconut Negroni', desc: 'Medium bitter, medium sweet. Coconut, tropical, warm. A month in oak, and it opens like the tropics.' } } },
  ],
}

const sour: MenuSection = {
  key: 'sour',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sour', sub: 'Bright and sharp, wakes you up' },
    sq: { label: 'Të thartat' },
    it: { label: 'Aspro' },
    pl: { label: 'Kwaśne' },
    hu: { label: 'Savanyú' },
    de: { label: 'Sauer' },
    fr: { label: 'Acide' },
    no: { label: 'Surt' },
  },
  items: [
    { id: 'aloe-you-vera-much', slug: 'aloe-you-vera-much', price: 'L750', glass: 'collins', lvl: 2, house: true,
      posterSrc: '/venue-assets/bottle-brothers/aloe-you-vera-much.jpg',
      i18n: { en: { name: 'Aloe You Vera Much', desc: 'Medium sweet, lightly sour. Pineapple, cut grass, mint, aloe. The longer you hold it, the more elderflower opens up.' } } },
    { id: 'basil-smash', slug: 'basil-smash', price: 'L750', glass: 'rocks', lvl: 2, house: true, loved: true,
      posterSrc: '/venue-assets/bottle-brothers/basil-smash.jpg',
      i18n: { en: { name: 'Basil Smash', desc: 'Balanced sweet and sour. Basil, green grass, fresh. Green and clean, opens easy.' } } },
    { id: 'sea-salt-paloma', slug: 'sea-salt-paloma', price: 'L500', glass: 'collins', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/sea-salt-paloma.jpg',
      i18n: { en: { name: 'Sea Salt Paloma', desc: 'Medium sour, dry. Grapefruit, citrus, salt, sparkling. Fresh and saline, crisp to the end.' } } },
    { id: 'talk-balkan-to-me', slug: 'talk-balkan-to-me', price: 'L1000', glass: 'collins', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/talk-balkan-to-me.jpg',
      i18n: { en: { name: 'Talk Balkan To Me', desc: 'Medium sour, lightly sweet. Green grass, floral, fresh. Starts soft, opens more sour at the end.' } } },
  ],
}

const sweet: MenuSection = {
  key: 'sweet',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sweet', sub: 'Fruit-forward and easy, the crowd-pleasers' },
    sq: { label: 'Të ëmbla' },
    it: { label: 'Dolce' },
    pl: { label: 'Słodkie' },
    hu: { label: 'Édes' },
    de: { label: 'Süß' },
    fr: { label: 'Sucré' },
    no: { label: 'Søtt' },
  },
  items: [
    { id: 'hugo', slug: 'hugo', price: 'L500', glass: 'wine', lvl: 1,
      posterSrc: '/venue-assets/bottle-brothers/hugo.jpg',
      i18n: { en: { name: 'Hugo', desc: 'Lightly sweet, balanced. Elderflower, mint, green grass, fizzy. Fresh and floral, opens slow.' } } },
    { id: 'limoncello-spritz', slug: 'limoncello-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/limoncello-spritz.jpg',
      i18n: { en: { name: 'Limoncello Spritz', desc: 'Medium sour, sparkling. Lemon, citrus, green grass, fresh. Bright and clean, crisp to the end.' } } },
    { id: 'lychee-spritz', slug: 'lychee-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/lychee-spritz.jpg',
      i18n: { en: { name: 'Lychee Spritz', desc: 'Medium sweet, floral. Lychee, fresh, lightly sour. Soft and delicate, opens light.' } } },
    { id: 'brothers-spritz', slug: 'brothers-spritz', price: 'L750', glass: 'wine', lvl: 2, house: true,
      posterSrc: '/venue-assets/bottle-brothers/brothers-spritz.jpg',
      i18n: { en: { name: 'Brothers Spritz', desc: 'Medium sour, lightly bitter. Passion fruit, tropical, citrus, fresh. Tropical up front, dry on the finish.' } } },
    { id: 'hibiscus-spritz', slug: 'hibiscus-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/hibiscus-spritz.jpg',
      i18n: { en: { name: 'Hibiscus Spritz', desc: 'Medium sweet, fresh. Hibiscus, mint, green grass, sparkling. Bright and floral, clean to the end.' } } },
    { id: 'martini-royal', slug: 'martini-royal', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/martini-royal.jpg',
      i18n: { en: { name: 'Martini Royal', desc: 'Medium sweet, lightly sour. Floral, mint, citrus, fizzy. Fresh and floral, opens light.' } } },
    { id: 'cherry-poppins', slug: 'cherry-poppins', price: 'L500', glass: 'collins', lvl: 2,
      videoSrc: '/venue-assets/bottle-brothers/bb-cocktail-1.webm',
      posterSrc: '/venue-assets/bottle-brothers/cocktail-placeholder.png',
      i18n: { en: { name: 'Cherry Poppins', desc: 'Medium sweet, lightly sour. Cherry, hibiscus, almond. Cherry leads, nutty on the finish.' } } },
    // glass: CSV says martini, but the venue photo is clearly a coupe — photo wins
    { id: 'miss-lavander', slug: 'miss-lavander', price: 'L750', glass: 'coupe', lvl: 2, house: true,
      posterSrc: '/venue-assets/bottle-brothers/miss-lavander.jpg',
      i18n: { en: { name: 'Miss Lavander', desc: 'Medium sweet, lightly sour, balanced. Grapefruit, lychee, elderflower, lemon. Floral and fresh, opens with a touch of rose.' } } },
    { id: 'pornstar-martini', slug: 'pornstar-martini', price: 'L750', glass: 'martini', lvl: 3, house: true, loved: true,
      posterSrc: '/venue-assets/bottle-brothers/pornstar-martini.jpg',
      i18n: { en: { name: 'Pornstar Martini', desc: 'Medium sweet, tropical. Passion fruit, pineapple, almond, cucumber. Exotic and soft, fresh on the finish.' } } },
    // shares the Brothers Mule poster for now — swap when a real Tiki Tonka shot arrives
    { id: 'tiki-tonka', slug: 'tiki-tonka', price: 'L750', glass: 'collins', lvl: 3, house: true, loved: true,
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: 'Tiki Tonka', desc: 'Medium sweet, tropical, balanced. Pineapple, citrus, banana, vanilla. Opens with coffee and chocolate at the end.' } } },
  ],
}

const spicy: MenuSection = {
  key: 'spicy',
  type: 'cocktail',
  i18n: {
    en: { label: 'Spicy', sub: 'A little heat' },
    sq: { label: 'Pikante' },
    it: { label: 'Speziato' },
    pl: { label: 'Ostre' },
    hu: { label: 'Csípős' },
    de: { label: 'Scharf' },
    fr: { label: 'Épicé' },
    no: { label: 'Krydret' },
  },
  items: [
    { id: 'brothers-mule', slug: 'brothers-mule', price: 'L750', glass: 'collins', house: true,
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: "Brother's Mule", desc: 'Medium sour, spicy, fizzy. Cucumber, basil, citrus. Ginger hits first, fresh and dry to the end.' } } },
    { id: 'tierra-del-fuego', slug: 'tierra-del-fuego', price: 'L750', glass: 'rocks', house: true,
      posterSrc: '/venue-assets/bottle-brothers/tierra-del-fuego.jpg',
      i18n: { en: { name: 'Tierra Del Fuego', desc: 'Medium sweet, medium sour, balanced. Watermelon, berry, green grass, mint. Watermelon leads, opens spicy at the end.' } } },
  ],
}

const zero: MenuSection = {
  key: 'zero',
  type: 'cocktail',
  i18n: {
    en: { label: 'Zero', sub: 'No alcohol, same hands, same care' },
    sq: { label: 'Pa alkool' },
    it: { label: 'Analcolici' },
    pl: { label: 'Bez alkoholu' },
    hu: { label: 'Alkoholmentes' },
    de: { label: 'Alkoholfrei' },
    fr: { label: 'Sans alcool' },
    no: { label: 'Alkoholfritt' },
  },
  items: [
    // shares the Hugo poster — same build, no alcohol
    { id: 'virgin-hugo', slug: 'virgin-hugo', price: 'L450', glass: 'wine', flavor: 'sweet',
      posterSrc: '/venue-assets/bottle-brothers/hugo.jpg',
      i18n: { en: { name: 'Virgin Hugo', desc: 'Lightly sweet, fresh. Elderflower, mint, green grass, fizzy. All the lift of the Hugo, none of the gin.' } } },
    { id: 'passion-pop', slug: 'passion-pop', price: 'L450', glass: 'collins', flavor: 'sweet', loved: true,
      posterSrc: '/venue-assets/bottle-brothers/aloe-you-vera-much.jpg',
      i18n: { en: { name: 'Passion Pop', desc: 'Sweet, tropical. Passion fruit, pineapple, lemon, sparkling. Bright and fruity, fizzy to the end.' } } },
    // shares the Hugo poster — lime + mint, no alcohol
    { id: 'virgin-mojito', slug: 'virgin-mojito', price: 'L450', glass: 'collins', flavor: 'sour',
      posterSrc: '/venue-assets/bottle-brothers/hugo.jpg',
      i18n: { en: { name: 'Virgin Mojito', desc: 'Lightly sour, fresh. Lime, mint, soda. Cool and clean, crisp to the end.' } } },
    // shares the Hibiscus Spritz poster — same hibiscus build, no alcohol
    { id: 'hibiscus-ruby', slug: 'hibiscus-ruby', price: 'L450', glass: 'collins', flavor: 'sour',
      posterSrc: '/venue-assets/bottle-brothers/hibiscus-spritz.jpg',
      i18n: { en: { name: 'Hibiscus Ruby', desc: 'Lightly sour. Hibiscus, lime, red berry, soda. Tart and ruby, fresh on the finish.' } } },
  ],
}

// ---------------------------------------------------------------------------
// BB food sections
// ---------------------------------------------------------------------------

const pizza: MenuSection = {
  key: 'pizza',
  type: 'food',
  i18n: {
    en: { label: 'Pizza', sub: '' },
    sq: { label: 'Pizza' },
    it: { label: 'Pizza' },
    pl: { label: 'Pizza' },
    hu: { label: 'Pizza' },
    de: { label: 'Pizza' },
    fr: { label: 'Pizza' },
    no: { label: 'Pizza' },
  },
  items: [
    { id: 'margherita', slug: 'margherita', price: 'L600', glass: 'wine',
      i18n: { en: { name: 'Margherita', desc: 'Tomato sauce, mozzarella, basil' } } },
    { id: 'capricciosa', slug: 'capricciosa', price: 'L700', glass: 'wine',
      i18n: { en: { name: 'Capricciosa', desc: 'Tomato sauce, mozzarella, ham, mushrooms, olives' } } },
    { id: '4-formaggi', slug: '4-formaggi', price: 'L750', glass: 'wine',
      i18n: { en: { name: '4 Formaggi', desc: 'Tomato sauce, mozzarella, Gouda, provolone, gorgonzola' } } },
    { id: 'diavola', slug: 'diavola', price: 'L650', glass: 'wine',
      i18n: { en: { name: 'Diavola', desc: 'Tomato sauce, mozzarella, basil, spicy salami, spicy sauce' } } },
    { id: 'deliziosa', slug: 'deliziosa', price: 'L800', glass: 'wine',
      i18n: { en: { name: 'Deliziosa', desc: 'Mozzarella, prosciutto crudo, cherry tomatoes, arugula, Grana cheese' } } },
    { id: 'cotto-e-funghi', slug: 'cotto-e-funghi', price: 'L700', glass: 'wine',
      i18n: { en: { name: 'Cotto e Funghi', desc: 'Tomato sauce, mozzarella, wurstel sausage, potatoes' } } },
    { id: 'americana', slug: 'americana', price: 'L650', glass: 'wine',
      // TODO: Americana description duplicates Cotto e Funghi — confirm real copy with BB
      i18n: { en: { name: 'Americana', desc: 'Tomato sauce, mozzarella, wurstel sausage, potatoes' } } },
    { id: 'bi-bi', slug: 'bi-bi', price: 'L1000', glass: 'wine',
      i18n: { en: { name: 'Bi-Bi', desc: 'Tomato sauce, mozzarella, chicken ham, arugula, Grana cheese' } } },
  ],
}

const burgers: MenuSection = {
  key: 'burgers',
  type: 'food',
  i18n: {
    en: { label: 'Burgers', sub: '' },
    sq: { label: 'Hamburgerë' },
    it: { label: 'Hamburger' },
    pl: { label: 'Burgery' },
    hu: { label: 'Hamburgerek' },
    de: { label: 'Burger' },
    fr: { label: 'Burgers' },
    no: { label: 'Burgere' },
  },
  items: [
    { id: 'classic-burger', slug: 'classic-burger', price: 'L500', glass: 'wine',
      i18n: { en: { name: 'Classic Burger', desc: 'Beef patty, tomato, arugula, Gouda cheese, sauce of your choice' } } },
    { id: 'chicken-burger', slug: 'chicken-burger', price: 'L600', glass: 'wine',
      i18n: { en: { name: 'Chicken Burger', desc: 'Chicken fillet, tomato, arugula, Gouda cheese, sauce of your choice' } } },
    { id: 'brothers-burger', slug: 'brothers-burger', price: 'L700', glass: 'wine',
      i18n: { en: { name: "Brother's Burger", desc: 'Beef patty, bacon, tomato, arugula, Gouda cheese, egg, caramelized red onion, barbecue sauce' } } },
  ],
}

const sharing: MenuSection = {
  key: 'sharing',
  type: 'food',
  i18n: {
    en: { label: 'Sharing', sub: '' },
    sq: { label: 'Për ndarje' },
    it: { label: 'Da condividere' },
    pl: { label: 'Do podziału' },
    hu: { label: 'Közösen' },
    de: { label: 'Zum Teilen' },
    fr: { label: 'À partager' },
    no: { label: 'Til deling' },
  },
  items: [
    { id: 'finger-food-mix', slug: 'finger-food-mix', price: 'L1000', glass: 'wine',
      i18n: { en: { name: 'Finger Food Mix', desc: 'Chicken nuggets, onion rings, potato croquettes, and French fries' } } },
    { id: 'cured-meats-cheese-platter', slug: 'cured-meats-cheese-platter', price: 'L1400', glass: 'wine',
      i18n: { en: { name: 'Cured Meats & Cheese Platter', desc: 'Selection of cured meats and cheeses' } } },
  ],
}

// ---------------------------------------------------------------------------
// Pairings: cocktail → 3 dishes
// TODO: itemRef names below use current foodData slugs. The prototype used
// "Pizza Margherita" / "Miks Sallame & Djathëra" which don't match — confirmed mismatch.
// ---------------------------------------------------------------------------

export const pairings: Pairing[] = [
  { cocktailRef: 'aperol-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'A little bitterness and the bubbles cut straight through fat. The classic aperitivo board never misses.' } } },
  { cocktailRef: 'campari-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'americana', price: 'L650' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Sharper and redder, it stands up to the saltiest, richest bites on the table.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'negroni-strawberry-basil', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'barrel-aged-coconut-negroni',
    dishes: [{ itemRef: 'brothers-burger', price: 'L700' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'A month in oak gives it real body, so give it a plate with weight. Smoke likes the intense.' } } },
  { cocktailRef: 'aloe-you-vera-much',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Fresh and green, it stays out of the way of a simple plate and refreshes between bites.' } } },
  { cocktailRef: 'basil-smash',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: '4-formaggi', price: 'L750' }],
    i18n: { en: { wisdom: 'Basil in the glass, basil on the pizza, they were always going to get along.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'sea-salt-paloma', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'talk-balkan-to-me', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'hugo',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Light and herbal, it keeps a fresh pizza tasting fresh.' } } },
  { cocktailRef: 'limoncello-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'diavola', price: 'L650' }],
    i18n: { en: { wisdom: 'Lemon cuts grease, and the sweetness softens a little chili heat.' } } },
  { cocktailRef: 'lychee-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'chicken-burger', price: 'L600' }],
    i18n: { en: { wisdom: 'Floral and soft, it cools a slice down and likes the lighter plates.' } } },
  { cocktailRef: 'brothers-spritz',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'margherita', price: 'L600' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Passion fruit is sweet enough to calm a little chili heat.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'hibiscus-spritz', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'martini-royal', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'cherry-poppins', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'miss-lavander',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'deliziosa', price: 'L800' }],
    i18n: { en: { wisdom: 'Delicate and floral, it likes a light plate that will not shout over it.' } } },
  { cocktailRef: 'pornstar-martini',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Sweet and exotic, it softens heat and salt at the same time.' } } },
  { cocktailRef: 'tiki-tonka',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'americana', price: 'L650' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Tropical and strong, it can take on smoke and spice.' } } },
  { cocktailRef: 'brothers-mule',
    dishes: [{ itemRef: 'americana', price: 'L650' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Ginger and ice cool things off, so a heavy, savory plate feels easy.' } } },
  { cocktailRef: 'tierra-del-fuego',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Heat meets heat, or let the cheese cool it down, your call.' } } },
  { cocktailRef: 'virgin-hugo',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'chicken-burger', price: 'L600' }],
    i18n: { en: { wisdom: 'All the lift of the Hugo, same love for a fresh pizza.' } } },
  { cocktailRef: 'passion-pop',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'margherita', price: 'L600' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Bright and tropical, it cools a spicy bite.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'virgin-mojito', dishes: [], i18n: { en: { wisdom: '' } } },
  { cocktailRef: 'hibiscus-ruby',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Tart and ruby, it freshens up anything savory and likes cheese.' } } },
]

// ---------------------------------------------------------------------------
// Food pairings: dish → 3 cocktails
// ---------------------------------------------------------------------------

export const foodPairings: FoodPairing[] = [
  // TODO(bb-csv): refs to removed cocktails stripped — each dish needs 3 again, why text to follow
  { dishRef: 'margherita', cocktailRefs: ['aperol-spritz', 'hugo'],
    i18n: { en: { why: 'Light and fresh, so the glass stays light and fresh too.' } } },
  { dishRef: 'capricciosa', cocktailRefs: [],
    i18n: { en: { why: '' } } },
  { dishRef: '4-formaggi', cocktailRefs: [],
    i18n: { en: { why: '' } } },
  { dishRef: 'diavola', cocktailRefs: ['brothers-spritz', 'pornstar-martini', 'limoncello-spritz'],
    i18n: { en: { why: 'Sweet calms the chili heat.' } } },
  { dishRef: 'deliziosa', cocktailRefs: ['aperol-spritz', 'hugo', 'basil-smash'],
    i18n: { en: { why: 'Light and herbal next to a fresh, simple plate.' } } },
  { dishRef: 'cotto-e-funghi', cocktailRefs: [],
    i18n: { en: { why: '' } } },
  { dishRef: 'americana', cocktailRefs: ['campari-spritz'],
    i18n: { en: { why: 'Bitter, bubbles and a little sour cut the fat.' } } },
  { dishRef: 'bi-bi', cocktailRefs: ['hugo', 'limoncello-spritz'],
    i18n: { en: { why: 'Light and fresh, so the glass keeps it light.' } } },
  { dishRef: 'classic-burger', cocktailRefs: ['campari-spritz', 'brothers-mule'],
    i18n: { en: { why: 'Bitter cuts the fat, and one long drink cleanses.' } } },
  { dishRef: 'chicken-burger', cocktailRefs: ['lychee-spritz', 'aloe-you-vera-much'],
    i18n: { en: { why: 'Lighter meat asks for lighter, fresher glasses.' } } },
  { dishRef: 'brothers-burger', cocktailRefs: ['barrel-aged-coconut-negroni'],
    i18n: { en: { why: 'Smoky and rich, so intense bitter and sour stand up to it.' } } },
  { dishRef: 'finger-food-mix', cocktailRefs: ['aperol-spritz', 'campari-spritz', 'pornstar-martini'],
    i18n: { en: { why: 'Aperitivo bubbles, and one sweet for the table.' } } },
  { dishRef: 'cured-meats-cheese-platter', cocktailRefs: [],
    i18n: { en: { why: '' } } },
]

// ---------------------------------------------------------------------------
// Taste-why tooltip text (cocktail → dish pairing explanation)
// ---------------------------------------------------------------------------

export const tasteWhy: Record<string, { lead: string; post: string }> = {
  sour:   { lead: 'Sour cuts the fat.', post: ' slices through the cheese and resets your palate between bites.' },
  sweet:  { lead: 'Sweet cools the heat.', post: ' balances a salty or spicy slice, and a Diavola loves it.' },
  bitter: { lead: 'Bitter holds its own.', post: ' stands up to a loaded pizza and cuts the richness.' },
}

// ---------------------------------------------------------------------------
// Featured pick — Brothers Spritz (no desc override needed, inherit from cocktail)
// ---------------------------------------------------------------------------

export const featuredPick: FeaturedPick = {
  cocktailRef: 'brothers-spritz',
}

// ---------------------------------------------------------------------------
// Full venue menu export
// ---------------------------------------------------------------------------

export const bbMenuData: VenueMenuData = {
  sections: [bitter, sour, sweet, spicy, zero],
  foodSections: [pizza, burgers, sharing],
  pairings,
  foodPairings,
  featuredPick,
  tasteWhy,
}

// Ordered food categories for tab rendering
export const foodCatOrder: FoodKey[] = ['pizza', 'burgers', 'sharing']
