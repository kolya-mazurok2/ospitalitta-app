// Horizontal ranked bar: label + value + track/fill.
// Reused by Countries (with code, % value, gold) / Most bookmarked (ember) / Most viewed (gold).
export default function RankBar({
  code, name, value, pct, color,
}: { code?: string; name: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 10,
        justifyContent: code ? 'flex-start' : 'space-between',
      }}>
        {code && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
            color: 'var(--ink-2)', width: 24, flexShrink: 0,
          }}>
            {code}
          </span>
        )}
        <span style={{
          fontSize: 14, color: 'var(--ink)', flex: code ? 1 : undefined, minWidth: 0,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {name}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>
          {code ? `${value}%` : value}
        </span>
      </div>
      <div style={{
        height: 6, background: 'var(--surface-sunken)',
        marginTop: code ? 6 : 7, marginLeft: code ? 34 : 0,
      }}>
        <div style={{ height: 6, width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}
