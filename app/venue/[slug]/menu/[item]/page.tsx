export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { getPublishedMenu, getVenue } from '@/lib/menu-repo'
import { getLocale } from '@/lib/locale'
import { buildItemDetail } from '@/lib/item-detail'
import ItemPageClient from '@/components/ItemPage.client'

interface Props {
  params: Promise<{ slug: string; item: string }>
}

/**
 * Product page. Reads the SAME tagged fetch as the menu list (DEC-004), so arriving here
 * from a card costs no extra database round-trip — the menu document is already in the
 * data cache. Only the item's own view-model is derived here.
 */
export default async function ItemPage({ params }: Props) {
  const { slug, item } = await params

  const [menu, venue] = await Promise.all([getPublishedMenu(slug), getVenue(slug)])
  if (!menu || !venue) notFound()

  const headerStore = await headers()
  const cookieStore = await cookies()
  const locale = getLocale(
    cookieStore.get('osp_locale')?.value,
    headerStore.get('accept-language'),
    venue.locales,
  )

  const detail = buildItemDetail(menu, item, locale)
  if (!detail) notFound()

  return <ItemPageClient detail={detail} venueSlug={slug} reviewUrl={venue.reviewUrl} />
}
