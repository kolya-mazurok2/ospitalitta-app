/**
 * One-shot seed: static saly-data.ts → Supabase (venue + menu_category tree + menu_item).
 * Idempotent: wipes the Saly venue (cascade) then re-inserts. Touches ONLY Saly.
 * Run:  npm run seed   (after applying supabase/migrations/0001_init.sql)
 *
 * Conversions: price 'L3000/kg' → price_minor 3000 + price_unit 'kg'.
 * Top-level categories (key 'cocktail'/'food') hold the Drinks/Food split; sections are their children.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })

const SLUG = 'saly'
const CURRENCY = 'ALL'   // Lek; decimals 0 → minor units == whole Lek

// 'L3000/kg' → { minor: 3000, unit: 'kg' };  'L600' → { minor: 600, unit: null }
function parsePrice(price: string): { minor: number | null; unit: string | null } {
  const um = price.match(/\/(kg|100g)$/)
  const unit = um ? um[1] : null
  const digits = price.replace(/^L/, '').replace(/\/(kg|100g)$/, '')
  return { minor: digits ? parseInt(digits, 10) : null, unit }
}

async function main() {
  // dynamic import AFTER dotenv so module-level env consts are populated
  const { supabaseAdmin } = await import('../lib/supabase')
  const { salyMenuData } = await import('../lib/saly-data')
  const { getVenue } = await import('../lib/menu-repo')
  type Section = (typeof salyMenuData.sections)[number]

  const sb = supabaseAdmin()
  const venue = await getVenue(SLUG)
  if (!venue) throw new Error(`No static venue config for "${SLUG}"`)

  // 1. wipe (cascade removes its categories + items)
  const del = await sb.from('venue').delete().eq('slug', SLUG)
  if (del.error) throw del.error

  // 2. venue row
  const { data: vRow, error: vErr } = await sb.from('venue').insert({
    slug: SLUG,
    name: venue.name,
    locales: venue.locales,
    default_locale: venue.defaultLocale,
    currency: CURRENCY,
    brand: venue.brand,
    onboarding: venue.onboarding,
    config: {
      defaultCategory: venue.defaultCategory,
      drinksCategoryLabel: venue.drinksCategoryLabel,
      houseIndicator: venue.houseIndicator,
      showCocktailGuide: venue.showCocktailGuide,
      backgroundTheme: venue.backgroundTheme,
      headerDecor: venue.headerDecor,
      headerDecorLeft: venue.headerDecorLeft,
      logoSrc: venue.logoSrc,
      logoText: venue.logoText,
    },
  }).select('id').single()
  if (vErr) throw vErr
  const venueId = vRow.id

  // 3. top-level categories — key = the section type
  const insTop = async (key: 'cocktail' | 'food', order: number) => {
    const { data, error } = await sb.from('menu_category')
      .insert({ venue_id: venueId, parent_id: null, key, sort_order: order, i18n: {} })
      .select('id').single()
    if (error) throw error
    return data.id as string
  }
  const cocktailTopId = await insTop('cocktail', 0)
  const foodTopId = await insTop('food', 1)

  // 4. child categories + their items
  let catCount = 0
  let itemCount = 0
  const seedChildren = async (sections: Section[], parentId: string) => {
    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s]
      const { data: cRow, error: cErr } = await sb.from('menu_category')
        .insert({ venue_id: venueId, parent_id: parentId, key: sec.key, sort_order: s, i18n: sec.i18n })
        .select('id').single()
      if (cErr) throw cErr
      catCount++

      const rows = sec.items.map((item, j) => {
        const { minor, unit } = parsePrice(item.price)
        return {
          venue_id: venueId,
          category_id: cRow.id,
          slug: item.slug,
          price_minor: minor,
          price_unit: unit,
          glass: item.glass ?? null,
          lvl: item.lvl ?? null,
          flavor: item.flavor ?? null,
          loved: item.loved ?? false,
          house: item.house ?? false,
          badge: item.badge ?? null,
          image_url: item.posterSrc ?? null,
          video_url: item.videoSrc ?? null,
          sort_order: j,
          i18n: item.i18n,
        }
      })
      if (rows.length) {
        const { error: iErr } = await sb.from('menu_item').insert(rows)
        if (iErr) throw iErr
        itemCount += rows.length
      }
    }
  }
  await seedChildren(salyMenuData.sections, cocktailTopId)
  await seedChildren(salyMenuData.foodSections, foodTopId)

  console.log(`✓ Seeded "${SLUG}": 2 top categories, ${catCount} sub-categories, ${itemCount} items.`)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
