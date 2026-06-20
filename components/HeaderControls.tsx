'use client'

import { useState } from 'react'
import Image from 'next/image'

const SCALE_STEPS = [0.9, 1, 1.15, 1.3]
const SCALE_LABELS = [0.72, 0.88, 1.04, 1.20] // rem sizes for the "A" buttons

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  sq: 'Shqip',
  it: 'Italiano',
  pl: 'Polski',
  de: 'Deutsch',
  fr: 'Français',
  no: 'Norsk',
}

interface Props {
  locale: string
  locales: string[]
  fontScale: number
  onOpenLegend: () => void
  onLocaleChange: (locale: string) => void
  onScaleChange: (scale: number) => void
}

export default function HeaderControls({
  locale, locales, fontScale,
  onOpenLegend, onLocaleChange, onScaleChange,
}: Props) {
  const [aaOpen, setAaOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const handleAa = () => { setAaOpen(v => !v); setLangOpen(false) }
  const handleLang = () => { setLangOpen(v => !v); setAaOpen(false) }

  return (
    <div style={{
      flexShrink: 0, padding: '62px 20px 12px',
      background: 'var(--surface)', position: 'relative', zIndex: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* logo */}
        <Image
          src="/assets/bb-logo-crop.png"
          alt="Bottle Brothers"
          width={104}
          height={36}
          style={{ height: 'auto', display: 'block' }}
          priority
        />

        {/* controls */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
          {/* info / legend */}
          <button
            onClick={() => { onOpenLegend(); setAaOpen(false); setLangOpen(false) }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="How to read this menu"
          >
            <Image src="/assets/icon-info.svg" alt="" width={20} height={20} aria-hidden />
          </button>

          {/* Aa size picker */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={handleAa}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center' }}
              aria-label="Text size"
            >
              <Image src="/assets/icon-typography.svg" alt="" width={20} height={20} aria-hidden />
            </button>

            {aaOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 60,
                background: 'var(--surface-dark)', padding: 8,
                display: 'flex', alignItems: 'flex-end', gap: 4,
                boxShadow: '0 12px 30px rgb(0 0 0 / 0.35)',
              }}>
                {SCALE_STEPS.map((v, i) => {
                  const active = fontScale === v
                  return (
                    <button
                      key={v}
                      onClick={() => { onScaleChange(v); setAaOpen(false) }}
                      style={{
                        width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: active ? 'var(--brand-on-dark)' : 'transparent',
                        border: '1px solid rgb(255 255 255 / 0.14)', cursor: 'pointer',
                        color: active ? 'var(--ink)' : 'var(--on-dark)',
                        fontFamily: 'var(--font-display)', lineHeight: 1,
                      }}
                      aria-label={`Text size ${v}`}
                      aria-pressed={active}
                    >
                      <span style={{ fontSize: `${SCALE_LABELS[i]}rem` }}>A</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* language picker */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={handleLang}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', flexShrink: 0 }}
              aria-label="Language"
            >
              <Image src="/assets/icon-language.svg" alt="" width={20} height={20} aria-hidden />
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 60,
                background: 'var(--surface-dark)', padding: 6,
                display: 'flex', flexDirection: 'column', minWidth: 140,
                boxShadow: '0 12px 30px rgb(0 0 0 / 0.35)',
              }}>
                {locales.map(lc => {
                  const active = locale === lc
                  return (
                    <button
                      key={lc}
                      onClick={() => { onLocaleChange(lc); setLangOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center',
                        background: active ? 'var(--brand-on-dark)' : 'transparent',
                        border: 'none', cursor: 'pointer', padding: '9px 12px',
                        fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                        letterSpacing: '0.03em',
                        color: active ? 'var(--ink)' : 'var(--on-dark-2)',
                        textAlign: 'left', whiteSpace: 'nowrap',
                      }}
                    >
                      {LOCALE_LABELS[lc] ?? lc.toUpperCase()}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
