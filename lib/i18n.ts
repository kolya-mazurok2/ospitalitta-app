import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { localeFromAcceptLanguage } from './locale'

// Supported UI-chrome locales (Ospitalitta-level, not venue-level)
export const supportedLocales = ['en', 'sq', 'it', 'pl', 'hu', 'de', 'fr', 'no'] as const
export type SupportedLocale = typeof supportedLocales[number]

export default getRequestConfig(async () => {
  // Locale resolution without next-intl middleware (DEC-009):
  // cookie → Accept-Language → 'en'
  const cookieStore = await cookies()
  const headerStore = await headers()

  const cookie = cookieStore.get('osp_locale')?.value
  const al = headerStore.get('accept-language')

  let locale: string = cookie || localeFromAcceptLanguage(al) || 'en'
  if (!supportedLocales.includes(locale as SupportedLocale)) locale = 'en'

  const messages = (await import(`@/messages/${locale}.json`)).default

  return { locale, messages }
})
