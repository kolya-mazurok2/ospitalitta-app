import Glass from '@/components/Glass'
import TasteMark from '@/components/TasteMark'
import type { GlassType } from '@/lib/menu-data'

interface Props {
  id: string
  name: string
  desc: string
  price: string
  glass: GlassType
  taste: string
  lvl?: 1 | 2 | 3
  flavor?: 'sweet' | 'sour'
  loved?: boolean
  house?: boolean
  houseIndicator?: string
  compact?: boolean
  videoSrc?: string
  posterSrc?: string
  lovedLabel: string
  onTap: () => void
  onAdd: (e: React.MouseEvent) => void
}

function OliveSvg({ size = 11, inline = false, style: extraStyle }: { size?: number; inline?: boolean; style?: React.CSSProperties }) {
  return (
    <svg
      width={size} height={Math.round(size * 13 / 11)} viewBox="0 0 24 24"
      style={inline
        ? { display: 'inline-block', verticalAlign: 'middle', position: 'relative', top: '-1px', flexShrink: 0, ...extraStyle }
        : { display: 'block', flexShrink: 0, ...extraStyle }
      }
      aria-hidden
    >
      <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
      <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
      <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
    </svg>
  )
}

export default function ItemCard({
  id, name, desc, price, glass, taste, lvl, flavor,
  loved, house, houseIndicator, compact, videoSrc, posterSrc, lovedLabel, onTap, onAdd,
}: Props) {
  let markTaste: 'bitter' | 'sour' | 'sweet' | undefined
  let markN: 1 | 2 | 3 | undefined
  let markSingle = false
  if (taste === 'zero' && flavor) {
    markTaste = flavor; markN = 1; markSingle = true
  } else if ((taste === 'bitter' || taste === 'sour' || taste === 'sweet') && lvl) {
    markTaste = taste; markN = lvl
  }

  const showIndicator = house && houseIndicator === 'olive'

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
          {/* Line 1: name + indicator — inline so olive sits flush against text */}
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              color: 'var(--ink)', verticalAlign: 'middle',
            }}>
              {name}
            </span>
            {showIndicator && <OliveSvg size={9} inline style={{ marginLeft: 3 }} />}
          </div>
          {/* Line 2: desc truncates, price always fits — same font so they read as one text */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 0, marginTop: 2 }}>
            <p style={{
              flex: 1, minWidth: 0, margin: 0,
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.6875rem',
              color: 'var(--ink-faint)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {desc}
            </p>
            <span style={{
              flexShrink: 0,
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.6875rem',
              color: 'var(--ink-faint)',
            }}>
              {desc ? ' ' : ''}{price}
            </span>
          </div>
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
      {/* 16:9 media zone */}
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--surface-media)',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {videoSrc ? (
          <video
            src={videoSrc} poster={posterSrc}
            autoPlay loop playsInline muted
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <Glass type={glass} style={{ width: 40, height: 56, color: 'rgb(84 89 90 / 0.3)' }} />
        )}

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

      {/* body: 2×2 grid — desc/name left, TasteMark+price right. loved spans full width above */}
      <div style={{ padding: '10px 15px 14px' }}>
        {loved && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 7 }}>
            <svg viewBox="154 164 314 303" style={{ width: 12, height: 12, display: 'block', flexShrink: 0, fill: 'var(--brand)' }} aria-hidden>
              <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
              <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.53125rem',
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--brand)', lineHeight: 1, whiteSpace: 'nowrap',
            }}>
              {lovedLabel}
            </span>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 80px',
          gridTemplateRows: '1fr auto',
          columnGap: 14,
          rowGap: 8,
        }}>
          {/* [1,1] desc */}
          <p style={{
            gridColumn: 1, gridRow: 1,
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
            lineHeight: 1.45, color: 'var(--ink-body-2)',
            margin: 0, textWrap: 'pretty' as React.CSSProperties['textWrap'],
            alignSelf: 'start',
          }}>
            {desc}
          </p>

          {/* [1,2] TasteMark */}
          <div style={{
            gridColumn: 2, gridRow: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
            alignSelf: 'start',
          }}>
            {markTaste && markN && (
              <span style={{ color: 'var(--brand)', display: 'flex', alignItems: 'flex-end' }}>
                <TasteMark taste={markTaste} n={markN} single={markSingle} />
              </span>
            )}
          </div>

          {/* [2,1] name + olive indicator */}
          <div style={{ gridColumn: 1, gridRow: 2, alignSelf: 'end' }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              letterSpacing: '0.01em', color: 'var(--ink)',
              verticalAlign: 'middle',
            }}>
              {name}
            </span>
            {showIndicator && <OliveSvg size={11} inline style={{ marginLeft: 3 }} />}
          </div>

          {/* [2,2] price */}
          <span style={{
            gridColumn: 2, gridRow: 2,
            fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
            letterSpacing: '0.03em', color: 'var(--brand)',
            textAlign: 'right', alignSelf: 'end',
          }}>
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}
