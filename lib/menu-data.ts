/**
 * Canonical BB menu data — source until Supabase is wired.
 * All text fields wrapped in i18n. Only en seeded; sq/it added additively.
 * Lifted verbatim from BB Menu Mobile v2.dc.html and reshaped to DEC-010.
 */

export type GlassType = 'wine' | 'collins' | 'rocks' | 'martini' | 'coupe'
export type TasteKey = 'bitter' | 'sour' | 'sweet' | 'spicy' | 'zero'
export type FoodKey = 'pizza' | 'burgers' | 'sharing'
export type Locale = string

export interface I18nText {
  [locale: string]: { name: string; desc: string }
}

export interface MenuItem {
  id: string
  slug: string
  price: string          // 'L500' — flat
  glass: GlassType
  lvl?: 1 | 2 | 3       // intensity marks (bitter/sour/sweet)
  flavor?: 'sweet' | 'sour' // zero items only
  loved?: boolean
  house?: boolean
  videoSrc?: string
  posterSrc?: string
  i18n: I18nText
}

export interface MenuSection {
  key: TasteKey | FoodKey
  type: 'cocktail' | 'food'
  i18n: { [locale: string]: { label: string; sub: string } }
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

export interface VenueMenuData {
  sections: MenuSection[]
  foodSections: MenuSection[]
  pairings: Pairing[]
  foodPairings: FoodPairing[]
  featuredPick: FeaturedPick
  tasteWhy?: Record<string, { lead: string; post: string }>
}

// ---------------------------------------------------------------------------
// BB cocktail sections
// ---------------------------------------------------------------------------

const bitter: MenuSection = {
  key: 'bitter',
  type: 'cocktail',
  i18n: { en: { label: 'Bitter', sub: 'Grown-up and bittersweet, the before-dinner ones' } },
  items: [
    { id: 'aperol-spritz', slug: 'aperol-spritz', price: 'L500', glass: 'wine', lvl: 1, loved: true,
      videoSrc: '/venue-assets/bottle-brothers/bb-cocktail-1.webm',
      posterSrc: '/venue-assets/bottle-brothers/cocktail-placeholder.png',
      i18n: { en: { name: 'Aperol Spritz', desc: 'Light and bittersweet, with the fizz of an evening in no hurry.' } } },
    { id: 'campari-spritz', slug: 'campari-spritz', price: 'L500', glass: 'wine', lvl: 2,
      i18n: { en: { name: 'Campari Spritz', desc: 'Sharper and redder than the Aperol, a little more sure of itself.' } } },
    { id: 'sbagliato', slug: 'sbagliato', price: 'L500', glass: 'wine', lvl: 2,
      i18n: { en: { name: 'Sbagliato', desc: 'The mistake that became a classic: a Negroni that swapped gin for bubbles.' } } },
    { id: 'americano', slug: 'americano', price: 'L500', glass: 'collins', lvl: 2,
      i18n: { en: { name: 'Americano', desc: 'Campari and vermouth, stretched long over soda. Paces you for the night.' } } },
    { id: 'negroni', slug: 'negroni', price: 'L500', glass: 'rocks', lvl: 3,
      i18n: { en: { name: 'Negroni', desc: 'Three equal parts, none backing down. Bitter, warm, grown-up.' } } },
    { id: 'negroni-fico', slug: 'negroni-fico', price: 'L750', glass: 'rocks', lvl: 3, house: true,
      i18n: { en: { name: 'Negroni Fico', desc: 'A Negroni in a suit: fig softens it, rosemary perfumes it, character stays.' } } },
    { id: 'barrel-aged-coconut-negroni', slug: 'barrel-aged-coconut-negroni', price: 'L1000', glass: 'rocks', lvl: 3, house: true,
      i18n: { en: { name: 'Barrel-Aged Coconut Negroni', desc: 'Aged a full month in our own barrel. Coconut rounds it, Campari keeps it honest. The one we are proudest of.' } } },
  ],
}

const sour: MenuSection = {
  key: 'sour',
  type: 'cocktail',
  i18n: { en: { label: 'Sour', sub: 'Bright and sharp, wakes you up' } },
  items: [
    { id: 'bergamot-spritz', slug: 'bergamot-spritz', price: 'L500', glass: 'wine', lvl: 1,
      i18n: { en: { name: 'Bergamot Spritz', desc: 'Bergamot, lemon and a whisper of basil. Fresh, a little fancy.' } } },
    { id: 'aki-sensei', slug: 'aki-sensei', price: 'L750', glass: 'collins', lvl: 2, house: true,
      i18n: { en: { name: 'Aki Sensei', desc: 'Wins you with aroma, deceives you with freshness, then hits you with the gin.' } } },
    { id: 'aloe-you-vera-much', slug: 'aloe-you-vera-much', price: 'L750', glass: 'collins', lvl: 2, house: true,
      i18n: { en: { name: 'Aloe You Vera Much', desc: "Fresh and full of humor. Like that message you shouldn't have sent." } } },
    { id: 'basil-smash', slug: 'basil-smash', price: 'L750', glass: 'rocks', lvl: 2, house: true, loved: true,
      i18n: { en: { name: 'Basil Smash', desc: "Where even those who can't stand vegetables make an exception with a smile." } } },
    { id: 'afro-hu-pak', slug: 'afro-hu-pak', price: 'L750', glass: 'collins', lvl: 3, house: true,
      i18n: { en: { name: 'Afro-Hu Pak', desc: 'Relaxes, pampers, reminds you autumn has its own charm.' } } },
  ],
}

const sweet: MenuSection = {
  key: 'sweet',
  type: 'cocktail',
  i18n: { en: { label: 'Sweet', sub: 'Fruit-forward and easy, the crowd-pleasers' } },
  items: [
    { id: 'hugo', slug: 'hugo', price: 'L500', glass: 'wine', lvl: 1,
      i18n: { en: { name: 'Hugo', desc: 'Elderflower and mint, barely there. For talking, not drinking fast.' } } },
    { id: 'limoncello-spritz', slug: 'limoncello-spritz', price: 'L500', glass: 'wine', lvl: 2,
      i18n: { en: { name: 'Limoncello Spritz', desc: 'Sweet lemon and mint, bright as the Amalfi coast.' } } },
    { id: 'lychee-spritz', slug: 'lychee-spritz', price: 'L500', glass: 'wine', lvl: 2,
      i18n: { en: { name: 'Lychee Spritz', desc: 'Lychee and mint, soft, floral, far too easy to repeat.' } } },
    { id: 'brothers-spritz', slug: 'brothers-spritz', price: 'L750', glass: 'wine', lvl: 2, house: true,
      i18n: { en: { name: 'Brothers Spritz', desc: 'Summer to the table even when winter knocks. Passion fruit, but feelings? Not today.' } } },
    { id: 'valle-e-dardhes', slug: 'valle-e-dardhes', price: 'L750', glass: 'coupe', lvl: 2, house: true,
      i18n: { en: { name: 'Vallë E Dardhës', desc: 'Soft, fragrant and dangerously seductive.' } } },
    { id: 'miss-lavander', slug: 'miss-lavander', price: 'L750', glass: 'coupe', lvl: 2, house: true,
      i18n: { en: { name: 'Miss Lavander', desc: 'Delicate as a caress, decisive as an unforgettable gaze.' } } },
    { id: 'pornstar-martini', slug: 'pornstar-martini', price: 'L750', glass: 'martini', lvl: 3, house: true, loved: true,
      i18n: { en: { name: 'Pornstar Martini', desc: 'Seductive, yet restrained. Exotic, yet not overdone.' } } },
    { id: 'tiki-tonka', slug: 'tiki-tonka', price: 'L750', glass: 'collins', lvl: 3, house: true, loved: true,
      i18n: { en: { name: 'Tiki Tonka', desc: "Straight to the beaches of the Maldives. Drink the second and you won't know where you parked." } } },
  ],
}

const spicy: MenuSection = {
  key: 'spicy',
  type: 'cocktail',
  i18n: { en: { label: 'Spicy', sub: 'A little heat' } },
  items: [
    { id: 'brothers-mule', slug: 'brothers-mule', price: 'L750', glass: 'collins', house: true,
      i18n: { en: { name: "Brother's Mule", desc: 'Like a spa, but with vodka and ice.' } } },
    { id: 'tierra-del-fuego', slug: 'tierra-del-fuego', price: 'L750', glass: 'rocks', house: true,
      i18n: { en: { name: 'Tierra Del Fuego', desc: "A Mexican twist with a hint of temptation. A dance that doesn't stop after the first glass." } } },
  ],
}

const zero: MenuSection = {
  key: 'zero',
  type: 'cocktail',
  i18n: { en: { label: 'Zero', sub: 'No alcohol, same hands, same care' } },
  items: [
    { id: 'virgin-hugo', slug: 'virgin-hugo', price: 'L450', glass: 'wine', flavor: 'sweet',
      i18n: { en: { name: 'Virgin Hugo', desc: 'Elderflower and mint, all of the lift and none of the gin.' } } },
    { id: 'passion-pop', slug: 'passion-pop', price: 'L450', glass: 'collins', flavor: 'sweet', loved: true,
      i18n: { en: { name: 'Passion Pop', desc: 'Passion fruit and almond, bright and a little tropical.' } } },
    { id: 'red-kiss', slug: 'red-kiss', price: 'L450', glass: 'coupe', flavor: 'sweet',
      i18n: { en: { name: 'Red Kiss', desc: 'Red fruit and cherry, sweet and uncomplicated.' } } },
    { id: 'hibiscus-ruby', slug: 'hibiscus-ruby', price: 'L450', glass: 'collins', flavor: 'sour',
      i18n: { en: { name: 'Hibiscus Ruby', desc: 'Hibiscus and lemon, tart and ruby-bright.' } } },
  ],
}

// ---------------------------------------------------------------------------
// BB food sections
// ---------------------------------------------------------------------------

const pizza: MenuSection = {
  key: 'pizza',
  type: 'food',
  i18n: { en: { label: 'Pizza', sub: '' } },
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
  i18n: { en: { label: 'Burgers', sub: '' } },
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
  i18n: { en: { label: 'Sharing', sub: '' } },
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
  { cocktailRef: 'sbagliato',
    dishes: [{ itemRef: 'capricciosa', price: 'L700' }, { itemRef: 'cotto-e-funghi', price: 'L700' }, { itemRef: 'americana', price: 'L650' }],
    i18n: { en: { wisdom: 'Bubbles cleanse, bitterness balances fat, and the umami of mushroom finds the Campari.' } } },
  { cocktailRef: 'americano',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'capricciosa', price: 'L700' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Long and easy on the palate, it leaves room for one more slice.' } } },
  { cocktailRef: 'negroni',
    dishes: [{ itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Bitter cuts straight through rich cheese and fat. The heavy plate likes the intense glass.' } } },
  { cocktailRef: 'negroni-fico',
    dishes: [{ itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Fig and rosemary find the rind of a salty cheese and make friends.' } } },
  { cocktailRef: 'barrel-aged-coconut-negroni',
    dishes: [{ itemRef: 'brothers-burger', price: 'L700' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'A month in oak gives it real body, so give it a plate with weight. Smoke likes the intense.' } } },
  { cocktailRef: 'bergamot-spritz',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'deliziosa', price: 'L800' }],
    i18n: { en: { wisdom: 'Citrus and basil wake up a simple, fresh plate. Light likes light.' } } },
  { cocktailRef: 'aki-sensei',
    dishes: [{ itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'cotto-e-funghi', price: 'L700' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'All that citrus resets your mouth between bites of cheese.' } } },
  { cocktailRef: 'aloe-you-vera-much',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }, { itemRef: 'finger-food-mix', price: 'L1000' }],
    i18n: { en: { wisdom: 'Fresh and green, it stays out of the way of a simple plate and refreshes between bites.' } } },
  { cocktailRef: 'basil-smash',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: '4-formaggi', price: 'L750' }],
    i18n: { en: { wisdom: 'Basil in the glass, basil on the pizza, they were always going to get along.' } } },
  { cocktailRef: 'afro-hu-pak',
    dishes: [{ itemRef: 'americana', price: 'L650' }, { itemRef: 'brothers-burger', price: 'L700' }, { itemRef: 'cured-meats-cheese-platter', price: 'L1400' }],
    i18n: { en: { wisdom: 'Acidity balances the fat and the warmth matches an intense, savory slice.' } } },
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
  { cocktailRef: 'valle-e-dardhes',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'deliziosa', price: 'L800' }, { itemRef: 'chicken-burger', price: 'L600' }],
    i18n: { en: { wisdom: 'Pear and lime stay soft, so they sit beside a fresh plate without a fight.' } } },
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
  { cocktailRef: 'red-kiss',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: 'chicken-burger', price: 'L600' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Sweet and simple, it keeps good company with a light, savory plate.' } } },
  { cocktailRef: 'hibiscus-ruby',
    dishes: [{ itemRef: 'margherita', price: 'L600' }, { itemRef: '4-formaggi', price: 'L750' }, { itemRef: 'bi-bi', price: 'L1000' }],
    i18n: { en: { wisdom: 'Tart and ruby, it freshens up anything savory and likes cheese.' } } },
]

// ---------------------------------------------------------------------------
// Food pairings: dish → 3 cocktails
// ---------------------------------------------------------------------------

export const foodPairings: FoodPairing[] = [
  { dishRef: 'margherita', cocktailRefs: ['aperol-spritz', 'hugo', 'bergamot-spritz'],
    i18n: { en: { why: 'Light and fresh, so the glass stays light and fresh too.' } } },
  { dishRef: 'capricciosa', cocktailRefs: ['sbagliato', 'americano', 'negroni'],
    i18n: { en: { why: 'Bitter and bubbles cut straight through the loaded toppings.' } } },
  { dishRef: '4-formaggi', cocktailRefs: ['negroni', 'aki-sensei', 'sbagliato'],
    i18n: { en: { why: 'Bitter cuts the fat, sour loves cheese, bubbles cleanse.' } } },
  { dishRef: 'diavola', cocktailRefs: ['brothers-spritz', 'pornstar-martini', 'limoncello-spritz'],
    i18n: { en: { why: 'Sweet calms the chili heat.' } } },
  { dishRef: 'deliziosa', cocktailRefs: ['aperol-spritz', 'hugo', 'basil-smash'],
    i18n: { en: { why: 'Light and herbal next to a fresh, simple plate.' } } },
  { dishRef: 'cotto-e-funghi', cocktailRefs: ['sbagliato', 'aki-sensei', 'negroni'],
    i18n: { en: { why: 'The umami of mushroom finds the bitter.' } } },
  { dishRef: 'americana', cocktailRefs: ['campari-spritz', 'sbagliato', 'afro-hu-pak'],
    i18n: { en: { why: 'Bitter, bubbles and a little sour cut the fat.' } } },
  { dishRef: 'bi-bi', cocktailRefs: ['bergamot-spritz', 'hugo', 'limoncello-spritz'],
    i18n: { en: { why: 'Light and fresh, so the glass keeps it light.' } } },
  { dishRef: 'classic-burger', cocktailRefs: ['negroni', 'campari-spritz', 'brothers-mule'],
    i18n: { en: { why: 'Bitter cuts the fat, and one long drink cleanses.' } } },
  { dishRef: 'chicken-burger', cocktailRefs: ['lychee-spritz', 'aloe-you-vera-much', 'bergamot-spritz'],
    i18n: { en: { why: 'Lighter meat asks for lighter, fresher glasses.' } } },
  { dishRef: 'brothers-burger', cocktailRefs: ['negroni', 'barrel-aged-coconut-negroni', 'afro-hu-pak'],
    i18n: { en: { why: 'Smoky and rich, so intense bitter and sour stand up to it.' } } },
  { dishRef: 'finger-food-mix', cocktailRefs: ['aperol-spritz', 'campari-spritz', 'pornstar-martini'],
    i18n: { en: { why: 'Aperitivo bubbles, and one sweet for the table.' } } },
  { dishRef: 'cured-meats-cheese-platter', cocktailRefs: ['negroni', 'aki-sensei', 'negroni-fico'],
    i18n: { en: { why: 'Bitter cuts the fat, sour loves the cheese.' } } },
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
