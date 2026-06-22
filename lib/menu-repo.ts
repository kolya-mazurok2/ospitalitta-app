/**
 * getPublishedMenu — data abstraction layer (DEC-004, DEC-005).
 * Currently returns static BB data. When Supabase is ready, replace the
 * implementation here; all callers (page.tsx) stay unchanged.
 */
import { bbMenuData, type VenueMenuData } from './menu-data'
import { salyMenuData } from './saly-data'

const menuData: Record<string, VenueMenuData> = {
  'bottle-brothers': bbMenuData,
  'saly': salyMenuData,
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
  logoSrc: string
  defaultCategory?: 'cocktails' | 'food'
  houseIndicator?: 'olive' | 'shell'  // venue signature mark shown after house item names
  showCocktailGuide?: boolean         // show bitter/sour/sweet legend rows (default true; false for food-led venues)
}

const venues: Record<string, VenueConfig> = {
  'saly': {
    slug: 'saly',
    name: 'Saly',
    locales: ['en', 'pl'],
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
    onboarding: {
      pricesNote: 'Prices in Lekë',
    },
  },
  'bottle-brothers': {
    slug: 'bottle-brothers',
    name: 'Bottle Brothers',
    locales: ['en', 'sq', 'it'],
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
    onboarding: {
      pricesNote: 'Prices in Lekë',
    },
  },
}

export async function getVenue(slug: string): Promise<VenueConfig | null> {
  return venues[slug] ?? null
}
