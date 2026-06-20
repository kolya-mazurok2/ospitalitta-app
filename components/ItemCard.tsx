import Glass from '@/components/Glass'
import TasteMark from '@/components/TasteMark'
import type { GlassType, TasteKey } from '@/lib/menu-data'

interface Props {
  id: string
  name: string
  desc: string
  price: string
  glass: GlassType
  taste: TasteKey           // section key
  lvl?: 1 | 2 | 3          // intensity (bitter/sour/sweet items)
  flavor?: 'sweet' | 'sour' // zero items only
  loved?: boolean
  house?: boolean
  videoSrc?: string
  posterSrc?: string
  lovedLabel: string        // "loved here"
  onTap: () => void
  onAdd: (e: React.MouseEvent) => void
}

export default function ItemCard({
  id, name, desc, price, glass, taste, lvl, flavor,
  loved, house, videoSrc, posterSrc, lovedLabel, onTap, onAdd,
}: Props) {
  const hasVideo = !!videoSrc

  // resolve TasteMark params
  let markTaste: 'bitter' | 'sour' | 'sweet' | undefined
  let markN: 1 | 2 | 3 | undefined
  let markSingle = false
  if (taste === 'zero' && flavor) {
    markTaste = flavor
    markN = 1
    markSingle = true
  } else if ((taste === 'bitter' || taste === 'sour' || taste === 'sweet') && lvl) {
    markTaste = taste
    markN = lvl
  }

  return (
    <div
      id={`item-${id}`}
      onClick={onTap}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        cursor: 'pointer',
        overflow: 'hidden',
      }}
    >
      {/* media zone */}
      <div style={{
        aspectRatio: '16/9',
        background: 'var(--surface-media)',
        position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {hasVideo ? (
          <video
            src={videoSrc}
            poster={posterSrc}
            autoPlay
            loop
            playsInline
            muted
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <>
            <Glass type={glass} style={{ width: 40, height: 56, color: 'rgb(84 89 90 / 0.3)' }} />
            <span style={{
              position: 'absolute', bottom: 8, left: 10,
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontFamily: 'var(--font-text)', fontWeight: 400, fontSize: '0.5rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'rgb(84 89 90 / 0.32)',
            }}>
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none"
                stroke="rgb(84 89 90 / 0.32)" strokeWidth="1.7" style={{ display: 'block' }}>
                <rect x="3" y="6" width="18" height="13" rx="1.5" />
                <circle cx="12" cy="12.5" r="3.2" />
                <path d="M8 6l1.6-2.2h4.8L16 6" />
              </svg>
              photo
            </span>
          </>
        )}

        {/* add (+) */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            position: 'absolute', bottom: 8, right: 8,
            width: 34, height: 34, borderRadius: '50%',
            border: 'none', background: 'var(--fab-bg)', color: 'var(--fab-fg)',
            fontFamily: 'var(--font-text)', fontSize: '1.375rem', fontWeight: 300,
            lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 8px rgb(0 0 0 / 0.22)', paddingBottom: 2,
          }}
          aria-label={`Add ${name}`}
        >
          +
        </button>
      </div>

      {/* body */}
      <div style={{ padding: '13px 15px 15px' }}>
        {loved && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 8 }}>
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

        {/* desc + TasteMark */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <p style={{
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
            lineHeight: 1.45, color: 'var(--ink-body-2)',
            flex: 1, minWidth: 0, textWrap: 'pretty', margin: 0,
          }}>
            {desc}
          </p>
          {markTaste && markN && (
            <span style={{ flexShrink: 0, color: 'var(--brand)', display: 'flex', alignItems: 'flex-end', height: 20, position: 'relative', top: -3 }}>
              <TasteMark taste={markTaste} n={markN} single={markSingle} />
            </span>
          )}
        </div>

        {/* name + olive + price */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginTop: 9 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
              letterSpacing: '0.01em', color: 'var(--ink)', whiteSpace: 'nowrap',
            }}>
              {name}
            </span>
            {house && (
              <svg width="11" height="13" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
                <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
                <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
                <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
              </svg>
            )}
          </span>
          <span style={{
            fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
            letterSpacing: '0.03em', color: 'var(--brand)', flexShrink: 0,
          }}>
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}
