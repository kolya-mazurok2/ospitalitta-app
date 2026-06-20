interface Props {
  id: string
  name: string
  desc: string
  price: string
  onTap: () => void
  onAdd: (e: React.MouseEvent) => void
}

export default function FoodCard({ id, name, desc, price, onTap, onAdd }: Props) {
  return (
    <div
      id={`item-${id}`}
      onClick={onTap}
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        padding: '13px 15px 14px',
        cursor: 'pointer',
      }}
    >
      {/* name + price */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: '1rem',
          letterSpacing: '0.01em', color: 'var(--ink)',
        }}>
          {name}
        </span>
        <span style={{
          fontFamily: 'var(--font-text)', fontSize: '0.8125rem',
          letterSpacing: '0.03em', color: 'var(--brand)', flexShrink: 0,
        }}>
          {price}
        </span>
      </div>

      {/* desc + add button */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginTop: 7 }}>
        <p style={{
          fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.8125rem',
          lineHeight: 1.45, color: 'var(--ink-faint)',
          flex: 1, minWidth: 0, textWrap: 'pretty', margin: 0,
        }}>
          {desc}
        </p>
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(e) }}
          style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
            border: '1px solid rgb(84 89 90 / 0.3)',
            background: 'transparent', color: 'var(--ink-heading)',
            fontFamily: 'var(--font-text)', fontSize: '1.125rem', fontWeight: 300,
            lineHeight: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', paddingBottom: 1,
          }}
          aria-label={`Add ${name}`}
        >
          +
        </button>
      </div>
    </div>
  )
}
