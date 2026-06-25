import type { Metadata } from 'next'
import { Anton, Space_Grotesk, Space_Mono } from 'next/font/google'
import '@/styles/admin-theme.css'

// Admin chrome is Ospitalitta-constant. Fonts: Anton (titles/KPI only),
// Space Grotesk (UI/body), Space Mono (labels/codes/numeric data).
const anton = Anton({ subsets: ['latin'], weight: '400', variable: '--font-anton' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk' })
const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono' })

export const metadata: Metadata = {
  title: 'Ospitalitta Admin',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-admin
      data-theme="life"
      className={`${anton.variable} ${grotesk.variable} ${mono.variable}`}
      style={{ minHeight: '100dvh', background: 'var(--surface)', color: 'var(--ink)' }}
    >
      {children}
    </div>
  )
}
