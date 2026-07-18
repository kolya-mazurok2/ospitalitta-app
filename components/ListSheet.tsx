interface CartLine {
  slug: string
  name: string
  qty: number
  lineTotal: string   // e.g. "L1500"
  onMinus: () => void
  onPlus: () => void
  onOpen?: () => void   // opens the item's detail sheet
}

interface Props {
  lines: CartLine[]
  totalStr: string
  heading: string        // "Show this to your server"
  totalLabel: string     // "Total · Lekë"
  clearLabel: string     // "Clear order"
  confirmLabel: string   // "Place order"
  onClear: () => void
  onConfirm: () => void
  onClose: () => void
  /** Order is placed: the list locks, the actions are replaced by the thanks block. */
  placed?: boolean
  placedHeading?: string
  changeLabel?: string           // unlocks the order for editing
  onChange?: () => void
  thanksBody?: React.ReactNode   // sentence with the review link inside it
  newOrderLabel?: string
  onNewOrder?: () => void
}

/**
 * The waiter list, in two states.
 *
 * After "Place order" the sheet does NOT go away and is NOT replaced by a separate thanks
 * screen: nobody has actually shown the order to anyone yet, and that is the entire job of
 * this screen. It stays up and stops being dismissable: a guest who taps the scrim by
 * accident should not have to find their way back to the order the server is walking over
 * to read. Quantities lock and rows stop being tappable so a confirmed order cannot drift
 * under the server's eyes, but "Change order" hands editing straight back.
 */
export default function ListSheet({
  lines, totalStr,
  heading, totalLabel, clearLabel, confirmLabel,
  onClear, onConfirm, onClose,
  placed, placedHeading, changeLabel, onChange, thanksBody, newOrderLabel, onNewOrder,
}: Props) {
  return (
    <>
      {/* scrim */}
      <div
        onClick={placed ? undefined : onClose}
        className="animate-bb-dim"
        style={{ position: 'absolute', inset: 0, background: 'var(--sheet-scrim)', zIndex: 7 }}
      />

      {/* sheet */}
      <div
        className="animate-bb-up scrollbar-none"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'var(--sheet-bg)',
          borderRadius: 'var(--sheet-radius)',
          padding: '14px 22px 30px',
          zIndex: 8,
          boxShadow: '0 -20px 50px rgb(0 0 0 / 0.3)',
          maxHeight: '94%',
          overflowY: 'auto',
        }}
      >
        {/* close button — gone once the order is placed, the sheet is the receipt now */}
        {!placed && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 14,
            width: 32, height: 32, zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--ink-faint)', padding: 0,
          }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'block' }}>
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        )}

        {/* heading */}
        <div style={{ marginTop: 12, paddingRight: 40 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4375rem',
            letterSpacing: '0.04em', color: 'var(--ink-heading)', lineHeight: 1.1,
          }}>
            {placed ? (placedHeading ?? heading) : heading}
          </h3>
        </div>

        {/* cart lines */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, borderTop: '1px solid var(--line)' }}>
          {lines.map(l => (
            <div key={l.slug} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid var(--line-soft)',
            }}>
              {/* stepper — a plain count once the order is locked */}
              {placed ? (
                <span style={{
                  minWidth: 28, textAlign: 'center', flexShrink: 0,
                  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.875rem',
                  color: 'var(--ink-heading)',
                }}>
                  {l.qty}×
                </span>
              ) : (
              <div style={{
                display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                border: '1px solid var(--line-strong)',
              }}>
                <button
                  onClick={l.onMinus}
                  style={{
                    width: 28, height: 28, background: 'transparent', border: 'none',
                    cursor: 'pointer', fontFamily: 'var(--font-text)', fontSize: '1rem',
                    color: 'var(--ink-heading)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label={`Remove one ${l.name}`}
                >
                  −
                </button>
                <span style={{
                  minWidth: 22, textAlign: 'center',
                  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
                  color: 'var(--ink-heading)',
                }}>
                  {l.qty}
                </span>
                <button
                  onClick={l.onPlus}
                  style={{
                    width: 28, height: 28, background: 'transparent', border: 'none',
                    cursor: 'pointer', fontFamily: 'var(--font-text)', fontSize: '0.9375rem',
                    color: 'var(--ink-heading)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label={`Add one more ${l.name}`}
                >
                  +
                </button>
              </div>
              )}

              <span
                onClick={placed ? undefined : l.onOpen}
                style={{
                  flex: 1, minWidth: 0,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
                  letterSpacing: '0.01em', color: 'var(--ink)',
                  cursor: (!placed && l.onOpen) ? 'pointer' : 'default',
                }}
              >
                {l.name}
                {!placed && l.onOpen && (
                  <svg width="6" height="11" viewBox="0 0 6 11" fill="none"
                    stroke="var(--ink-heading)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                    style={{ display: 'block', flexShrink: 0 }} aria-hidden>
                    <path d="M1 1.5 L5 5.5 L1 9.5" />
                  </svg>
                )}
              </span>

              <span style={{
                fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
                letterSpacing: '0.03em', color: 'var(--brand)', flexShrink: 0,
              }}>
                {l.lineTotal}
              </span>
            </div>
          ))}
        </div>

        {/* total */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginTop: 16 }}>
          <span style={{
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.6875rem',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--ink-faint)',
          }}>
            {totalLabel}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: '1.5rem',
            letterSpacing: '0.04em', color: 'var(--brand)',
          }}>
            {totalStr}
          </span>
        </div>

        {placed ? (
          <>
            {thanksBody && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                margin: '22px -22px 0', padding: '16px 22px',
                background: 'var(--surface-frame)',
                borderLeft: '2px solid var(--hairline)',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/brand/rating.svg" alt="" aria-hidden
                  style={{ width: 30, height: 30, display: 'block', flexShrink: 0, marginTop: 1 }}
                />
                <p style={{
                  fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.9375rem',
                  lineHeight: 1.5, color: 'var(--ink-body)', margin: 0,
                }}>
                  {thanksBody}
                </p>
              </div>
            )}

            <button
              onClick={onChange}
              style={{
                width: '100%', marginTop: 22,
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--ink-heading)', background: 'transparent',
                border: '1px solid var(--line)', padding: '14px 0', cursor: 'pointer',
              }}
            >
              {changeLabel}
            </button>

            <button
              onClick={onNewOrder}
              style={{
                width: '100%', marginTop: 10,
                fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--ink-heading)', background: 'transparent',
                border: '1px solid var(--line)', padding: '14px 0', cursor: 'pointer',
              }}
            >
              {newOrderLabel}
            </button>
          </>
        ) : (
          <>
        {/* confirm — the one action that ends the order */}
        <button
          onClick={onConfirm}
          style={{
            width: '100%', marginTop: 22,
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--surface)', background: 'var(--ink-heading)',
            border: 'none', padding: '14px 0', cursor: 'pointer',
          }}
        >
          {confirmLabel}
        </button>

        {/* clear order */}
        <button
          onClick={onClear}
          style={{
            width: '100%', marginTop: 10,
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--ink-faint)', background: 'transparent',
            border: '1px solid var(--line)', padding: '12px 0', cursor: 'pointer',
          }}
        >
          {clearLabel}
        </button>
          </>
        )}

      </div>
    </>
  )
}
