// Simple flex bar chart. Tallest bar = molten (core), the rest = chart-bar neutral.
// Reused by "Scans over time" and "Busiest hours".
export default function BarChart({
  bars, height, gap = 7, topGap = 20, labels,
}: { bars: number[]; height: number; gap?: number; topGap?: number; labels?: string[] }) {
  const max = Math.max(...bars, 1)
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap, height, marginTop: topGap }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.max(4, Math.round((h / max) * 100))}%`,
              background: h === max ? 'var(--core)' : 'var(--chart-bar)',
              minWidth: 2,
            }}
          />
        ))}
      </div>
      {labels && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          {labels.map((t, i) => (
            <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-4)' }}>{t}</span>
          ))}
        </div>
      )}
    </>
  )
}
