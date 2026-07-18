interface Props {
  count: number
  totalStr: string    // e.g. "750"
  detailOpen: boolean // raises bar above detail sheet
  label: string       // "Show your waiter"
  onClick: () => void
}

export default function CartBar({ count, totalStr, detailOpen, label, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: 0, right: 0,
        // Sits flush on the bottom edge; rides above the detail sheet when one is open.
        bottom: detailOpen ? '60%' : 0,
        zIndex: detailOpen ? 7 : 5,
        background: 'var(--surface-dark-2)',
        color: 'var(--on-dark)',
        borderTop: '2px solid var(--hairline)',
        // Extra bottom padding clears the iOS home indicator when pinned to the edge.
        padding: detailOpen ? '14px 18px' : '14px 18px calc(14px + env(safe-area-inset-bottom, 0px))',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        cursor: 'pointer',
        boxShadow: '0 12px 30px rgb(0 0 0 / 0.28)',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <span style={{
          minWidth: 22, height: 22, padding: '0 7px', borderRadius: 11,
          background: 'var(--brand-on-dark)', color: 'var(--ink)',
          fontFamily: 'var(--font-text)', fontWeight: 600, fontSize: '0.75rem',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          {count}
        </span>
        <span style={{
          fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.78125rem',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {label}
        </span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
          letterSpacing: '0.04em', color: 'var(--brand-bright)',
        }}>
          {totalStr}
        </span>
        <svg width="6" height="11" viewBox="0 0 6 11" fill="none"
          stroke="var(--brand-bright)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ display: 'block', opacity: 0.8 }}>
          <path d="M1 1.5 L5 5.5 L1 9.5" />
        </svg>
      </span>
    </div>
  )
}
