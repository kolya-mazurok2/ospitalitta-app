'use client'

import { useState } from 'react'
import RangeToggle from '@/components/admin/RangeToggle'
import StatCard from '@/components/admin/StatCard'
import BarChart from '@/components/admin/BarChart'
import RankBar from '@/components/admin/RankBar'
import {
  RANGE_DATA, RANGE_WORD, COUNTRIES, BOOKMARKS, VIEWS, HOURS, HOUR_LABELS, fmt,
  type RangeKey,
} from '@/lib/admin/dashboard-mock'

const cardRaised: React.CSSProperties = {
  background: 'var(--surface-raised)', border: '1px solid var(--line-subtle)',
  borderRadius: 'var(--r-asym-sm)', padding: '20px 22px',
}
const cardHeading: React.CSSProperties = {
  fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--ink)',
}

export default function DashboardPage() {
  const [range, setRange] = useState<RangeKey>('week')
  const d = RANGE_DATA[range]
  const word = RANGE_WORD[range]
  const bMax = Math.max(...BOOKMARKS.map(b => b.n))
  const vMax = Math.max(...VIEWS.map(v => v.n))

  return (
    <>
      {/* topbar */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
        height: 58, padding: '0 28px', borderBottom: '1px solid var(--line)', flexShrink: 0,
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          menu analytics
        </span>
        <RangeToggle value={range} onChange={setRange} />
      </header>

      {/* content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '26px 28px 48px' }}>

        {/* title */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 0.9, textTransform: 'uppercase', color: 'var(--ink)' }}>
            Dashboard
          </h1>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)', marginBottom: 5, marginLeft: 'auto' }}>
            Saly · {word}
          </span>
        </div>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 22 }}>
          <StatCard label="Scans" value={fmt(d.scans)} delta={d.dScans} deltaSuffix={`· vs prev ${word}`} />
          <StatCard label="Unique visitors" value={fmt(d.unique)} delta={d.dUnique} />
          <StatCard label="Menu views" value={fmt(d.views)} delta={d.dViews} />
          <StatCard label="Bookmarks" value={fmt(d.bookmarks)} delta={d.dBook} />
        </div>

        {/* chart + countries */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, marginTop: 16, alignItems: 'start' }}>
          <div style={cardRaised}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <h2 style={cardHeading}>Scans over time</h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)' }}>{d.unit}</span>
            </div>
            <BarChart bars={d.bars} height={150} gap={range === 'month' ? 3 : 7} labels={d.labels} />
          </div>

          <div style={cardRaised}>
            <h2 style={cardHeading}>Where guests are from</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 18 }}>
              {COUNTRIES.map(c => (
                <RankBar key={c.code} code={c.code} name={c.name} value={String(c.pct)} pct={c.pct} color="var(--brand)" />
              ))}
            </div>
          </div>
        </div>

        {/* bookmarks + views + hours */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginTop: 16, alignItems: 'start' }}>
          <div style={cardRaised}>
            <h2 style={cardHeading}>Most bookmarked</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 18 }}>
              {BOOKMARKS.map(b => (
                <RankBar key={b.name} name={b.name} value={String(b.n)} pct={Math.round((b.n / bMax) * 100)} color="var(--danger)" />
              ))}
            </div>
          </div>

          <div style={cardRaised}>
            <h2 style={cardHeading}>Most viewed items</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 18 }}>
              {VIEWS.map(v => (
                <RankBar key={v.name} name={v.name} value={fmt(v.n)} pct={Math.round((v.n / vMax) * 100)} color="var(--brand)" />
              ))}
            </div>
          </div>

          <div style={cardRaised}>
            <h2 style={cardHeading}>Busiest hours</h2>
            <BarChart bars={HOURS} height={120} gap={5} topGap={18} labels={HOUR_LABELS} />
          </div>
        </div>
      </div>
    </>
  )
}
