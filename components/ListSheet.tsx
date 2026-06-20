interface CartLine {
  slug: string
  name: string
  qty: number
  lineTotal: string   // e.g. "L1500"
  onMinus: () => void
  onPlus: () => void
}

interface Props {
  lines: CartLine[]
  totalStr: string
  heading: string        // "Show this to your waiter"
  totalLabel: string     // "Total · Lekë"
  clearLabel: string     // "Clear order"
  keepBrowsing: string   // "Keep browsing"
  onClear: () => void
  onClose: () => void
}

export default function ListSheet({
  lines, totalStr,
  heading, totalLabel, clearLabel, keepBrowsing,
  onClear, onClose,
}: Props) {
  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
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
        {/* drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            onClick={onClose}
            style={{ width: 42, height: 4, borderRadius: 4, background: 'rgb(84 89 90 / 0.28)', cursor: 'pointer' }}
          />
        </div>

        {/* heading */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.4375rem',
            letterSpacing: '0.04em', color: 'var(--ink-heading)', lineHeight: 1.1,
          }}>
            {heading}
          </h3>
        </div>

        {/* cart lines */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 20, borderTop: '1px solid rgb(84 89 90 / 0.18)' }}>
          {lines.map(l => (
            <div key={l.slug} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderBottom: '1px solid rgb(84 89 90 / 0.12)',
            }}>
              {/* stepper */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', flexShrink: 0,
                border: '1px solid rgb(84 89 90 / 0.3)',
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

              <span style={{
                flex: 1, minWidth: 0,
                fontFamily: 'var(--font-display)', fontSize: '0.9375rem',
                letterSpacing: '0.01em', color: 'var(--ink)',
              }}>
                {l.name}
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
            color: 'rgb(84 89 90 / 0.6)',
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

        {/* clear order */}
        <button
          onClick={onClear}
          style={{
            width: '100%', marginTop: 22,
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.75rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgb(84 89 90 / 0.45)', background: 'transparent',
            border: '1px solid rgb(84 89 90 / 0.22)', padding: '12px 0', cursor: 'pointer',
          }}
        >
          {clearLabel}
        </button>

        {/* keep browsing */}
        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 10,
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--surface)', background: 'var(--ink-heading)',
            border: 'none', padding: '14px 0', cursor: 'pointer',
          }}
        >
          {keepBrowsing}
        </button>
      </div>
    </>
  )
}
