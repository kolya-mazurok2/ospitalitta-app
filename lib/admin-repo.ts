// Admin read/write for the menu editor. Uses the service-role client (server only,
// bypasses RLS). Reads the FULL editable shape (all fields, all locales) — distinct from
// getPublishedMenu, which returns the trimmed guest contract.
import { supabaseAdmin } from './supabase'

export interface EditItem {
  id: string
  slug: string
  price_minor: number | null
  price_unit: string | null
  glass: string | null
  lvl: number | null
  flavor: string | null
  loved: boolean
  house: boolean
  available: boolean
  badge: string | null
  image_url: string | null
  video_url: string | null
  sort_order: number
  i18n: Record<string, { name?: string; desc?: string }>
}

export interface EditCategory {
  id: string
  key: string
  type: 'cocktail' | 'food'
  sort_order: number
  i18n: Record<string, { label?: string; sub?: string; note?: string }>
  items: EditItem[]
}

export interface EditTreeVenue {
  id: string
  slug: string
  name: string
  locales: string[]
  defaultLocale: string
  currency: string
}

export interface EditTree {
  venue: EditTreeVenue
  topCategories: { id: string; key: 'cocktail' | 'food'; children: EditCategory[] }[]
}

export async function getVenueRow(slug: string): Promise<EditTreeVenue | null> {
  const sb = supabaseAdmin()
  const { data, error } = await sb
    .from('venue')
    .select('id,slug,name,locales,default_locale,currency')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return {
    id: data.id, slug: data.slug, name: data.name,
    locales: data.locales ?? ['en'], defaultLocale: data.default_locale ?? 'en',
    currency: data.currency ?? 'ALL',
  }
}

export async function getMenuForEdit(slug: string): Promise<EditTree | null> {
  const sb = supabaseAdmin()

  const { data: v, error: vErr } = await sb
    .from('venue')
    .select('id,slug,name,locales,default_locale,currency')
    .eq('slug', slug)
    .single()
  if (vErr || !v) return null

  const [{ data: cats }, { data: items }] = await Promise.all([
    sb.from('menu_category').select('*').eq('venue_id', v.id).order('sort_order'),
    sb.from('menu_item').select('*').eq('venue_id', v.id).order('sort_order'),
  ])

  const itemsByCat = new Map<string, EditItem[]>()
  for (const it of items ?? []) {
    const list = itemsByCat.get(it.category_id) ?? []
    list.push({
      id: it.id, slug: it.slug,
      price_minor: it.price_minor, price_unit: it.price_unit,
      glass: it.glass, lvl: it.lvl, flavor: it.flavor,
      loved: !!it.loved, house: !!it.house, available: it.available !== false,
      badge: it.badge, image_url: it.image_url, video_url: it.video_url,
      sort_order: it.sort_order, i18n: it.i18n ?? {},
    })
    itemsByCat.set(it.category_id, list)
  }

  const tops = (cats ?? []).filter(c => c.parent_id == null)
  const children = (cats ?? []).filter(c => c.parent_id != null)

  const topCategories = tops.map(top => {
    const type: 'cocktail' | 'food' = top.key === 'food' ? 'food' : 'cocktail'
    return {
      id: top.id,
      key: type,
      children: children
        .filter(c => c.parent_id === top.id)
        .map<EditCategory>(c => ({
          id: c.id, key: c.key, type, sort_order: c.sort_order,
          i18n: c.i18n ?? {},
          items: itemsByCat.get(c.id) ?? [],
        })),
    }
  })

  return {
    venue: {
      id: v.id, slug: v.slug, name: v.name,
      locales: v.locales ?? ['en'], defaultLocale: v.default_locale ?? 'en',
      currency: v.currency ?? 'ALL',
    },
    topCategories,
  }
}
