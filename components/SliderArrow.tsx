import type { CSSProperties } from 'react'

/** Chevron glyph for the variant slider arrows (matches the detail back button). */
export function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="8" height="14" viewBox="0 0 6 11" fill="none"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', transform: dir === 'left' ? 'rotate(180deg)' : undefined }}
      aria-hidden
    >
      <path d="M1 1.5 L5 5.5 L1 9.5" />
    </svg>
  )
}

/** Brand-styled round arrow button over a media zone. Same look on the card and the detail. */
export function sliderArrow(side: 'left' | 'right'): CSSProperties {
  const base: CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 2,
    width: 34, height: 34, borderRadius: '50%', border: 'none',
    background: 'var(--surface-dark-2)', color: 'var(--on-dark)',
    boxShadow: '0 2px 10px rgb(0 0 0 / 0.25)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
  }
  return side === 'left' ? { ...base, left: 8 } : { ...base, right: 8 }
}
