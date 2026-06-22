import { notFound } from 'next/navigation'
import { headers, cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getVenue } from '@/lib/menu-repo'
import { getLocale, getLeadTaste } from '@/lib/locale'
import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) return {}
  return {
    title: venue.name,
    description: `${venue.name} — Digital Menu`,
  }
}

export default async function VenueLayout({ children, params }: Props) {
  const { slug } = await params
  const venue = await getVenue(slug)
  if (!venue) notFound()

  const headerStore = await headers()
  const cookieStore = await cookies()
  const al = headerStore.get('accept-language')
  const localeCookie = cookieStore.get('osp_locale')?.value

  const locale = getLocale(localeCookie, al, venue.locales)
  const leadTaste = getLeadTaste(al)

  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {venue.brand.fonts.map(f => (
        <link key={f.family} rel="stylesheet" href={f.href} />
      ))}
      <link rel="stylesheet" href={venue.brand.stylesheet} />
      <div
        data-venue={venue.brand.themeAttr}
        data-locale={locale}
        data-lead-taste={leadTaste}
        style={{ height: '100dvh', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </div>
    </NextIntlClientProvider>
  )
}
