/** Sweetness scale — three sugar cubes, filled up to `level` (1–3). Venue-coloured via --brand. */
export default function SweetnessCubes({ level, size = 9, gap = 3 }: { level: 1 | 2 | 3; size?: number; gap?: number }) {
  return (
    <span
      style={{ display: 'inline-flex', gap, verticalAlign: 'middle' }}
      role="img"
      aria-label={`Sweetness ${level} of 3`}
    >
      {[1, 2, 3].map(i => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: 2,
            background: i <= level ? 'var(--brand)' : 'transparent',
            boxShadow: 'inset 0 0 0 1px var(--brand)',
          }}
        />
      ))}
    </span>
  )
}
