'use client'

import type { RangeKey } from '@/lib/admin/dashboard-mock'

const OPTS: { key: RangeKey; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
]

export default function RangeToggle({ value, onChange }: { value: RangeKey; onChange: (r: RangeKey) => void }) {
  return (
    <div style={{ display: 'flex', border: '1px solid var(--line)', borderRadius: 'var(--r-asym-sm)', overflow: 'hidden' }}>
      {OPTS.map(o => {
        const on = value === o.key
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            style={{
              fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600, padding: '8px 14px',
              border: 'none', cursor: 'pointer',
              background: on ? 'var(--ink)' : 'transparent',
              color: on ? '#FAF4E8' : 'var(--ink-2)',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
