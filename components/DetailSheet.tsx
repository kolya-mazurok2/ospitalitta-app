'use client'

import TasteMark from '@/components/TasteMark'
import MenuBackdrop from '@/components/MenuBackdrop'

interface DishRow {
  name: string
  price: string
  onOpen: () => void
  onAdd: () => void
}

interface TasteRow {
  taste: 'bitter' | 'sour' | 'sweet'
  n: 1 | 2 | 3
}

interface Props {
  name: string
  desc: string
  price: string
  taste?: 'bitter' | 'sour' | 'sweet'
  n?: 1 | 2 | 3
  tastes?: TasteRow[]    // full profile; falls back to the single taste/n pair
  single?: boolean
  loved?: boolean
  house?: boolean
  isFood: boolean
  pairLabel?: string     // "What this drink loves on the plate:"
  dishes?: DishRow[]
  hasWhy: boolean
  whyIsCocktail: boolean
  whyLead?: string       // colored bold prefix
  whyDrink?: string      // cocktail name (underlined)
  whyPost?: string       // rest of sentence
  foodWhy?: string       // food pairing single-string why
  onClose: () => void
  onAdd: () => void
  onOpenLegend?: () => void   // same target as the header's info control
  backgroundTheme?: 'seafood' | 'cocktail' | 'patisserie' | 'none'
}

export default function DetailSheet({
  name, desc, price, taste, n, tastes, single, loved, house,
  pairLabel, dishes, hasWhy, whyIsCocktail, whyLead, whyDrink, whyPost, foodWhy,
  onClose, onAdd, onOpenLegend, backgroundTheme,
}: Props) {
  // Multi-taste items carry their own list; single-taste ones are described by taste + n.
  const tasteRows: TasteRow[] =
    tastes?.length ? tastes : (taste && n ? [{ taste, n }] : [])

  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        className="animate-bb-dim"
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--sheet-scrim)',
          // Minimal blur — pushes the menu list behind the sheet out of focus so the
          // sheet's own text reads cleanly. Kept low: heavier values cost frames on old Androids.
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          zIndex: 5,
        }}
      />

      {/* sheet */}
      <div
        className="animate-bb-up"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          height: '60%',
          background: 'var(--sheet-bg)',
          borderRadius: 'var(--sheet-radius)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 6,
          boxShadow: '0 -20px 50px rgb(0 0 0 / 0.3)',
        }}
      >
        <MenuBackdrop theme={backgroundTheme ?? 'none'} />

        {/* close */}
        <div style={{ flexShrink: 0, padding: '10px 14px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 34, height: 34, border: 'none', background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', padding: 0,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"
              stroke="var(--ink-heading)" strokeWidth="1.4" strokeLinecap="round"
              style={{ display: 'block' }} aria-hidden>
              <path d="M1.5 1.5 L13.5 13.5 M13.5 1.5 L1.5 13.5" />
            </svg>
          </button>
        </div>

        {/* scrollable body */}
        <div
          className="scrollbar-none"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 24px 92px' }}
        >
          {/* item header */}
          <div style={{ marginTop: 4 }}>
            {loved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9 }}>
                <span style={{
                  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.53125rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--brand)', lineHeight: 1,
                }}>
                  loved here
                </span>
                <svg viewBox="154 164 314 303" style={{ width: 12, height: 12, display: 'block', fill: 'var(--brand)' }} aria-hidden>
                  <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
                  <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
                </svg>
              </div>
            )}

            {/* name + olive — price moved below the description */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.0625rem',
                  letterSpacing: '0.01em', color: 'var(--ink)',
                  lineHeight: 1.1, whiteSpace: 'nowrap',
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
            </div>

            {/* taste profile — one row per taste axis, full width, no side column */}
            {tasteRows.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px 20px', marginTop: 14, color: 'var(--brand)' }}>
                {tasteRows.map((r, i) => (
                  <TasteMark key={i} taste={r.taste} n={r.n} single={single} size={22} style={{ gap: 5 }} />
                ))}
                {onOpenLegend && (
                  <button
                    onClick={onOpenLegend}
                    aria-label="How to read this menu"
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', flexShrink: 0,
                    }}
                  >
                    {/* same sprite glyph as the header control — opens the same legend sheet */}
                    <svg width={17} height={17} style={{ display: 'block', color: 'var(--ink-faint)' }} aria-hidden>
                      <use href="#ui-info" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* desc */}
            <p style={{
              fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '1rem',
              lineHeight: 1.5, color: 'var(--ink-body)',
              textWrap: 'pretty', margin: '14px 0 0',
            }}>
              {desc}
            </p>

            {/* price */}
            <div style={{
              fontFamily: 'var(--font-text)', fontSize: '0.875rem',
              letterSpacing: '0.03em', color: 'var(--brand)', marginTop: 12,
            }}>
              {price}
            </div>

          </div>

          {/* pairing block */}
          {dishes && dishes.length > 0 && (
            <div style={{ marginTop: 22 }}>
              {/* why — always on, full width, above the label. No "?" to discover. */}
              {hasWhy && (
                <div style={{
                  // Bleeds past the body's 24px side padding — edge to edge of the sheet.
                  margin: '0 -24px 14px',
                  padding: '12px 24px',
                  background: 'var(--surface-dark)',
                }}>
                  {whyIsCocktail ? (
                    <p style={{ fontFamily: 'var(--font-text)', fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--on-dark-2)', margin: 0 }}>
                      <span style={{ fontWeight: 500, color: 'var(--brand-bright)' }}>{whyLead}</span>
                      {' '}
                      <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{whyDrink}</span>
                      {whyPost}
                    </p>
                  ) : (
                    <p style={{ fontFamily: 'var(--font-text)', fontSize: '0.8125rem', lineHeight: 1.5, color: 'var(--on-dark-2)', margin: 0 }}>
                      {foodWhy}
                    </p>
                  )}
                </div>
              )}

              <span style={{
                display: 'block',
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.875rem',
                letterSpacing: '0.01em', color: 'var(--ink-heading)', lineHeight: 1.3,
              }}>
                {pairLabel}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
                {dishes.map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 0',
                    borderTop: '1px solid rgb(84 89 90 / 0.12)',
                  }}>
                    <span
                      onClick={d.onOpen}
                      style={{ flex: 1, minWidth: 0, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
                    >
                      <span style={{
                        fontFamily: 'var(--font-text)', fontWeight: 400, fontSize: '0.875rem',
                        color: 'var(--ink-body-2)',
                      }}>
                        {d.name}
                      </span>
                      <svg width="5" height="9" viewBox="0 0 6 11" fill="none"
                        stroke="rgb(84 89 90 / 0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        style={{ display: 'block', flexShrink: 0 }}>
                        <path d="M1 1.5 L5 5.5 L1 9.5" />
                      </svg>
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                      letterSpacing: '0.05em', color: 'var(--brand)', flexShrink: 0,
                    }}>
                      {d.price}
                    </span>
                    <button
                      onClick={d.onAdd}
                      style={{
                        flexShrink: 0, width: 27, height: 27, borderRadius: '50%',
                        border: '1px solid rgb(84 89 90 / 0.3)',
                        background: 'transparent', color: 'var(--ink-heading)',
                        fontFamily: 'var(--font-text)', fontSize: '1.0625rem', fontWeight: 300,
                        lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', paddingBottom: 1,
                      }}
                      aria-label={`Add ${d.name}`}
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* FAB — add to cart */}
        <button
          onClick={onAdd}
          style={{
            position: 'absolute', right: 24, bottom: 24,
            width: 52, height: 52, borderRadius: '50%',
            border: 'none', background: 'var(--fab-bg)', color: 'var(--fab-fg)',
            fontFamily: 'var(--font-text)', fontSize: '1.875rem', fontWeight: 300,
            lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', paddingBottom: 3,
            boxShadow: '0 8px 22px rgb(0 0 0 / 0.3)', zIndex: 30,
          }}
          aria-label={`Add ${name} to cart`}
        >
          +
        </button>
      </div>
    </>
  )
}
