'use client'

import CardVideo from '@/components/CardVideo'
import { parsePriceDisplay } from '@/lib/locale'

interface Props {
  id: string
  name: string
  desc: string
  price: string
  badge?: string
  compact?: boolean
  videoSrc?: string
  posterSrc?: string
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

export default function FoodCard({ id, name, desc, price, badge, compact, videoSrc, posterSrc, onTap, onAdd }: Props) {
  const { amount, unit } = parsePriceDisplay(price)
  // price shows amount only; unit becomes a badge label (rule: per-unit info belongs near name, not in price)
  const displayPrice = amount
  // derive unit badge from price string if no explicit badge set
  const zoneBadge = badge ?? (unit ? 'Per ' + unit.replace('PER ', '').toLowerCase() : null)

  if (compact) {
    return (
      <div
        id={`item-${id}`}
        onClick={onTap}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 12,
          padding: '10px 0',
          borderBottom: '1px solid var(--hairline)',
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Line 1: name + badge */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, overflow: 'hidden' }}>
            <span style={{
              flex: 1, minWidth: 0,
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </span>
            {zoneBadge && (
              <span style={{ ...badgePillStyle, fontSize: '0.45rem', padding: '2px 6px' }}>
                {zoneBadge}
              </span>
            )}
          </div>
          <p style={{
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.6875rem',
            color: 'var(--ink-faint)', margin: '2px 0 0',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {desc ? `${desc} ${displayPrice}` : displayPrice}
          </p>
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
        {videoSrc ? (
          <CardVideo
            src={videoSrc} poster={posterSrc}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : posterSrc ? (
          <img
            src={posterSrc} alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : null}

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

      {/* body: 2×2 grid — desc/name left col, badges/price right col */}
      <div style={{
        padding: '10px 14px 13px',
        display: 'grid',
        gridTemplateColumns: '1fr 80px',
        gridTemplateRows: '1fr auto',
        columnGap: 10,
        rowGap: 10,
      }}>
        {/* row 1 left: description */}
        <p style={{
          gridColumn: 1, gridRow: 1,
          fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.71875rem',
          lineHeight: 1.4, color: 'var(--ink-faint)', margin: 0,
          textWrap: 'pretty' as React.CSSProperties['textWrap'],
          alignSelf: 'start',
        }}>
          {desc}
        </p>
        {/* row 1 right: badges (always occupies column even when empty) */}
        <div style={{
          gridColumn: 2, gridRow: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
          alignSelf: 'start',
        }}>
          {zoneBadge && <span style={{ ...badgePillStyle, marginRight: -6 }}>{zoneBadge}</span>}
        </div>
        {/* row 2 left: name */}
        <span style={{
          gridColumn: 1, gridRow: 2,
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.125rem',
          letterSpacing: '0.01em', color: 'var(--ink)', lineHeight: 1.1,
          alignSelf: 'end',
        }}>
          {name}
        </span>
        {/* row 2 right: price */}
        <span style={{
          gridColumn: 2, gridRow: 2,
          fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.9375rem',
          color: 'var(--ink-heading)', textAlign: 'right',
          alignSelf: 'end',
        }}>
          {displayPrice}
        </span>
      </div>
    </div>
  )
}
