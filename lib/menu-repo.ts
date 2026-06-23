/**
 * getPublishedMenu — data abstraction layer (DEC-004, DEC-005).
 * Currently returns static BB data. When Supabase is ready, replace the
 * implementation here; all callers (page.tsx) stay unchanged.
 */
import { bbMenuData, type VenueMenuData } from './menu-data'
import { salyMenuData } from './saly-data'
import { coteMenuData } from './cote-data'

const menuData: Record<string, VenueMenuData> = {
  'bottle-brothers': bbMenuData,
  'saly': salyMenuData,
  'cote': coteMenuData,
}

export async function getPublishedMenu(slug: string): Promise<VenueMenuData | null> {
  return menuData[slug] ?? null
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
  houseIndicator?: 'olive' | 'shell'
  showCocktailGuide?: boolean
  backgroundTheme?: 'seafood' | 'cocktail' | 'none'
  headerDecor?: string
  headerDecorLeft?: string
}

const venues: Record<string, VenueConfig> = {
  'saly': {
    slug: 'saly',
    name: 'Saly',
    locales: ['en', 'sq', 'it', 'pl', 'hu', 'de', 'fr', 'no'],
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
    locales: ['en', 'sq', 'it', 'pl', 'hu', 'de', 'fr', 'no'],
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
    backgroundTheme: 'none',
    onboarding: {
      pricesNote: 'Prices in Albanian Lek',
    },
  },
  'bottle-brothers': {
    slug: 'bottle-brothers',
    name: 'Bottle Brothers',
    locales: ['en', 'sq', 'it', 'pl', 'hu', 'de', 'fr', 'no'],
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
