'use client'

import { useState } from 'react'
import TasteMark from '@/components/TasteMark'
import MenuBackdrop from '@/components/MenuBackdrop'

interface DishRow {
  name: string
  price: string
  onOpen: () => void
  onAdd: () => void
}

interface Props {
  name: string
  desc: string
  price: string
  taste?: 'bitter' | 'sour' | 'sweet'
  n?: 1 | 2 | 3
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
  backgroundTheme?: 'seafood' | 'cocktail' | 'none'
}

export default function DetailSheet({
  name, desc, price, taste, n, single, loved, house,
  pairLabel, dishes, hasWhy, whyIsCocktail, whyLead, whyDrink, whyPost, foodWhy,
  onClose, onAdd, backgroundTheme,
}: Props) {
  const [tipOpen, setTipOpen] = useState(false)

  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        className="animate-bb-dim"
        style={{
          position: 'absolute', inset: 0,
          background: 'var(--sheet-scrim)',
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

        {/* drag handle */}
        <div style={{ flexShrink: 0, padding: '14px 0 6px', display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={onClose}
            style={{ width: 42, height: 4, borderRadius: 4, background: 'rgb(84 89 90 / 0.28)', cursor: 'pointer' }}
          />
        </div>

        {/* why tooltip — floats above drag handle */}
        {tipOpen && (
          <div style={{
            position: 'absolute',
            left: 24, right: 24,
            bottom: 'calc(100% - 30px)',
            zIndex: 99999,
            padding: '13px 15px',
            background: 'var(--surface-dark)',
            boxShadow: '0 12px 34px rgb(0 0 0 / 0.4)',
          }}>
            {whyIsCocktail ? (
              <p style={{
                fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                lineHeight: 1.5, color: 'var(--on-dark-2)', margin: 0,
              }}>
                <span style={{ fontWeight: 500, color: 'var(--brand-bright)' }}>{whyLead}</span>
                {' '}
                <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>{whyDrink}</span>
                {whyPost}
              </p>
            ) : (
              <p style={{
                fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                lineHeight: 1.5, color: 'var(--on-dark-2)', margin: 0,
              }}>
                {foodWhy}
              </p>
            )}
            {/* caret */}
            <div style={{
              position: 'absolute', top: '100%', right: 88,
              width: 0, height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderTop: '8px solid var(--surface-dark)',
            }} />
          </div>
        )}

        {/* scrollable body */}
        <div
          className="scrollbar-none"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '0 24px 92px' }}
        >
          {/* pairing block */}
          {dishes && dishes.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{
                  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.875rem',
                  letterSpacing: '0.01em', color: 'var(--ink-heading)', lineHeight: 1.3,
                }}>
                  {pairLabel}
                </span>
                {hasWhy && (
                  <button
                    onClick={() => setTipOpen(t => !t)}
                    style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: '1px solid rgb(84 89 90 / 0.4)',
                      background: 'transparent', color: 'var(--ink-heading)',
                      fontFamily: 'var(--font-text)', fontSize: '0.6875rem', fontWeight: 500,
                      lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    ?
                  </button>
                )}
              </div>

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

          {/* item header */}
          <div style={{ marginTop: 16 }}>
            {loved && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 9 }}>
                <svg viewBox="154 164 314 303" style={{ width: 12, height: 12, display: 'block', fill: 'var(--brand)' }} aria-hidden>
                  <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
                  <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.53125rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'var(--brand)', lineHeight: 1,
                }}>
                  loved here
                </span>
              </div>
            )}

            {/* desc + TasteMark */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <p style={{
                fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '1rem',
                lineHeight: 1.5, color: 'var(--ink-body)',
                flex: 1, minWidth: 0, textWrap: 'pretty', margin: 0,
              }}>
                {desc}
              </p>
              {taste && n && (
                <span style={{ flexShrink: 0, display: 'flex', alignItems: 'flex-start', paddingTop: 4, color: 'var(--brand)' }}>
                  <TasteMark taste={taste} n={n} single={single} />
                </span>
              )}
            </div>

            {/* name + olive + price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginTop: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                {house && (
                  <svg width="11" height="13" viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }} aria-hidden>
                    <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
                    <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
                    <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
                  </svg>
                )}
                <span style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.0625rem',
                  letterSpacing: '0.01em', color: 'var(--ink)',
                  lineHeight: 1.1, whiteSpace: 'nowrap',
                }}>
                  {name}
                </span>
              </span>
              <span style={{
                fontFamily: 'var(--font-text)', fontSize: '0.875rem',
                letterSpacing: '0.03em', color: 'var(--brand)', flexShrink: 0,
              }}>
                {price}
              </span>
            </div>
          </div>
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
