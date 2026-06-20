/**
 * getPublishedMenu — data abstraction layer (DEC-004, DEC-005).
 * Currently returns static BB data. When Supabase is ready, replace the
 * implementation here; all callers (page.tsx) stay unchanged.
 */
import { bbMenuData, type VenueMenuData } from './menu-data'

export async function getPublishedMenu(slug: string): Promise<VenueMenuData | null> {
  // Static phase: only BB is seeded
  if (slug === 'bottle-brothers') return bbMenuData
  return null
}

export interface VenueBrand {
  themeAttr: string
  stylesheet: string
  fonts: Array<{ family: string; href: string }>
}

export interface VenueConfig {
  slug: string
  name: string
  locales: string[]
  defaultLocale: string
  brand: VenueBrand
}

const venues: Record<string, VenueConfig> = {
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
  },
}

export async function getVenue(slug: string): Promise<VenueConfig | null> {
  return venues[slug] ?? null
}
