/**
 * Item detail view-model — everything the product page shows, derived from menu data.
 *
 * Lives outside the components because the same derivation used to sit inside
 * Menu.client for the bottom sheet. The sheet is gone; the page is the only consumer,
 * and keeping the shape here means the menu list never has to build it.
 *
 * Translated chrome (the pairing label) is NOT resolved here — the caller adds it,
 * since only the client has the next-intl scope.
 */
import { pickLocale, money } from './locale'
import { parsePrice } from './cart'
import type { VenueMenuData, MenuItem } from './menu-data'

export interface DetailDishRow {
  slug: string
  name: string
  price: string
  isFood: boolean
}

export interface ItemDetail {
  slug: string
  name: string
  desc: string
  price: string
  rawPrice: number
  isFood: boolean
  /** Which tab the menu should land on when the guest goes back. */
  sectionKey: string
  taste?: 'bitter' | 'sour' | 'sweet'
  n?: 1 | 2 | 3
  tastes?: Array<{ taste: 'bitter' | 'sour' | 'sweet'; n: 1 | 2 | 3 }>
  single?: boolean
  loved?: boolean
  house?: boolean
  badge?: string
  videoSrc?: string
  posterSrc?: string
  dishes: DetailDishRow[]
  /** Cocktail: coloured lead + underlined drink name + tail. Food: one plain sentence. */
  whyIsCocktail: boolean
  whyLead?: string
  whyDrink?: string
  whyPost?: string
  foodWhy?: string
}

function indexes(menu: VenueMenuData) {
  const cocktails: Record<string, { item: MenuItem; section: string }> = {}
  for (const sec of menu.sections)
    for (const item of sec.items) cocktails[item.slug] = { item, section: sec.key }

  const foods: Record<string, { item: MenuItem; section: string }> = {}
  for (const sec of menu.foodSections)
    for (const item of sec.items) foods[item.slug] = { item, section: sec.key }

  return { cocktails, foods }
}

export function buildItemDetail(
  menu: VenueMenuData,
  slug: string,
  locale: string,
): ItemDetail | null {
  const { cocktails, foods } = indexes(menu)
  const pl = <T,>(i18n: Record<string, T>) => pickLocale(i18n, locale)

  const cocktail = cocktails[slug]
  if (cocktail) {
    const { item, section } = cocktail
    const text = pl(item.i18n)
    const taste = (section === 'bitter' || section === 'sour' || section === 'sweet')
      ? (section as 'bitter' | 'sour' | 'sweet')
      : undefined
    const why = taste ? menu.tasteWhy?.[taste] : undefined
    const pairing = menu.pairings.find(p => p.cocktailRef === slug)

    return {
      slug, name: text.name, desc: text.desc,
      price: money(item.price), rawPrice: parsePrice(item.price),
      isFood: false, sectionKey: section,
      taste, n: item.lvl,
      tastes: item.tastes?.map(ts => ({ taste: ts.taste, n: ts.lvl })),
      single: section === 'zero',
      loved: item.loved, house: item.house, badge: item.badge,
      videoSrc: item.videoSrc, posterSrc: item.posterSrc,
      dishes: pairing?.dishes.map(d => {
        const fi = foods[d.itemRef]
        return {
          slug: d.itemRef,
          name: fi ? pl(fi.item.i18n).name : d.itemRef,
          price: money(d.price),
          isFood: true,
        }
      }) ?? [],
      whyIsCocktail: true,
      whyLead: why?.lead, whyDrink: text.name, whyPost: why?.post,
    }
  }

  const food = foods[slug]
  if (!food) return null

  const { item, section } = food
  const text = pl(item.i18n)
  const fp = menu.foodPairings.find(p => p.dishRef === slug)

  return {
    slug, name: text.name, desc: text.desc,
    price: money(item.price), rawPrice: parsePrice(item.price),
    isFood: true, sectionKey: section,
    loved: item.loved, house: item.house, badge: item.badge,
    videoSrc: item.videoSrc, posterSrc: item.posterSrc,
    dishes: fp?.cocktailRefs.flatMap(ref => {
      const ce = cocktails[ref]
      if (!ce) return []
      return [{
        slug: ref,
        name: pl(ce.item.i18n).name,
        price: money(ce.item.price),
        isFood: false,
      }]
    }) ?? [],
    whyIsCocktail: false,
    foodWhy: fp ? (fp.i18n[locale]?.why ?? fp.i18n['en']?.why) : undefined,
  }
}
