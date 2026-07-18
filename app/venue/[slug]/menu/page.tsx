export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { getPublishedMenu } from '@/lib/menu-repo'
import { getVenue } from '@/lib/menu-repo'
import { getLocale, getLeadTaste } from '@/lib/locale'
import MenuClient from '@/components/Menu.client'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function MenuPage({ params }: Props) {
  const { slug } = await params

  const [menu, venue] = await Promise.all([getPublishedMenu(slug), getVenue(slug)])
  if (!menu || !venue) notFound()

  const headerStore = await headers()
  const cookieStore = await cookies()
  const al = headerStore.get('accept-language')
  const localeCookie = cookieStore.get('osp_locale')?.value

  const locale = getLocale(localeCookie, al, venue.locales)
  const leadTaste = getLeadTaste(al)

  const welcome = venue.onboarding.welcome?.[locale] ?? venue.onboarding.welcome?.['en']

  return (
    <MenuClient
      menuData={menu}
      venueSlug={slug}
      locale={locale}
      leadTaste={leadTaste}
      locales={venue.locales}
      logoSrc={venue.logoSrc}
      logoText={venue.logoText}
      onboarding={{ pricesNote: venue.onboarding.pricesNote, welcome }}
      defaultCategory={venue.defaultCategory}
      drinksCategoryLabel={venue.drinksCategoryLabel}
      forceCompact={venue.forceCompact}
      houseIndicator={venue.houseIndicator}
      showCocktailGuide={venue.showCocktailGuide ?? true}
      backgroundTheme={venue.backgroundTheme ?? 'none'}
      reviewUrl={venue.reviewUrl}
      headerDecor={venue.headerDecor}
      headerDecorLeft={venue.headerDecorLeft}
    />
  )
}
