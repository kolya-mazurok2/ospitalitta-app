/**
 * Locale resolution (DEC-009) and taste-order logic (DEC-009).
 * No URL routing. Locale resolved from cookie → Accept-Language → venue.locales[0].
 * countryTaste is separate: region from Accept-Language → which taste tab starts ACTIVE.
 * Tab order is never touched — sections render in their authored order.
 */

export type CountryCode = string
export type TasteKey = 'bitter' | 'sour' | 'sweet' | 'spicy' | 'zero'

// Region → lead cocktail taste (PL/GB → sweet, IT/DE → bitter, FR/NO → sour, else → bitter)
const countryTasteMap: Record<string, TasteKey> = {
  PL: 'sweet', GB: 'sweet',
  IT: 'bitter', DE: 'bitter',
  FR: 'sour',  NO: 'sour',
}

/**
 * Derive lead taste from Accept-Language header value (e.g. "pl-PL,pl;q=0.9,en;q=0.8").
 * Extracts region from first locale tag. Falls back to 'bitter'.
 * Used only as the LANDING tab when the guest has no stored preference.
 */
export function getLeadTaste(acceptLanguage: string | null): TasteKey {
  if (!acceptLanguage) return 'bitter'
  const first = acceptLanguage.split(',')[0].trim()
  const match = first.match(/[-_]([A-Za-z]{2})/)
  const country = match ? match[1].toUpperCase() : null
  return (country && countryTasteMap[country]) || 'bitter'
}

/** Every UI locale Ospitalitta ships messages for. Single source of truth. */
export const SUPPORTED_LOCALES = ['en', 'sq', 'it', 'pl', 'uk', 'de', 'fr', 'no'] as const
export type SupportedLocale = typeof SUPPORTED_LOCALES[number]

/**
 * Derive UI locale from the browser Accept-Language header.
 * Walks the header in its listed (priority) order, e.g.
 *   "pl-PL,pl;q=0.9,en;q=0.8" → 'pl'
 * and returns the first language we actually support; anything else → 'en'.
 */
export function localeFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'en'
  for (const part of acceptLanguage.split(',')) {
    const tag = part.split(';')[0].trim().toLowerCase()  // strip q-weight: "pl-pl"
    const primary = tag.split('-')[0]                     // primary subtag: "pl"
    if ((SUPPORTED_LOCALES as readonly string[]).includes(primary)) return primary
  }
  return 'en'
}

const LOCALE_COOKIE = 'osp_locale'

/**
 * Resolve locale for a venue request.
 * Order: cookie → Accept-Language → venue.locales[0] → 'en'.
 * Validates against venue's declared locales.
 */
export function getLocale(
  cookieValue: string | undefined,
  acceptLanguage: string | null,
  venueLocales: string[],
): string {
  const candidates = [
    cookieValue,
    localeFromAcceptLanguage(acceptLanguage),
    venueLocales[0],
    'en',
  ]
  for (const c of candidates) {
    if (c && venueLocales.includes(c)) return c
  }
  return venueLocales[0] ?? 'en'
}

export { LOCALE_COOKIE }

/**
 * Pick the best available locale from an i18n map.
 * Fallback chain: requested → fallback → first available.
 */
export function pickLocale<T>(
  i18n: Record<string, T>,
  locale: string,
  fallback = 'en',
): T {
  return i18n[locale] ?? i18n[fallback] ?? i18n[Object.keys(i18n)[0]]
}

/** Strip 'L' prefix and return numeric string for display. */
export function money(price: string): string {
  return price.replace(/^L/, '')
}

/** Split price into display amount and unit label (for per-weight/per-person items). */
export function parsePriceDisplay(price: string): { amount: string; unit: string | null } {
  const stripped = price.replace(/^L/, '')
  if (stripped.endsWith('/kg'))   return { amount: stripped.slice(0, -3), unit: 'PER KG' }
  if (stripped.endsWith('/100g')) return { amount: stripped.slice(0, -5), unit: 'PER 100 G' }
  return { amount: stripped, unit: null }
}
