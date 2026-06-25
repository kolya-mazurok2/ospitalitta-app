// KPI stat card: mono label · Anton number · success delta line.
export default function StatCard({
  label, value, delta, deltaSuffix,
}: { label: string; value: string; delta: string; deltaSuffix?: string }) {
  return (
    <div style={{
      background: 'var(--surface-panel)', border: '1px solid var(--line-subtle)',
      borderRadius: 'var(--r-asym-sm)', padding: '20px 22px',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--ink-3)',
      }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, lineHeight: 0.9, color: 'var(--ink)', marginTop: 12 }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--s-success-ink)', marginTop: 10 }}>
        ▲ {delta}{deltaSuffix ? ` ${deltaSuffix}` : ''}
      </div>
    </div>
  )
}
