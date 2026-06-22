'use client'

import { useState } from 'react'
import Image from 'next/image'

const SCALE_STEPS = [0.9, 1, 1.15, 1.3]
const SCALE_LABELS = [0.72, 0.88, 1.04, 1.20] // rem sizes for the "A" buttons

// Platform-level order — all supported locales in display sequence
const ALL_LOCALES: { code: string; label: string }[] = [
  { code: 'pl', label: 'Polski' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'sq', label: 'Shqip' },
  { code: 'de', label: 'Deutsch' },
  { code: 'no', label: 'Norsk' },
  { code: 'en', label: 'English' },
]

interface Props {
  logoSrc: string
  locale: string
  locales: string[]
  fontScale: number
  onOpenLegend: () => void
  onLocaleChange: (locale: string) => void
  onScaleChange: (scale: number) => void
  headerDecor?: string
  headerDecorLeft?: string
}

export default function HeaderControls({
  logoSrc, locale, locales, fontScale,
  onOpenLegend, onLocaleChange, onScaleChange, headerDecor, headerDecorLeft,
}: Props) {
  const [aaOpen, setAaOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const handleAa = () => { setAaOpen(v => !v); setLangOpen(false) }
  const handleLang = () => { setLangOpen(v => !v); setAaOpen(false) }

  return (
    <div style={{
      flexShrink: 0, padding: '20px 20px 12px',
      background: 'var(--surface)', position: 'relative', zIndex: 6,
    }}>
      {headerDecor && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <img
            src={headerDecor}
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              right: 'calc(3% - 120px)', top: 'calc(50% + 20px)',
              transform: 'translateY(-50%) rotate(-8deg)',
              width: '48%',
              opacity: 0.20,
              mixBlendMode: 'multiply',
              filter: 'saturate(0.8)',
              pointerEvents: 'none',
            }}
          />
        </div>
      )}
      {headerDecorLeft && (
        <img
          src={headerDecorLeft}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            left: 14, bottom: -28,
            width: 64,
            opacity: 0.26,
            mixBlendMode: 'multiply',
            filter: 'saturate(0.75)',
            transform: 'rotate(18deg)',
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        {/* logo */}
        <Image
          src={logoSrc}
          alt=""
          width={300}
          height={40}
          className="venue-logo"
          style={{ height: '40px', width: 'auto', display: 'block' }}
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
            <Image src="/assets/icon-info.svg" alt="" width={24} height={24} aria-hidden />
          </button>

          {/* Aa size picker */}
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={handleAa}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center' }}
              aria-label="Text size"
            >
              <Image src="/assets/icon-typography.svg" alt="" width={24} height={24} aria-hidden />
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
              <Image src="/assets/icon-language.svg" alt="" width={24} height={24} aria-hidden />
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 60,
                background: 'var(--surface-dark)', padding: 6,
                display: 'flex', flexDirection: 'column', minWidth: 140,
                boxShadow: '0 12px 30px rgb(0 0 0 / 0.35)',
              }}>
                {ALL_LOCALES.filter(l => locales.includes(l.code)).map(({ code, label }) => {
                  const active = locale === code
                  return (
                    <button
                      key={code}
                      onClick={() => { onLocaleChange(code); setLangOpen(false) }}
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
                      {label}
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
