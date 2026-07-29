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
                     | 'cakes' | 'savory'

/** Illustration category used to pick a placeholder when an item has no real photo. */
export type PlaceholderKind = 'coffee' | 'coffee-water' | 'drink' | 'cake-slice' | 'eclair' | 'fruit' | 'dessert'

/** Canonical coffee drink — tags an item so its taste profile is filled from the shared
 *  COFFEE_TASTES map. Reusable across venues: tag the item, call applyCoffeeTastes(). */
export type CoffeeKind =
  | 'espresso' | 'americano' | 'macchiato' | 'nescafe'
  | 'ice-coffee' | 'cappuccino' | 'hot-chocolate' | 'cold-chocolate'

export const TASTE_KEYS: ReadonlySet<string> = new Set<TasteKey>(['bitter','sour','sweet','spicy','zero'])
export type Locale = string

export interface I18nText {
  [locale: string]: { name: string; desc: string; note?: string }
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

/** One selectable option. `sizes` = same item different size (S/M/L); `variants` = flavor/type. */
export interface ItemOption {
  label: string          // 'S' | 'M' | 'L'  or  'Chocolate' | 'Caramel' …
  price: string          // '1000'
  posterSrc?: string     // per-variant image (carousel); falls back to the item poster/placeholder
  videoSrc?: string      // per-variant clip; when set the slide plays video instead of the poster
}

export interface MenuItem {
  id: string
  slug: string
  price: string          // '500' — flat (base/default; the min when sizes/variants exist)
  sizes?: ItemOption[]   // same item, different size — S/M/L
  variants?: ItemOption[] // flavor/type variants — chocolate, caramel, pistachio …
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
  ph?: PlaceholderKind   // placeholder illustration kind — used when there's no real photo/video
  coffee?: CoffeeKind    // canonical coffee drink — fills `tastes` from COFFEE_TASTES via applyCoffeeTastes()
  i18n: I18nText
}

export interface MenuSection {
  key: TasteKey | TierKey | FoodKey
  type: 'cocktail' | 'food'
  /** Which view modes this section supports. Omit = both. e.g. ['list'] = list-only, no toggle. */
  views?: ('grid' | 'list')[]
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
  /** Currency shown with prices (venue-controlled). Prices themselves are plain numbers. */
  currency?: string
  sections: MenuSection[]
  foodSections: MenuSection[]
  pairings: Pairing[]
  foodPairings: FoodPairing[]
  featuredPick: FeaturedPick
  foodFeaturedPick?: FoodFeaturedPick
  tasteWhy?: Record<string, string>   // one concrete line per taste
}

/**
 * Fill each item's (and option's) posterSrc from its `ph` kind when it has no real
 * photo/video. Resolution order per item: real photo/video > placeholder-by-kind.
 * Mutates and returns the same object, so the render layer keeps reading posterSrc.
 */
export function applyPlaceholders(
  data: VenueMenuData,
  map: Partial<Record<PlaceholderKind, string>>,
): VenueMenuData {
  const fill = (items: MenuItem[]) => {
    for (const it of items) {
      const ph = it.ph ? map[it.ph] : undefined
      if (ph && !it.posterSrc && !it.videoSrc) it.posterSrc = ph
      for (const opt of [...(it.sizes ?? []), ...(it.variants ?? [])]) {
        if (ph && !opt.posterSrc) opt.posterSrc = ph
      }
    }
  }
  for (const s of data.sections) fill(s.items)
  for (const s of data.foodSections) fill(s.items)
  return data
}

/**
 * Shared taste profiles for the standard coffee menu. Primary axis first. Espresso-base
 * drinks are bitter; the two chocolates are sweet-led. Reusable across venues — tag each
 * coffee item with `coffee: <kind>` and run applyCoffeeTastes() on the venue data.
 */
export const COFFEE_TASTES: Record<CoffeeKind, TasteSpec[]> = {
  espresso:         [{ taste: 'bitter', lvl: 3 }],
  macchiato:        [{ taste: 'bitter', lvl: 2 }],
  americano:        [{ taste: 'bitter', lvl: 2 }],
  nescafe:          [{ taste: 'bitter', lvl: 2 }],
  'ice-coffee':     [{ taste: 'bitter', lvl: 2 }, { taste: 'sweet', lvl: 1 }],
  cappuccino:       [{ taste: 'bitter', lvl: 1 }, { taste: 'sweet', lvl: 1 }],
  'hot-chocolate':  [{ taste: 'sweet', lvl: 3 }, { taste: 'bitter', lvl: 1 }],
  'cold-chocolate': [{ taste: 'sweet', lvl: 3 }, { taste: 'bitter', lvl: 1 }],
}

/**
 * Fill each coffee-tagged item's `tastes` (and primary `lvl`) from COFFEE_TASTES, unless the
 * item already carries an explicit profile. Mutates and returns the same object.
 */
export function applyCoffeeTastes(data: VenueMenuData): VenueMenuData {
  const fill = (items: MenuItem[]) => {
    for (const it of items) {
      if (!it.coffee || it.tastes?.length) continue
      it.tastes = COFFEE_TASTES[it.coffee]
      if (it.lvl == null) it.lvl = it.tastes[0].lvl
    }
  }
  for (const s of data.sections) fill(s.items)
  for (const s of data.foodSections) fill(s.items)
  return data
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
    { id: 'aperol-spritz', slug: 'aperol-spritz', price: '550', glass: 'wine', lvl: 1,
      tastes: [{ taste: 'bitter', lvl: 1 }, { taste: 'sweet', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/aperol-spritz.jpg',
      i18n: { en: { name: 'Aperol Spritz', desc: 'Lightly bitter, lightly sweet. Light and easy. Aperol, prosecco, soda, orange. Opens slow, stays gentle.' } } },
    { id: 'negroni', slug: 'negroni', price: '850', glass: 'rocks', lvl: 2, house: true, loved: true,
      tastes: [{ taste: 'bitter', lvl: 2 }, { taste: 'sweet', lvl: 1 }],
      videoSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.mp4',
      posterSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.jpg',
      variants: [
        { label: 'Barrel-Aged Coconut', price: '1000', posterSrc: '/venue-assets/bottle-brothers/barrel-aged-coconut-negroni.jpg' },
        { label: 'Strawberry & Basil',  price: '850',  posterSrc: '/venue-assets/bottle-brothers/negroni-strawberry-basil.jpg' },
      ],
      i18n: { en: { name: 'Negroni', desc: 'Medium bitter, lightly sweet. Stirred over ice. Barrel-aged coconut — warm and tropical, or strawberry & basil — fruity and fresh.' } } },
    { id: 'campari-spritz', slug: 'campari-spritz', price: '550', glass: 'wine', lvl: 3,
      posterSrc: '/venue-assets/bottle-brothers/campari-spritz.jpg',
      i18n: { en: { name: 'Campari Spritz', desc: 'Strongly bitter. Sharp and dry. Campari, prosecco, soda. Bites from the first sip and holds it.' } } },
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
    { id: 'basil-smash', slug: 'basil-smash', price: '850', glass: 'rocks', lvl: 2, house: true,
      tastes: [{ taste: 'sour', lvl: 2 }, { taste: 'sweet', lvl: 2 }],
      posterSrc: '/venue-assets/bottle-brothers/basil-smash.jpg',
      i18n: { en: { name: 'Basil Smash', desc: 'Balanced sweet and sour. Fresh and green. Basil, gin, lemon. Clean through, opens easy.' } } },
    { id: 'talk-balkan-to-me', slug: 'talk-balkan-to-me', price: '1000', glass: 'collins', lvl: 2, loved: true,
      tastes: [{ taste: 'sour', lvl: 2 }, { taste: 'sweet', lvl: 1 }],
      videoSrc: '/venue-assets/bottle-brothers/talk-balkan-to-me.mp4',
      posterSrc: '/venue-assets/bottle-brothers/talk-balkan-to-me.jpg',
      i18n: { en: { name: 'Talk Balkan To Me', desc: 'Medium sour, lightly sweet. Fresh and floral. Chamomile gin, lemon, elderflower liqueur, soda, fig leaf. Starts soft, opens more sour at the end.' } } },
    { id: 'sea-salt-paloma', slug: 'sea-salt-paloma', price: '550', glass: 'collins', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/sea-salt-paloma.jpg',
      i18n: { en: { name: 'Sea Salt Paloma', desc: 'Medium sour, dry. Fresh and saline. Tequila, lime, yuzu liqueur, grapefruit soda, salt. Sparkling and crisp to the end.' } } },
    { id: 'limoncello-spritz', slug: 'limoncello-spritz', price: '550', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/limoncello-spritz.jpg',
      i18n: { en: { name: 'Limoncello Spritz', desc: 'Medium sour. Bright and fresh. Limoncello, prosecco, soda, mint. Citrus and green grass, crisp to the end.' } } },
    { id: 'brothers-spritz', slug: 'brothers-spritz', price: '850', glass: 'wine', lvl: 2, house: true,
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
    { id: 'hugo', slug: 'hugo', price: '550', glass: 'wine', lvl: 1,
      posterSrc: '/venue-assets/bottle-brothers/hugo.jpg',
      i18n: { en: { name: 'Hugo', desc: 'Lightly sweet. Fresh and floral. Elderflower, mint, prosecco, soda. Fizzy and light, opens slow.' } } },
    { id: 'pornstar-martini', slug: 'pornstar-martini', price: '850', glass: 'martini', lvl: 2, house: true, loved: true,
      videoSrc: '/venue-assets/bottle-brothers/pornstar-martini.mp4',
      posterSrc: '/venue-assets/bottle-brothers/pornstar-martini.jpg',
      i18n: { en: { name: 'Pornstar Martini', desc: 'Medium sweet. Exotic and fresh. Vanilla vodka, passion fruit, pineapple, almond syrup, cucumber. Soft and tropical, fresh on the finish.' } } },
    { id: 'lychee-spritz', slug: 'lychee-spritz', price: '550', glass: 'wine', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/lychee-spritz.jpg',
      i18n: { en: { name: 'Lychee Spritz', desc: 'Medium sweet, lightly sour. Soft and floral. Lychee liqueur, mint, prosecco, soda. Delicate, opens light.' } } },
    { id: 'hibiscus-spritz', slug: 'hibiscus-spritz', price: '550', glass: 'wine', lvl: 2,
      posterSrc: '/venue-assets/bottle-brothers/hibiscus-spritz.jpg',
      i18n: { en: { name: 'Hibiscus Spritz', desc: 'Medium sweet. Bright and fresh. Hibiscus cordial, prosecco, soda. Citrus and mint, clean to the end.' } } },
    { id: 'martini-royal', slug: 'martini-royal', price: '550', glass: 'wine', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/martini-royal.jpg',
      i18n: { en: { name: 'Martini Royal', desc: 'Medium sweet, lightly sour. Fresh and floral. White Martini, prosecco, mint, citrus. Fizzy, opens light.' } } },
    { id: 'cherry-poppins', slug: 'cherry-poppins', price: '550', glass: 'collins', lvl: 2,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      videoSrc: '/venue-assets/bottle-brothers/cherry-poppins.mp4',
      posterSrc: '/venue-assets/bottle-brothers/cherry-poppins.jpg',
      i18n: { en: { name: 'Cherry Poppins', desc: 'Medium sweet, lightly sour. Soft and nutty. Amaretto, hibiscus and cherry cordial, mint, lime, ginger. Cherry leads, nuts on the finish.' } } },
    // glass: CSV says martini, but the venue photo is clearly a coupe — photo wins
    { id: 'miss-lavander', slug: 'miss-lavander', price: '850', glass: 'coupe', lvl: 2, house: true,
      tastes: [{ taste: 'sweet', lvl: 2 }, { taste: 'sour', lvl: 1 }],
      posterSrc: '/venue-assets/bottle-brothers/miss-lavander.jpg',
      i18n: { en: { name: 'Miss Lavander', desc: 'Medium sweet, lightly sour. Floral and fresh. Lavender-infused lychee liqueur, elderflower, grapefruit juice, rose water. Balanced through, opens with a touch of rose.' } } },
    // shares the Brothers Mule poster for now — swap when a real Tiki Tonka shot arrives
    { id: 'tiki-tonka', slug: 'tiki-tonka', price: '850', glass: 'collins', lvl: 2, house: true,
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: 'Tiki Tonka', desc: 'Medium sweet. Tropical and warm. Tonka-infused rum blend, amaretto, vanilla, lime, pineapple. Opens with coffee and chocolate at the end.' } } },
    { id: 'aloe-you-vera-much', slug: 'aloe-you-vera-much', price: '850', glass: 'collins', lvl: 2, house: true,
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
    { id: 'brothers-mule', slug: 'brothers-mule', price: '850', glass: 'collins', house: true,
      tastes: [{ taste: 'sour', lvl: 2 }],
      posterSrc: '/venue-assets/bottle-brothers/brothers-mule.jpg',
      i18n: { en: { name: "Brother's Mule", desc: 'Medium sour, spicy. Fresh and fizzy. Cucumber and basil vodka, lime, ginger beer, bitters. Ginger hits first, dry to the end.' } } },
    { id: 'tierra-del-fuego', slug: 'tierra-del-fuego', price: '850', glass: 'rocks', house: true, loved: true,
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
    { id: 'virgin-hugo', slug: 'virgin-hugo', price: '450', glass: 'wine', flavor: 'sweet',
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Virgin Hugo', desc: 'Lightly sweet. Fresh and floral. Elderflower syrup, mint, soda. All the lift of the Hugo, none of the gin.' } } },
    { id: 'passion-pop', slug: 'passion-pop', price: '450', glass: 'collins', flavor: 'sweet', loved: true,
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Passion Pop', desc: 'Medium sweet. Bright and tropical. Passion fruit, pineapple, lemon, sparkling water. Fruity and fizzy to the end.' } } },
    { id: 'virgin-mojito', slug: 'virgin-mojito', price: '450', glass: 'collins', flavor: 'sour',
      posterSrc: '/venue-assets/bottle-brothers/mocktail-placeholder.jpg',
      i18n: { en: { name: 'Virgin Mojito', desc: 'Lightly sour. Cool and clean. Lime, mint, soda. Crisp to the end.' } } },
    { id: 'hibiscus-ruby', slug: 'hibiscus-ruby', price: '450', glass: 'collins', flavor: 'sour',
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
    { id: 'margherita', slug: 'margherita', price: '600', glass: 'wine',
      profile: { rich: 1, salt: 1 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Margherita', desc: 'Tomato sauce, mozzarella, basil' } } },
    { id: 'bi-bi', slug: 'bi-bi', price: '1000', glass: 'wine',
      profile: { rich: 2, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/bi-bi.jpg',
      i18n: { en: { name: 'Bi-Bi', desc: 'Tomato sauce, mozzarella, chicken ham, arugula, Grana cheese' } } },
    { id: 'capricciosa', slug: 'capricciosa', price: '700', glass: 'wine',
      profile: { rich: 2, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Capricciosa', desc: 'Tomato sauce, mozzarella, ham, mushrooms, olives' } } },
    { id: '4-formaggi', slug: '4-formaggi', price: '750', glass: 'wine',
      profile: { rich: 3, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: '4 Formaggi', desc: 'Tomato sauce, mozzarella, Gouda, provolone, gorgonzola' } } },
    { id: 'diavola', slug: 'diavola', price: '650', glass: 'wine',
      profile: { rich: 2, salt: 2, spicy: true },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Diavola', desc: 'Tomato sauce, mozzarella, basil, spicy salami, spicy sauce' } } },
    { id: 'deliziosa', slug: 'deliziosa', price: '800', glass: 'wine',
      profile: { rich: 2, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Deliziosa', desc: 'Mozzarella, prosciutto crudo, cherry tomatoes, arugula, Grana cheese' } } },
    { id: 'cotto-e-funghi', slug: 'cotto-e-funghi', price: '700', glass: 'wine',
      profile: { rich: 3, salt: 2 },
      posterSrc: '/venue-assets/bottle-brothers/pizza-placeholder.jpg',
      i18n: { en: { name: 'Cotto e Funghi', desc: 'Tomato sauce, mozzarella, wurstel sausage, potatoes' } } },
    { id: 'americana', slug: 'americana', price: '650', glass: 'wine',
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
    { id: 'finger-food-mix', slug: 'finger-food-mix', price: '1000', glass: 'wine',
      profile: { rich: 3, salt: 3 },
      posterSrc: '/venue-assets/bottle-brothers/board-placeholder.jpg',
      i18n: { en: { name: 'Finger Food Mix', desc: 'Chicken nuggets, onion rings, potato croquettes, and French fries' } } },
    { id: 'cured-meats-cheese-platter', slug: 'cured-meats-cheese-platter', price: '1400', glass: 'wine',
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
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'deliziosa', price: '800' }, { itemRef: 'cured-meats-cheese-platter', price: '1400' }],
    i18n: { en: { wisdom: 'A little bitterness and the bubbles cut straight through fat. The classic aperitivo board never misses.' } } },
  { cocktailRef: 'campari-spritz',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'americana', price: '650' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Sharper and redder, it stands up to the saltiest, richest bites on the table.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'negroni',
    dishes: [{ itemRef: '4-formaggi', price: '750' }, { itemRef: 'cured-meats-cheese-platter', price: '1400' }, { itemRef: 'capricciosa', price: '700' }],
    i18n: { en: { wisdom: 'The bitter side cuts straight through cheese and cured fat — give either pour a plate with weight.' } } },
  { cocktailRef: 'aloe-you-vera-much',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'bi-bi', price: '1000' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Fresh and green, it stays out of the way of a simple plate and refreshes between bites.' } } },
  { cocktailRef: 'basil-smash',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'deliziosa', price: '800' }, { itemRef: '4-formaggi', price: '750' }],
    i18n: { en: { wisdom: 'Basil in the glass, basil on the pizza, they were always going to get along.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'sea-salt-paloma',
    dishes: [{ itemRef: 'finger-food-mix', price: '1000' }, { itemRef: 'diavola', price: '650' }, { itemRef: 'cured-meats-cheese-platter', price: '1400' }],
    i18n: { en: { wisdom: 'Salt meets salt, and grapefruit resets your mouth between the fried bites.' } } },
  { cocktailRef: 'talk-balkan-to-me',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'deliziosa', price: '800' }, { itemRef: 'bi-bi', price: '1000' }],
    i18n: { en: { wisdom: 'Floral and light, it stays out of the way of a fresh plate and lifts the arugula.' } } },
  { cocktailRef: 'hugo',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'deliziosa', price: '800' }, { itemRef: 'bi-bi', price: '1000' }],
    i18n: { en: { wisdom: 'Light and herbal, it keeps a fresh pizza tasting fresh.' } } },
  { cocktailRef: 'limoncello-spritz',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'bi-bi', price: '1000' }, { itemRef: 'diavola', price: '650' }],
    i18n: { en: { wisdom: 'Lemon cuts grease, and the sweetness softens a little chili heat.' } } },
  { cocktailRef: 'lychee-spritz',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'bi-bi', price: '1000' }, { itemRef: 'deliziosa', price: '800' }],
    i18n: { en: { wisdom: 'Floral and soft, it cools a slice down and likes the lighter plates.' } } },
  { cocktailRef: 'brothers-spritz',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'margherita', price: '600' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Passion fruit is sweet enough to calm a little chili heat.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'hibiscus-spritz',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'capricciosa', price: '700' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Bubbles cut the fat, and the sweetness takes the edge off the chilli.' } } },
  { cocktailRef: 'martini-royal',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'deliziosa', price: '800' }, { itemRef: 'bi-bi', price: '1000' }],
    i18n: { en: { wisdom: 'Fizzy and floral, it keeps a fresh pizza tasting fresh.' } } },
  { cocktailRef: 'cherry-poppins',
    dishes: [{ itemRef: 'cured-meats-cheese-platter', price: '1400' }, { itemRef: '4-formaggi', price: '750' }, { itemRef: 'capricciosa', price: '700' }],
    i18n: { en: { wisdom: 'Cherry and almond do beside a cheese board what fruit preserve has always done.' } } },
  { cocktailRef: 'miss-lavander',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'bi-bi', price: '1000' }, { itemRef: 'deliziosa', price: '800' }],
    i18n: { en: { wisdom: 'Delicate and floral, it likes a light plate that will not shout over it.' } } },
  { cocktailRef: 'pornstar-martini',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'finger-food-mix', price: '1000' }, { itemRef: 'capricciosa', price: '700' }],
    i18n: { en: { wisdom: 'Sweet and exotic, it softens heat and salt at the same time.' } } },
  { cocktailRef: 'tiki-tonka',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'americana', price: '650' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Tropical and strong, it can take on smoke and spice.' } } },
  { cocktailRef: 'brothers-mule',
    dishes: [{ itemRef: 'americana', price: '650' }, { itemRef: 'finger-food-mix', price: '1000' }, { itemRef: 'cotto-e-funghi', price: '700' }],
    i18n: { en: { wisdom: 'Ginger and ice cool things off, so a heavy, savory plate feels easy.' } } },
  { cocktailRef: 'tierra-del-fuego',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'cured-meats-cheese-platter', price: '1400' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Heat meets heat, or let the cheese cool it down, your call.' } } },
  { cocktailRef: 'virgin-hugo',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: 'bi-bi', price: '1000' }, { itemRef: 'deliziosa', price: '800' }],
    i18n: { en: { wisdom: 'All the lift of the Hugo, same love for a fresh pizza.' } } },
  { cocktailRef: 'passion-pop',
    dishes: [{ itemRef: 'diavola', price: '650' }, { itemRef: 'margherita', price: '600' }, { itemRef: 'finger-food-mix', price: '1000' }],
    i18n: { en: { wisdom: 'Bright and tropical, it cools a spicy bite.' } } },
  // TODO(bb-csv): fill dishes + wisdom
  { cocktailRef: 'virgin-mojito',
    dishes: [{ itemRef: 'finger-food-mix', price: '1000' }, { itemRef: 'diavola', price: '650' }, { itemRef: 'margherita', price: '600' }],
    i18n: { en: { wisdom: 'Lime and mint cool the heat and cut through anything fried.' } } },
  { cocktailRef: 'hibiscus-ruby',
    dishes: [{ itemRef: 'margherita', price: '600' }, { itemRef: '4-formaggi', price: '750' }, { itemRef: 'bi-bi', price: '1000' }],
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
  { dishRef: '4-formaggi', cocktailRefs: ['tierra-del-fuego', 'negroni', 'campari-spritz'],
    i18n: { en: { why: 'Bitter cuts the fat.' } } },
  { dishRef: 'diavola', cocktailRefs: ['lychee-spritz', 'martini-royal', 'cherry-poppins'],
    i18n: { en: { why: 'Sweet cools the chilli.' } } },
  { dishRef: 'deliziosa', cocktailRefs: ['negroni', 'basil-smash', 'tierra-del-fuego'],
    i18n: { en: { why: 'Citrus cuts the salt.' } } },
  { dishRef: 'cotto-e-funghi', cocktailRefs: ['limoncello-spritz', 'brothers-mule', 'brothers-spritz'],
    i18n: { en: { why: 'Sour cuts the starch.' } } },
  { dishRef: 'americana', cocktailRefs: ['aperol-spritz', 'campari-spritz', 'talk-balkan-to-me'],
    i18n: { en: { why: 'Sour cuts the starch.' } } },
  { dishRef: 'bi-bi', cocktailRefs: ['campari-spritz', 'negroni'],
    i18n: { en: { why: 'Bitter cuts through it.' } } },
  { dishRef: 'finger-food-mix', cocktailRefs: ['negroni', 'miss-lavander', 'aloe-you-vera-much'],
    i18n: { en: { why: 'Bitter cuts the fat.' } } },
  { dishRef: 'cured-meats-cheese-platter', cocktailRefs: ['negroni', 'basil-smash', 'tierra-del-fuego'],
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
  currency: 'L',
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
