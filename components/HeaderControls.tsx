'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { FLAG_SPRITE, FLAG_LOCALES } from '@/lib/flag-sprite'

/** Chrome icon from the inlined sprite — same-document <use>, no extra request. */
function UiIcon({ name, size = 24 }: { name: 'info' | 'typography' | 'language'; size?: number }) {
  return (
    <svg width={size} height={size} style={{ display: 'block', color: 'var(--ink-faint)' }} aria-hidden>
      <use href={`#ui-${name}`} />
    </svg>
  )
}

/**
 * Current language, shown as its country flag. Every shipped locale has one today;
 * the globe stays as the fallback so adding a language never leaves a blank control.
 */
function LocaleIcon({ locale, size = 24 }: { locale: string; size?: number }) {
  if (!FLAG_LOCALES.has(locale)) return <UiIcon name="language" size={size} />
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      style={{ display: 'block', borderRadius: 2 }}
      aria-hidden
    >
      <use href={`#flag-${locale}`} />
    </svg>
  )
}

const SCALE_STEPS = [0.9, 1, 1.15, 1.3]
const SCALE_LABELS = [0.72, 0.88, 1.04, 1.20] // rem sizes for the "T" buttons

// Platform-level order — all supported locales in display sequence
const ALL_LOCALES: { code: string; label: string }[] = [
  { code: 'pl', label: 'Polski' },
  { code: 'it', label: 'Italiano' },
  { code: 'fr', label: 'Français' },
  { code: 'sq', label: 'Shqip' },
  { code: 'de', label: 'Deutsch' },
  { code: 'no', label: 'Norsk' },
  { code: 'uk', label: 'Українська' },
  { code: 'en', label: 'English' },
]

interface Props {
  logoSrc?: string
  logoText?: string
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
  logoSrc, logoText, locale, locales, fontScale,
  onOpenLegend, onLocaleChange, onScaleChange, headerDecor, headerDecorLeft,
}: Props) {
  const [aaOpen, setAaOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  const handleAa = () => { setAaOpen(v => !v); setLangOpen(false) }
  const handleLang = () => { setLangOpen(v => !v); setAaOpen(false) }

  // Any tap outside a dropdown dismisses it. Scoped to the dropdown itself, not the
  // header: anchoring on the header meant tapping the logo or the neighbouring control
  // counted as "inside" and left the panel hanging over the menu.
  const aaRef = useRef<HTMLDivElement>(null)
  const langRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aaOpen && !langOpen) return
    const onDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (aaOpen && !aaRef.current?.contains(target)) setAaOpen(false)
      if (langOpen && !langRef.current?.contains(target)) setLangOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [aaOpen, langOpen])

  return (
    <div style={{
      flexShrink: 0, padding: '20px 20px 12px',
      background: 'var(--surface)', position: 'relative', zIndex: 6,
    }}>
      <svg style={{ display: 'none' }} aria-hidden dangerouslySetInnerHTML={{ __html: FLAG_SPRITE }} />
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
      {/* logo left, controls right; the controls line up on the logo's bottom edge */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        {/* logo — image or live-text wordmark */}
        {logoText ? (
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: '1.625rem', letterSpacing: '0.06em',
            color: 'var(--brand)', lineHeight: 1, display: 'block',
          }}>
            {logoText}
          </span>
        ) : logoSrc ? (
          <span style={{
            display: 'block', flexShrink: 0,
            background: 'var(--surface-logo)', padding: '6px 10px',
          }}>
            <Image
              src={logoSrc}
              alt=""
              width={300}
              height={40}
              className="venue-logo"
              style={{ height: '40px', width: 'auto', display: 'block' }}
              priority
            />
          </span>
        ) : null}

        {/* controls */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18 }}>
          {/* info / legend */}
          <button
            onClick={() => { onOpenLegend(); setAaOpen(false); setLangOpen(false) }}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
            aria-label="How to read this menu"
          >
            <UiIcon name="info" />
          </button>

          {/* Aa size picker */}
          <div ref={aaRef} style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={handleAa}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              aria-label="Text size"
            >
              <UiIcon name="typography" />
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
                      <span style={{ fontSize: `${SCALE_LABELS[i]}rem` }}>T</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* language picker */}
          <div ref={langRef} style={{ position: 'relative', display: 'inline-flex' }}>
            <button
              onClick={handleLang}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', flexShrink: 0 }}
              aria-label="Language"
            >
              <LocaleIcon locale={locale} />
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
