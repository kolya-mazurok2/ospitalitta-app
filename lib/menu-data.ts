/**
 * Canonical BB menu data — source until Supabase is wired.
 * All text fields wrapped in i18n. Only en seeded; sq/it added additively.
 * Lifted verbatim from BB Menu Mobile v2.dc.html and reshaped to DEC-010.
 */

export type GlassType = 'wine' | 'collins' | 'rocks' | 'martini' | 'coupe'
export type TasteKey = 'bitter' | 'sour' | 'sweet' | 'spicy' | 'zero'
export type TierKey  = 'tier-600' | 'tier-700' | 'tier-800' | 'tier-900' | 'tier-1000'
export type FoodKey  = 'pizza' | 'sharing'
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

/** One taste axis with its intensity. Items can carry several ("medium sweet, lightly sour"). */
export interface TasteSpec {
  taste: 'bitter' | 'sour' | 'sweet'
  lvl: 1 | 2 | 3
}

/**
 * What a plate does to the palate. Pairings are scored off this rather than guessed
 * from the ingredient list: fat and salt are what a glass has to cut through, and
 * heat is what it has to cool. Not shown to the guest — it drives which three
 * cocktails a dish gets, and in what order.
 */
export interface FoodProfile {
  rich: 1 | 2 | 3        // fat / heaviness
  salt: 1 | 2 | 3
  spicy?: boolean
}

export interface MenuItem {
  id: string
  slug: string
  price: string          // 'L500' — flat
  glass?: GlassType
  lvl?: 1 | 2 | 3       // intensity marks (bitter/sour/sweet)
  profile?: FoodProfile  // food items only
  // Full taste profile, primary axis first. Only set when the item has MORE than one
  // taste — a single-taste item is covered by its section key + lvl. Detail sheet reads
  // this; the compact card keeps showing the section's single mark.
  tastes?: TasteSpec[]
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
  showAfterSection: FoodKey   // which section tab the note belongs to
  i18n: { [locale: string]: { label: string; desc?: string } }
}

export interface VenueMenuData {
  sections: MenuSection[]
  foodSections: MenuSection[]
  pairings: Pairing[]
  foodPairings: FoodPairing[]
  featuredPick: FeaturedPick
  foodFeaturedPick?: FoodFeaturedPick
  tasteWhy?: Record<string, string>   // one concrete line per taste
}

// ---------------------------------------------------------------------------
// BB cocktail sections
// ---------------------------------------------------------------------------

const bitter: MenuSection = {
  key: 'bitter',
  type: 'cocktail',
  i18n: {
    en: { label: 'Bitter' },
    sq: { label: 'Të hidhura' },
    it: { label: 'Amaro' },
    pl: { label: 'Gorzkie' },
    uk: { label: 'Гіркі' },
    de: { label: 'Bitter' },
    fr: { label: 'Amer' },
    no: { label: 'Bitter' },
  },
  items: [
    { id: 'aperol-spritz', slug: 'aperol-spritz', price: 'L500', glass: 'wine', lvl: 1,
      tastes: [{ taste: 'bitter', lvl: 1 }, { taste: 'sweet', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/aperol-spritz.jpg',
      i18n: { en: { name: 'Aperol Spritz', desc: 'Lightly bitter, lightly sweet. Light and easy. Aperol, prosecco, soda, orange. Opens slow, stays gentle.' } } },
    { id: 'barrel-aged-coconut-negroni', slug: 'barrel-aged-coconut-negroni', price: 'L1000', glass: 'rocks', lvl: 2, house: true, loved: true,
      tastes: [{ taste: 'bitter', lvl: 2 }, { taste: 'sweet', lvl: 2 }],
      videoSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.mp4',
      posterSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.jpg',
      i18n: { en: { name: 'Barrel-Aged Coconut Negroni', desc: 'Medium bitter, medium sweet. Warm and tropical. Coconut rum, Campari, vermouth. A month in oak, and it opens like the tropics.' } } },
    { id: 'campari-spritz', slug: 'campari-spritz', price: 'L500', glass: 'wine', lvl: 3,
      posterSrc: '/venue-assets/bottle-brothers/campari-spritz.jpg',
      i18n: { en: { name: 'Campari Spritz', desc: 'Strongly bitter. Sharp and dry. Campari, prosecco, soda. Bites from the first sip and holds it.' } } },
    { id: 'negroni-strawberry-basil', slug: 'negroni-strawberry-basil', price: 'L500', glass: 'rocks', lvl: 2,
      tastes: [{ taste: 'bitter', lvl: 2 }, { taste: 'sweet', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/negroni-strawberry-basil.jpg',
      i18n: { en: { name: 'Negroni Strawberry & Basil', desc: 'Medium bitter, lightly sweet. Fruity and fresh. Strawberry-infused Campari, basil gin, vermouth. Strawberry leads, basil takes over at the end.' } } },
  ],
}

const sour: MenuSection = {
  key: 'sour',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sour' },
    sq: { label: 'Të thartat' },
    it: { label: 'Aspro' },
    pl: { label: 'Kwaśne' },
    uk: { label: 'Кислі' },
    de: { label: 'Sauer' },
    fr: { label: 'Acide' },
    no: { label: 'Surt' },
  },
  items: [
    { id: 'basil-smash', slug: 'basil-smash', price: 'L750', glass: 'rocks', lvl: 2, house: true,
      tastes: [{ taste: 'sour', lvl: 2 }, { taste: 'sweet', lvl: 2 }],
      posterSrc: '/venue-assets/bottle-brothers/basil-smash.jpg',
      i18n: { en: { name: 'Basil Smash', desc: 'Balanced sweet and sour. Fresh and green. Basil, gin, lemon. Clean through, opens easy.' } } },
    { id: 'talk-balkan-to-me', slug: 'talk-balkan-to-me', price: 'L1000', glass: 'collins', lvl: 2, loved: true,
      tastes: [{ taste: 'sour', lvl: 2 }, { taste: 'sweet', lvl: 1 }],
      videoSrc: '/venue-assets/bottle-brothers/talk-balkan-to-me.mp4',
      posterSrc: '/venue-assets/bottle-brothers/talk-balkan-to-me.jpg',
      i18n: { en: { name: 'Talk Balkan To Me', desc: 'Medium sour, lightly sweet. Fresh and floral. Chamomile gin, lemon, elderflower liqueur, soda, fig leaf. Starts soft, opens more sour at the end.' } } },
    { id: 'sea-salt-paloma', slug: 'sea-salt-paloma', price: 'L500', glass: 'collins', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/sea-salt-paloma.jpg',
      i18n: { en: { name: 'Sea Salt Paloma', desc: 'Medium sour, dry. Fresh and saline. Tequila, lime, yuzu liqueur, grapefruit soda, salt. Sparkling and crisp to the end.' } } },
    { id: 'limoncello-spritz', slug: 'limoncello-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/limoncello-spritz.jpg',
      i18n: { en: { name: 'Limoncello Spritz', desc: 'Medium sour. Bright and fresh. Limoncello, prosecco, soda, mint. Citrus and green grass, crisp to the end.' } } },
    { id: 'brothers-spritz', slug: 'brothers-spritz', price: 'L750', glass: 'wine', lvl: 2, house: true,
      tastes: [{ taste: 'sour', lvl: 2 }, { taste: 'bitter', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/brothers-spritz.jpg',
      i18n: { en: { name: 'Brothers Spritz', desc: 'Medium sour, lightly bitter. Fresh and tropical. Aperol, prosecco, passion fruit, soda. Tropical up front, dry on the finish.' } } },
  ],
}

const sweet: MenuSection = {
  key: 'sweet',
  type: 'cocktail',
  i18n: {
    en: { label: 'Sweet' },
    sq: { label: 'Të ëmbla' },
    it: { label: 'Dolce' },
    pl: { label: 'Słodkie' },
    uk: { label: 'Солодкі' },
    de: { label: 'Süß' },
    fr: { label: 'Sucré' },
    no: { label: 'Søtt' },
  },
  items: [
    { id: 'hugo', slug: 'hugo', price: 'L500', glass: 'wine', lvl: 1,
      posterSrc: '/venue-assets/bottle-brothers/hugo.jpg',
      i18n: { en: { name: 'Hugo', desc: 'Lightly sweet. Fresh and floral. Elderflower, mint, prosecco, soda. Fizzy and light, opens slow.' } } },
    { id: 'pornstar-martini', slug: 'pornstar-martini', price: 'L750', glass: 'martini', lvl: 2, house: true, loved: true,
      videoSrc: '/venue-assets/bottle-brothers/pornstar-martini.mp4',
      posterSrc: '/venue-assets/bottle-brothers/pornstar-martini.jpg',
      i18n: { en: { name: 'Pornstar Martini', desc: 'Medium sweet. Exotic and fresh. Vanilla vodka, passion fruit, pineapple, almond syrup, cucumber. Soft and tropical, fresh on the finish.' } } },
    { id: 'lychee-spritz', slug: 'lychee-spritz', price: 'L500', glass: 'wine', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/lychee-spritz.jpg',
      i18n: { en: { name: 'Lychee Spritz', desc: 'Medium sweet, lightly sour. Soft and floral. Lychee liqueur, mint, prosecco, soda. Delicate, opens light.' } } },
    { id: 'hibiscus-spritz', slug: 'hibiscus-spritz', price: 'L500', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/hibiscus-spritz.jpg',
      i18n: { en: { name: 'Hibiscus Spritz', desc: 'Medium sweet. Bright and fresh. Hibiscus cordial, prosecco, soda. Citrus and mint, clean to the end.' } } },
    { id: 'martini-royal', slug: 'martini-royal', price: 'L500', glass: 'wine', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/martini-royal.jpg',
      i18n: { en: { name: 'Martini Royal', desc: 'Medium sweet, lightly sour. Fresh and floral. White Martini, prosecco, mint, citrus. Fizzy, opens light.' } } },
    { id: 'cherry-poppins', slug: 'cherry-poppins', price: 'L500', glass: 'collins', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      videoSrc: '/venue-assets/bottle-brothers/cherry-poppins.mp4',
      posterSrc: '/venue-assets/bottle-brothers/cherry-poppins.jpg',
      i18n: { en: { name: 'Cherry Poppins', desc: 'Medium sweet, lightly sour. Soft and nutty. Amaretto, hibiscus and cherry cordial, mint, lime, ginger. Cherry leads, nuts on the finish.' } } },
    // glass: CSV says martini, but the venue photo is clearly a coupe — photo wins
    { id: 'miss-lavander', slug: 'miss-lavander', price: 'L750', glass: 'coupe', lvl: 2, house: true,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/miss-lavander.jpg',
      i18n: { en: { name: 'Miss Lavander', desc: 'Medium sweet, lightly sour. Floral and fresh. Lavender-infused lychee liqueur, elderflower, grapefruit juice, rose water. Balanced through, opens with a touch of rose.' } } },
    // shares the Brothers Mule poster for now — swap when a real Tiki Tonka shot arrives
    { id: 'tiki-tonka', slug: 'tiki-tonka', price: 'L750', glass: 'collins', lvl: 2, house: true,
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: 'Tiki Tonka', desc: 'Medium sweet. Tropical and warm. Tonka-infused rum blend, amaretto, vanilla, lime, pineapple. Opens with coffee and chocolate at the end.' } } },
    { id: 'aloe-you-vera-much', slug: 'aloe-you-vera-much', price: 'L750', glass: 'collins', lvl: 2, house: true,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/aloe-you-vera-much.jpg',
      i18n: { en: { name: 'Aloe You Vera Much', desc: 'Medium sweet, lightly sour. Fresh and green. Gin, aloe vera, basil, lime, pineapple. The longer you hold it, the more elderflower opens up.' } } },
  ],
}

const spicy: MenuSection = {
  key: 'spicy',
  type: 'cocktail',
  i18n: {
    en: { label: 'Spicy' },
    sq: { label: 'Pikante' },
    it: { label: 'Speziato' },
    pl: { label: 'Ostre' },
    uk: { label: 'Гострі' },
    de: { label: 'Scharf' },
    fr: { label: 'Épicé' },
    no: { label: 'Krydret' },
  },
  items: [
    { id: 'brothers-mule', slug: 'brothers-mule', price: 'L750', glass: 'collins', house: true,
      tastes: [{ taste: 'sour', lvl: 2 }],
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: "Brother's Mule", desc: 'Medium sour, spicy. Fresh and fizzy. Cucumber and basil vodka, lime, ginger beer, bitters. Ginger hits first, dry to the end.' } } },
    { id: 'tierra-del-fuego', slug: 'tierra-del-fuego', price: 'L750', glass: 'rocks', house: true, loved: true,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 2 }],
      posterSrc: '/venue-assets/bottle-brothers/tierra-del-fuego.jpg',
      i18n: { en: { name: 'Tierra Del Fuego', desc: 'Balanced sweet and sour. Fresh and green. Chilli-infused tequila, lime, watermelon, jalapeño liqueur. Watermelon leads, opens spicy at the end.' } } },
  ],
}

// Every zero item shares one illustration — the section reads as a set, and none of
// them had a shot of their own (they were borrowing alcoholic drinks' posters).
const zero: MenuSection = {
  key: 'zero',
  type: 'cocktail',
  i18n: {
    en: { label: 'Zero' },
    sq: { label: 'Pa alkool' },
    it: { label: 'Analcolici' },
    pl: { label: 'Bez alkoholu' },
    uk: { label: 'Без алкоголю' },
    de: { label: 'Alkoholfrei' },
    fr: { label: 'Sans alcool' },
    no: { label: 'Alkoholfritt' },
  },
  items: [
    { id: 'virgin-hugo', slug: 'virgin-hugo', price: 'L450', glass: 'wine', flavor: 'sweet',
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Virgin Hugo', desc: 'Lightly sweet. Fresh and floral. Elderflower syrup, mint, soda. All the lift of the Hugo, none of the gin.' } } },
    { id: 'passion-pop', slug: 'passion-pop', price: 'L450', glass: 'collins', flavor: 'sweet', loved: true,
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Passion Pop', desc: 'Medium sweet. Bright and tropical. Passion fruit, pineapple, lemon, sparkling water. Fruity and fizzy to the end.' } } },
    { id: 'virgin-mojito', slug: 'virgin-mojito', price: 'L450', glass: 'collins', flavor: 'sour',
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Virgin Mojito', desc: 'Lightly sour. Cool and clean. Lime, mint, soda. Crisp to the end.' } } },
    { id: 'hibiscus-ruby', slug: 'hibiscus-ruby', price: 'L450', glass: 'collins', flavor: 'sour',
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Hibiscus Ruby', desc: 'Lightly sour. Tart and ruby. Hibiscus cordial, lime, red berry juice, soda. Fresh on the finish.' } } },
  ],
}

// ---------------------------------------------------------------------------
// BB food sections
// ---------------------------------------------------------------------------

const pizza: MenuSection = {
  key: 'pizza',
  type: 'food',
  i18n: {
    en: { label: 'Pizza' },
    sq: { label: 'Pizza' },
    it: { label: 'Pizza' },
    pl: { label: 'Pizza' },
    uk: { label: 'Піца' },
    de: { label: 'Pizza' },
    fr: { label: 'Pizza' },
    no: { label: 'Pizza' },
  },
  items: [
    { id: 'margherita', slug: 'margherita', price: 'L600', glass: 'wine',
      profile: { rich: 1, salt: 1 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Margherita', desc: 'Tomato sauce, mozzarella, basil' } } },
    { id: 'bi-bi', slug: 'bi-bi', price: 'L1000', glass: 'wine',
      profile: { rich: 2, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/bi-bi.jpg',
      i18n: { en: { name: 'Bi-Bi', desc: 'Tomato sauce, mozzarella, chicken ham, arugula, Grana cheese' } } },
    { id: 'capricciosa', slug: 'capricciosa', price: 'L700', glass: 'wine',
      profile: { rich: 2, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Capricciosa', desc: 'Tomato sauce, mozzarella, ham, mushrooms, olives' } } },
    { id: '4-formaggi', slug: '4-formaggi', price: 'L750', glass: 'wine',
      profile: { rich: 3, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: '4 Formaggi', desc: 'Tomato sauce, mozzarella, Gouda, provolone, gorgonzola' } } },
    { id: 'diavola', slug: 'diavola', price: 'L650', glass: 'wine',
      profile: { rich: 2, salt: 2, spicy: true },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Diavola', desc: 'Tomato sauce, mozzarella, basil, spicy salami, spicy sauce' } } },
    { id: 'deliziosa', slug: 'deliziosa', price: 'L800', glass: 'wine',
      profile: { rich: 2, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Deliziosa', desc: 'Mozzarella, prosciutto crudo, cherry tomatoes, arugula, Grana cheese' } } },
    { id: 'cotto-e-funghi', slug: 'cotto-e-funghi', price: 'L700', glass: 'wine',
      profile: { rich: 3, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Cotto e Funghi', desc: 'Tomato sauce, mozzarella, wurstel sausage, potatoes' } } },
    { id: 'americana', slug: 'americana', price: 'L650', glass: 'wine',
      profile: { rich: 3, salt: 2 },
      // TODO: Americana description duplicates Cotto e Funghi — confirm real copy with BB
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Americana', desc: 'Tomato sauce, mozzarella, wurstel sausage, potatoes' } } },
  ],
}

const sharing: MenuSection = {
  key: 'sharing',
  type: 'food',
  i18n: {
    en: { label: 'Sharing' },
    sq: { label: 'Për ndarje' },
    it: { label: 'Da condividere' },
    pl: { label: 'Do podziału' },
    uk: { label: 'На компанію' },
    de: { label: 'Zum Teilen' },
    fr: { label: 'À partager' },
    no: { label: 'Til deling' },
  },
  items: [
    { id: 'finger-food-mix', slug: 'finger-food-mix', price: 'L1000', glass: 'wine',
      profile: { rich: 3, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/board-placeholder.jpg',
      i18n: { en: { name: 'Finger Food Mix', desc: 'Chicken nuggets, onion rings, potato croquettes, and French fries' } } },
    { id: 'cured-meats-cheese-platter', slug: 'cured-meats-cheese-platter', price: 'L1400', glass: 'wine',
      profile: { rich: 3, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/board-placeholder.jpg',
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
  { cocktailRef: 'negroni-strawberry-basil',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Basil in the glass, basil on the plate. The bitter side cuts straight through cheese and cured fat.' } } },
  { cocktailRef: 'barrel-aged-coconut-negroni',
    dishes: [{ itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }, { itemRef: 'capricciosa', price: 'L700' }],
    i18n: { en: { wisdom: 'A month in oak gives it real body, so give it a plate with weight. Smoke likes the intense.' } } },
  { cocktailRef: 'aloe-you-vera-much',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Fresh and green, it stays out of the way of a simple plate and refreshes between bites.' } } },
  { cocktailRef: 'basil-smash',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: '4-formaggi', price: 'L750' }],
    i18n: { en: { wisdom: 'Basil in the glass, basil on the pizza, they were always going to get along.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'sea-salt-paloma',
    dishes: [{ itemRef: 'finger-food-mix', price: 'L1000' }, { itemRef: 'diavola', price: 'L650' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Salt meets salt, and grapefruit resets your mouth between the fried bites.' } } },
  { cocktailRef: 'talk-balkan-to-me',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Floral and light, it stays out of the way of a fresh plate and lifts the arugula.' } } },
  { cocktailRef: 'hugo',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Light and herbal, it keeps a fresh pizza tasting fresh.' } } },
  { cocktailRef: 'limoncello-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'diavola', price: 'L650' }],
    i18n: { en: { wisdom: 'Lemon cuts grease, and the sweetness softens a little chili heat.' } } },
  { cocktailRef: 'lychee-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'deliziosa', price: 'L800' }],
    i18n: { en: { wisdom: 'Floral and soft, it cools a slice down and likes the lighter plates.' } } },
  { cocktailRef: 'brothers-spritz',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'margherita', price: 'L600' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Passion fruit is sweet enough to calm a little chili heat.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'hibiscus-spritz',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'capricciosa', price: 'L700' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Bubbles cut the fat, and the sweetness takes the edge off the chilli.' } } },
  { cocktailRef: 'martini-royal',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Fizzy and floral, it keeps a fresh pizza tasting fresh.' } } },
  { cocktailRef: 'cherry-poppins',
    dishes: [{ itemRef: 'cured-meats-cheese-platter', price: 'L1400' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'capricciosa', price: 'L700' }],
    i18n: { en: { wisdom: 'Cherry and almond do beside a cheese board what fruit preserve has always done.' } } },
  { cocktailRef: 'miss-lavander',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'deliziosa', price: 'L800' }],
    i18n: { en: { wisdom: 'Delicate and floral, it likes a light plate that will not shout over it.' } } },
  { cocktailRef: 'pornstar-martini',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'finger-food-mix', price: 'L1000' }, { itemRef: 'capricciosa', price: 'L700' }],
    i18n: { en: { wisdom: 'Sweet and exotic, it softens heat and salt at the same time.' } } },
  { cocktailRef: 'tiki-tonka',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'americana', price: 'L650' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Tropical and strong, it can take on smoke and spice.' } } },
  { cocktailRef: 'brothers-mule',
    dishes: [{ itemRef: 'americana', price: 'L650' }, { itemRef: 'finger-food-mix', price: 'L1000' }, { itemRef: 'cotto-e-funghi', price: 'L700' }],
    i18n: { en: { wisdom: 'Ginger and ice cool things off, so a heavy, savory plate feels easy.' } } },
  { cocktailRef: 'tierra-del-fuego',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Heat meets heat, or let the cheese cool it down, your call.' } } },
  { cocktailRef: 'virgin-hugo',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'deliziosa', price: 'L800' }],
    i18n: { en: { wisdom: 'All the lift of the Hugo, same love for a fresh pizza.' } } },
  { cocktailRef: 'passion-pop',
    dishes: [{ itemRef: 'diavola', price: 'L650' }, { itemRef: 'margherita', price: 'L600' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Bright and tropical, it cools a spicy bite.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'virgin-mojito',
    dishes: [{ itemRef: 'finger-food-mix', price: 'L1000' }, { itemRef: 'diavola', price: 'L650' }, { itemRef: 'margherita', price: 'L600' }],
    i18n: { en: { wisdom: 'Lime and mint cool the heat and cut through anything fried.' } } },
  { cocktailRef: 'hibiscus-ruby',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Tart and ruby, it freshens up anything savory and likes cheese.' } } },
]

// ---------------------------------------------------------------------------
// Food pairings: dish → 3 cocktails
// ---------------------------------------------------------------------------

export const foodPairings: FoodPairing[] = [
  // TODO(bb-csv): refs to removed cocktails stripped — each dish needs 3 again, why text to follow
  { dishRef: 'margherita', cocktailRefs: ['brothers-spritz', 'campari-spritz', 'sea-salt-paloma'],
    i18n: { en: { why: 'Sour keeps it fresh.' } } },
  { dishRef: 'capricciosa', cocktailRefs: ['brothers-spritz', 'basil-smash', 'talk-balkan-to-me'],
    i18n: { en: { why: 'Bitter cuts through it.' } } },
  { dishRef: '4-formaggi', cocktailRefs: ['tierra-del-fuego', 'barrel-aged-coconut-negroni', 'campari-spritz'],
    i18n: { en: { why: 'Bitter cuts the fat.' } } },
  { dishRef: 'diavola', cocktailRefs: ['lychee-spritz', 'martini-royal', 'cherry-poppins'],
    i18n: { en: { why: 'Sweet cools the chilli.' } } },
  { dishRef: 'deliziosa', cocktailRefs: ['negroni-strawberry-basil', 'basil-smash', 'tierra-del-fuego'],
    i18n: { en: { why: 'Citrus cuts the salt.' } } },
  { dishRef: 'cotto-e-funghi', cocktailRefs: ['limoncello-spritz', 'brothers-mule', 'brothers-spritz'],
    i18n: { en: { why: 'Sour cuts the starch.' } } },
  { dishRef: 'americana', cocktailRefs: ['aperol-spritz', 'campari-spritz', 'talk-balkan-to-me'],
    i18n: { en: { why: 'Sour cuts the starch.' } } },
  { dishRef: 'bi-bi', cocktailRefs: ['campari-spritz', 'barrel-aged-coconut-negroni', 'negroni-strawberry-basil'],
    i18n: { en: { why: 'Bitter cuts through it.' } } },
  { dishRef: 'finger-food-mix', cocktailRefs: ['barrel-aged-coconut-negroni', 'miss-lavander', 'aloe-you-vera-much'],
    i18n: { en: { why: 'Bitter cuts the fat.' } } },
  { dishRef: 'cured-meats-cheese-platter', cocktailRefs: ['negroni-strawberry-basil', 'basil-smash', 'tierra-del-fuego'],
    i18n: { en: { why: 'Bitter cuts the fat.' } } },
]

// ---------------------------------------------------------------------------
// Taste-why tooltip text (cocktail → dish pairing explanation)
// ---------------------------------------------------------------------------

export const tasteWhy: Record<string, string> = {
  sour:   'Sour clears the palate.',
  sweet:  'Sweet cools the heat.',
  bitter: 'Bitter cuts the fat.',
}

// ---------------------------------------------------------------------------
// Featured pick — Brothers Spritz (no desc override needed, inherit from cocktail)
// ---------------------------------------------------------------------------

export const featuredPick: FeaturedPick = {
  cocktailRef: 'brothers-spritz',
}

// ---------------------------------------------------------------------------
// Food featured pick — the sharing board to order for two
// ---------------------------------------------------------------------------

export const foodFeaturedPick: FoodFeaturedPick = {
  itemRef: 'cured-meats-cheese-platter',
  showAfterSection: 'sharing',
  i18n: {
    en: { label: 'Recommended for two.' },
    sq: { label: 'Rekomandohet për dy.' },
    it: { label: 'Consigliato per due.' },
    pl: { label: 'Polecane dla dwojga.' },
    uk: { label: 'Рекомендуємо для двох.' },
    de: { label: 'Empfohlen für zwei.' },
    fr: { label: 'Recommandé pour deux.' },
    no: { label: 'Anbefales for to.' },
  },
}

// ---------------------------------------------------------------------------
// Full venue menu export
// ---------------------------------------------------------------------------

export const bbMenuData: VenueMenuData = {
  sections: [bitter, sour, sweet, spicy, zero],
  foodSections: [pizza, sharing],
  pairings,
  foodPairings,
  featuredPick,
  foodFeaturedPick,
  tasteWhy,
}

// Ordered food categories for tab rendering
export const foodCatOrder: FoodKey[] = ['pizza', 'sharing']
