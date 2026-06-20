import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts')

const nextConfig: NextConfig = {
  experimental: {
    // next-intl server components support
  },
}

export default withNextIntl(nextConfig)
