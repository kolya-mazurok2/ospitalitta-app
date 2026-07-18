/**
 * getPublishedMenu — data abstraction layer (DEC-004, DEC-005).
 * Dual-mode: venues in DB_VENUES read sections/items from Supabase via a tagged fetch
 * (→ Vercel Data Cache). Everything else — and any Supabase miss/error — falls back to
 * the static *-data.ts. Venue-level extras (pairings/featured) stay static for now and
 * are merged in at read time (one merge point; moves to DB later).
 */
import { bbMenuData, type VenueMenuData, type MenuSection, type MenuItem } from './menu-data'
import { salyMenuData } from './saly-data'
import { coteMenuData } from './cote-data'

const menuData: Record<string, VenueMenuData> = {
  'bottle-brothers': bbMenuData,
  'saly': salyMenuData,
  'cote': coteMenuData,
}

// Venues whose sections/items live in Supabase. The rest stay on static data.
const DB_VENUES = new Set(['saly'])

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export async function getPublishedMenu(slug: string): Promise<VenueMenuData | null> {
  if (hasSupabaseEnv && DB_VENUES.has(slug)) {
    try {
      const fromDb = await fetchMenuFromSupabase(slug)
      if (fromDb) return fromDb
    } catch (err) {
      console.error(`[getPublishedMenu] Supabase read failed for "${slug}", using static fallback:`, err)
    }
  }
  return menuData[slug] ?? null
}

// ----- Supabase read (DEC-004: raw tagged fetch to PostgREST, edge-friendly) -----
// Conversion lives here so the guest contract (VenueMenuData/MenuSection/MenuItem) is unchanged:
//  - DB menu_category (2-level tree) → MenuSection[] with `type` derived from the top-level ancestor
//  - DB price_minor + venue.currency → the legacy 'L600' display string (until guest goes numeric, B5)

interface ItemRow {
  id: string; slug: string
  price_minor: number | null; price_unit: string | null
  glass: string | null; lvl: number | null; flavor: string | null
  loved: boolean | null; house: boolean | null; badge: string | null
  image_url: string | null; video_url: string | null
  sort_order: number; i18n: MenuItem['i18n']
}
interface CategoryRow {
  id: string; parent_id: string | null; key: string; sort_order: number
  i18n: MenuSection['i18n']; menu_item: ItemRow[]
}

// minor units → legacy guest display string. 'L' prefix is Lek-specific until the guest goes numeric.
const CURRENCY_DECIMALS: Record<string, number> = { ALL: 0, EUR: 2, USD: 2 }
function composeDisplayPrice(minor: number | null, currency: string, unit: string | null): string {
  if (minor == null) return ''
  const decimals = CURRENCY_DECIMALS[currency] ?? 0
  const amount = decimals === 0 ? String(minor) : (minor / 10 ** decimals).toFixed(decimals)
  return `L${amount}${unit ? `/${unit}` : ''}`
}

function mapItem(r: ItemRow, currency: string): MenuItem {
  return {
    id: r.id,
    slug: r.slug,
    price: composeDisplayPrice(r.price_minor, currency, r.price_unit),
    glass: (r.glass ?? undefined) as MenuItem['glass'],
    lvl: (r.lvl ?? undefined) as MenuItem['lvl'],
    flavor: (r.flavor ?? undefined) as MenuItem['flavor'],
    loved: r.loved ?? undefined,
    house: r.house ?? undefined,
    badge: r.badge ?? undefined,
    videoSrc: r.video_url ?? undefined,
    posterSrc: r.image_url ?? undefined,
    i18n: r.i18n ?? {},
  }
}

async function pgFetch<T>(path: string, slug: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
    next: { tags: [`venue:${slug}`] },
  })
  if (!res.ok) throw new Error(`PostgREST ${res.status}: ${await res.text()}`)
  return res.json() as Promise<T>
}

interface GetMenuPayload {
  venue: { id: string; currency: string | null }
  categories: CategoryRow[]
}

async function fetchMenuFromSupabase(slug: string): Promise<VenueMenuData | null> {
  // Single guarded read path (migration 0002): tables are not anon-readable — the whole
  // menu comes from the get_menu(slug) RPC, which requires a slug (no enumeration surface).
  // GET on a STABLE function → still cacheable + taggable (DEC-004).
  const payload = await pgFetch<GetMenuPayload | null>(
    `rpc/get_menu?p_slug=${encodeURIComponent(slug)}`, slug)
  const v = payload?.venue
  if (!v) return null
  const currency = v.currency ?? 'ALL'

  const cats = payload!.categories ?? []

  // Top-level categories (parent_id null) are the Drinks/Food buckets; their key is the section type.
  const typeByTop: Record<string, MenuSection['type']> = {}
  for (const c of cats) {
    if (c.parent_id == null) typeByTop[c.id] = c.key === 'food' ? 'food' : 'cocktail'
  }

  const children = cats.filter(c => c.parent_id != null).sort((a, b) => a.sort_order - b.sort_order)
  const toSection = (c: CategoryRow): MenuSection => ({
    key: c.key as MenuSection['key'],
    type: typeByTop[c.parent_id as string] ?? 'cocktail',
    i18n: c.i18n ?? {},
    items: [...(c.menu_item ?? [])].sort((a, b) => a.sort_order - b.sort_order).map(i => mapItem(i, currency)),
  })

  // Static merge: venue-level extras not yet in the DB.
  const stat = menuData[slug]
  return {
    sections: children.filter(c => typeByTop[c.parent_id as string] === 'cocktail').map(toSection),
    foodSections: children.filter(c => typeByTop[c.parent_id as string] === 'food').map(toSection),
    pairings: stat?.pairings ?? [],
    foodPairings: stat?.foodPairings ?? [],
    featuredPick: stat?.featuredPick ?? { cocktailRef: '' },
    foodFeaturedPick: stat?.foodFeaturedPick,
    tasteWhy: stat?.tasteWhy,
  }
}

export interface VenueBrand {
  themeAttr: string
  stylesheet: string
  fonts: Array<{ family: string; href: string }>
}

export interface VenueOnboarding {
  pricesNote: string
  welcome?: Record<string, string>  // locale → intro text, shown above legend rows
}

export interface VenueConfig {
  slug: string
  name: string
  locales: string[]
  defaultLocale: string
  brand: VenueBrand
  onboarding: VenueOnboarding
  logoSrc?: string       // image path — use when venue has a logo file
  logoText?: string      // text wordmark — use when venue wordmark is live type (e.g. Côte)
  defaultCategory?: 'cocktails' | 'drinks' | 'food'
  drinksCategoryLabel?: 'cocktails' | 'drinks'  // label for left category tab (default: 'cocktails')
  forceCompact?: boolean  // always render items in compact list mode, hide view toggle
  houseIndicator?: 'olive' | 'shell' | 'fish'
  showCocktailGuide?: boolean
  backgroundTheme?: 'seafood' | 'cocktail' | 'patisserie' | 'none'
  headerDecor?: string
  headerDecorLeft?: string
}

const venues: Record<string, VenueConfig> = {
  'saly': {
    slug: 'saly',
    name: 'Saly',
    locales: ['en', 'sq', 'it', 'pl', 'uk', 'de', 'fr', 'no'],
    defaultLocale: 'en',
    brand: {
      themeAttr: 'saly',
      stylesheet: '/themes/saly.css',
      fonts: [
        { family: 'Cormorant Garamond', href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&display=swap' },
        { family: 'Hanken Grotesk', href: 'https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500&display=swap' },
      ],
    },
    logoSrc: '/venue-assets/saly/saly-inverse-pine-on-sand.png',
    defaultCategory: 'food',
    houseIndicator: 'fish',
    showCocktailGuide: false,
    backgroundTheme: 'seafood',
    headerDecor: '/decor/seafood/snapper-2.png',
    onboarding: {
      pricesNote: 'Prices in Lekë',
    },
  },
  'cote': {
    slug: 'cote',
    name: 'Côte',
    locales: ['en', 'sq', 'it', 'pl', 'uk', 'de', 'fr', 'no'],
    defaultLocale: 'en',
    brand: {
      themeAttr: 'cote',
      stylesheet: '/themes/cote.css',
      fonts: [
        { family: 'Playfair Display', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap' },
        { family: 'Mulish', href: 'https://fonts.googleapis.com/css2?family=Mulish:wght@300;400;500;600;700&display=swap' },
      ],
    },
    logoText: 'Côte',
    defaultCategory: 'drinks',
    drinksCategoryLabel: 'drinks',
    showCocktailGuide: false,
    backgroundTheme: 'patisserie',
    onboarding: {
      pricesNote: 'Prices in Albanian Lek',
    },
  },
  'bottle-brothers': {
    slug: 'bottle-brothers',
    name: 'Bottle Brothers',
    locales: ['en', 'sq', 'it', 'pl', 'uk', 'de', 'fr', 'no'],
    defaultLocale: 'en',
    brand: {
      themeAttr: 'bottle-brothers',
      stylesheet: '/themes/bottle-brothers.css',
      fonts: [
        { family: 'Marcellus', href: 'https://fonts.googleapis.com/css2?family=Marcellus&display=swap' },
        { family: 'Jost', href: 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap' },
      ],
    },
    logoSrc: '/assets/bb-logo-crop.png',
    houseIndicator: 'olive',
    backgroundTheme: 'cocktail',
    onboarding: {
      pricesNote: 'Prices in Lekë',
    },
  },
}

export async function getVenue(slug: string): Promise<VenueConfig | null> {
  return venues[slug] ?? null
}
