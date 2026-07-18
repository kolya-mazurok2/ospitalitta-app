import Glass from '@/components/Glass'
import TasteMark from '@/components/TasteMark'
import FramedPlaque from '@/components/FramedPlaque'
import type { GlassType } from '@/lib/menu-data'

interface Props {
  name: string
  desc: string
  price: string
  glass: GlassType
  taste: string
  n?: 1 | 2 | 3
  house?: boolean
  label: string      // messages pick.label
  onTap: () => void
  onDismiss: () => void
}

export default function FeaturedPick({ name, desc, price, glass, taste, n, house, label, onTap, onDismiss }: Props) {
  const showMark = (taste === 'bitter' || taste === 'sour' || taste === 'sweet') && n

  return (
    <FramedPlaque
      style={{ position: 'relative', marginTop: 16, padding: '13px 15px 14px', cursor: 'pointer' }}
      onClick={onTap}
    >
      {/* dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss() }}
        style={{
          position: 'absolute', top: 7, right: 7,
          width: 24, height: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'rgb(84 89 90 / 0.45)', padding: 0, zIndex: 2,
        }}
        aria-label="Dismiss"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'block' }}>
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {/* eyebrow */}
      <div style={{
        fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.5625rem',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--brand)', marginBottom: 9,
      }}>
        {label}
      </div>

      {/* content row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Glass type={glass} style={{ width: 26, height: 36, flexShrink: 0, marginTop: 2, color: 'rgb(140 138 124)' }} />

        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {/* desc + TasteMark */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <p style={{
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.84375rem',
              lineHeight: 1.45, color: 'var(--ink)', flex: 1, minWidth: 0,
              textWrap: 'pretty',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              margin: 0,
            }}>
              {desc}
            </p>
            {showMark && (
              <span style={{ flexShrink: 0, color: 'var(--brand)', display: 'flex', alignItems: 'flex-start', paddingTop: 3 }}>
                <TasteMark taste={taste as 'bitter' | 'sour' | 'sweet'} n={n!} />
              </span>
            )}
          </div>

          {/* name + price */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', minWidth: 0, position: 'relative' }}>
              {house && (
                <svg width="11" height="13" viewBox="0 0 24 24"
                  style={{ position: 'absolute', right: -15, top: '50%', transform: 'translateY(-50%)', display: 'block', flexShrink: 0 }}>
                  <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
                  <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
                  <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
                </svg>
              )}
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
                letterSpacing: '0.01em', color: 'var(--ink)', whiteSpace: 'nowrap',
              }}>
                {name}
              </span>
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
    </FramedPlaque>
  )
}
