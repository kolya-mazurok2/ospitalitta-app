'use client'

import { useState, useEffect } from 'react'
import CardVideo from '@/components/CardVideo'
import { HouseMark, EyeSvg } from '@/components/ItemCard'
import VariantSlider from '@/components/VariantSlider'
import { parsePriceDisplay } from '@/lib/locale'
import { clampDesc } from '@/lib/text'
import type { ItemOption } from '@/lib/menu-data'

interface Props {
  id: string
  name: string
  desc: string
  price: string
  priceRange?: string   // 'min–max' shown instead of single price when the item has sizes/variants
  badge?: string
  house?: boolean
  houseIndicator?: string
  noDetail?: boolean   // list-only items: no detail page, so the compact row is not tappable and shows the price inline
  compact?: boolean
  last?: boolean       // last row in a list: drop the divider so it doesn't double the plate edge
  sweet?: 1 | 2 | 3    // sweetness level from the base (en) desc; keeps cubes on translated locales
  videoSrc?: string
  posterSrc?: string
  variants?: ItemOption[]   // flavour variants — media becomes a carousel through their images
  priority?: boolean   // first card in the list — eager, everything below stays lazy
  onTap: () => void
  onAdd: (e: React.MouseEvent) => void
}

// Venue-styled via CSS vars: --badge-*, set per-venue in theme CSS
const badgePillStyle: React.CSSProperties = {
  fontFamily: 'var(--font-text)',
  fontWeight: 'var(--badge-weight, 500)' as React.CSSProperties['fontWeight'],
  fontSize: 'var(--badge-size, 0.5rem)',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'var(--badge-color, var(--brand-bright))',
  background: 'var(--badge-bg, var(--surface-frame))',
  border: 'var(--badge-border, 1px solid var(--brand))',
  borderRadius: 'var(--badge-radius, 0px)',
  padding: 'var(--badge-padding, 3px 6px)',
  whiteSpace: 'nowrap',
  flexShrink: 0,
}

export default function FoodCard({ id, name, desc, price, priceRange, badge, house, houseIndicator, noDetail, compact, last, videoSrc, posterSrc, variants, priority, onTap, onAdd }: Props) {
  const { amount, unit } = parsePriceDisplay(price)
  // price shows amount only; unit becomes a badge label (rule: per-unit info belongs near name, not in price)
  const displayPrice = priceRange ?? amount
  // Prefer the base-locale level passed in; fall back to parsing the (possibly localized) desc.
  const [vIdx, setVIdx] = useState(0)
  const [interacted, setInteracted] = useState(false)
  const hasCarousel = !!(variants && variants.length > 1 && variants.some(v => v.posterSrc))
  // auto-advance the slider every 5s until the guest interacts
  useEffect(() => {
    if (!hasCarousel || interacted || !variants) return
    const id = setInterval(() => setVIdx(i => (i + 1) % variants.length), 5000)
    return () => clearInterval(id)
  }, [hasCarousel, interacted, variants])
  // derive unit badge from price string if no explicit badge set
  const zoneBadge = badge ?? (unit ? 'Per ' + unit.replace('PER ', '').toLowerCase() : null)

  if (compact) {
    return (
      <div
        id={`item-${id}`}
        onClick={noDetail ? undefined : onTap}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 12,
          padding: '10px 0',
          borderBottom: last ? 'none' : '1px solid var(--hairline)',
          cursor: noDetail ? 'default' : 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Line 1: name + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
            {house && houseIndicator && (
              <span style={{ color: 'var(--brand)', display: 'inline-flex', flexShrink: 0 }}>
                <HouseMark kind={houseIndicator} size={11} inline />
              </span>
            )}
            <span style={{
              flex: 1, minWidth: 0,
              fontFamily: 'var(--font-display)', fontSize: 'var(--card-title-size, 0.9375rem)',
              color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </span>
            {!house && zoneBadge && (
              <span style={{ ...badgePillStyle, fontSize: '0.45rem', padding: '2px 6px' }}>
                {zoneBadge}
              </span>
            )}
          </div>
          {/* Description with the price at the end — the list row is the only place it shows */}
          {desc && (
            <p style={{
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.6875rem',
              color: 'var(--ink-body-2)', margin: '2px 0 0',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {clampDesc(desc).replace(/\.\s*$/, '')}, {displayPrice}.
            </p>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            flexShrink: 0, width: 34, height: 34,
            background: 'transparent', border: 'none', color: 'var(--ink-faint)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
          }}
          aria-label={`Add ${name}`}
        >
          <svg viewBox="0 0 100 100" width="30" height="30" fill="none" stroke="currentColor" strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
            <circle cx="50" cy="50" r="46" strokeWidth="3.5"/>
            <line x1="50" y1="32" x2="50" y2="68" strokeWidth="4.5"/>
            <line x1="32" y1="50" x2="68" y2="50" strokeWidth="4.5"/>
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div
      id={`item-${id}`}
      onClick={onTap}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      {/* 16:9 media zone — no badge here */}
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--surface-media)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {hasCarousel ? (
          <VariantSlider
            images={variants!.map(v => ({ src: v.posterSrc ?? posterSrc ?? '', alt: `${name}, ${v.label}` }))}
            index={vIdx}
            onIndexChange={setVIdx}
            priority={priority}
            onInteract={() => setInteracted(true)}
          />
        ) : videoSrc ? (
          <CardVideo
            src={videoSrc} poster={posterSrc}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : posterSrc ? (
          <img
            src={posterSrc} alt={name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : null}

        {/* "peek" affordance — only for a plain static image (not video, not carousel). */}
        {posterSrc && !videoSrc && !hasCarousel && (
          <div style={{ position: 'absolute', inset: 0, background: 'var(--card-peek-scrim, rgb(0 0 0 / 0.4))', pointerEvents: 'none' }} aria-hidden />
        )}
        {posterSrc && !videoSrc && !hasCarousel && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: 'var(--card-peek-bg, rgb(0 0 0 / 0.34))',
            color: 'var(--card-peek-fg, #fff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none', backdropFilter: 'blur(2px)',
            boxShadow: '0 2px 10px rgb(0 0 0 / 0.22)',
          }}>
            <EyeSvg size={22} />
          </div>
        )}

        {/* FAB add button */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            position: 'absolute', bottom: 8, right: 8,
            width: 34, height: 34, borderRadius: '50%',
            border: 'none', background: 'var(--fab-bg)', color: 'var(--fab-fg)',
            fontFamily: 'var(--font-text)', fontSize: '1.375rem', fontWeight: 300,
            lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgb(0 0 0 / 0.28), 0 0 0 1px rgb(255 255 255 / 0.18)', paddingBottom: 2,
          }}
          aria-label={`Add ${name}`}
        >
          <svg viewBox="0 0 100 100" width="22" height="22" fill="none" stroke="currentColor" strokeLinecap="round" style={{ display: 'block' }} aria-hidden>
            <line x1="50" y1="22" x2="50" y2="78" strokeWidth="7"/>
            <line x1="22" y1="50" x2="78" y2="50" strokeWidth="7"/>
          </svg>
        </button>
      </div>

      {/* body */}
      <div style={{ padding: '10px 14px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {/* eyebrow: signature marker above the description — heart glyph + label, no border */}
        {house && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: 'var(--font-text)', fontSize: '0.5rem', fontWeight: 600,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brand)',
          }}>
            {houseIndicator && <HouseMark kind={houseIndicator} size={10} inline />}
            <span>{badge ?? 'Best seller'}</span>
          </div>
        )}
        {/* 2×2 grid — desc/name left col, badge/price right col */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px',
          gridTemplateRows: '1fr auto',
          columnGap: 10,
          rowGap: 10,
        }}>
          {/* row 1: description — takes the badge column too when there is no corner badge */}
          <p style={{
            gridColumn: (!house && zoneBadge) ? 1 : '1 / -1', gridRow: 1,
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
            lineHeight: 1.45, color: 'var(--ink-body-2)', margin: 0,
            textWrap: 'pretty' as React.CSSProperties['textWrap'],
            alignSelf: 'start',
          }}>
            {desc}
          </p>
          {/* row 1 right: sweetness above the price (BB position) + optional unit badge */}
          <div style={{
            gridColumn: 2, gridRow: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5,
            alignSelf: 'start',
          }}>
            {!house && zoneBadge && <span style={{ ...badgePillStyle, marginRight: -6 }}>{zoneBadge}</span>}
          </div>
          {/* row 2 left: name */}
          <span style={{
            gridColumn: 1, gridRow: 2,
            fontFamily: 'var(--font-display)', fontSize: 'var(--card-title-size, 0.9375rem)',
            letterSpacing: '0.01em', color: 'var(--ink)', lineHeight: 1.1,
            alignSelf: 'end',
          }}>
            {name}
          </span>
          {/* row 2 right: price */}
          <span style={{
            gridColumn: 2, gridRow: 2,
            fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
            letterSpacing: '0.03em', color: 'var(--brand)', textAlign: 'right',
            alignSelf: 'end',
          }}>
            {displayPrice}
          </span>
        </div>
      </div>
    </div>
  )
}
