'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Icon, { type IconName } from '@/components/admin/Icon'
import Brandmark from '@/components/admin/Brandmark'

const NAV_W_EXPANDED = 236
const NAV_W_COLLAPSED = 68
const STORAGE_KEY = 'osp-admin-nav'

interface NavItem {
  icon: IconName
  label: string
  href: string | null // null = inert in Phase 1
}

const NAV: NavItem[] = [
  { icon: 'dashboard', label: 'Dashboard', href: '/admin' },
  { icon: 'menu', label: 'Menu', href: '/admin/menu' },
  { icon: 'qr', label: 'QR code', href: '/admin/qr' },
  { icon: 'settings', label: 'Settings', href: '/admin/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      const c = localStorage.getItem(STORAGE_KEY)
      if (c !== null) setCollapsed(c === '1')
    } catch {}
  }, [])

  const toggle = () => {
    setCollapsed(prev => {
      const next = !prev
      try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0') } catch {}
      return next
    })
  }

  const expanded = !collapsed
  const justify = collapsed ? 'center' : 'flex-start'

  const itemBase: React.CSSProperties = {
    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: justify,
    gap: 13, height: 42, padding: '0 13px', textDecoration: 'none',
    borderRadius: 'var(--r-asym-sm)', whiteSpace: 'nowrap',
  }

  const renderItem = (item: NavItem) => {
    const active = item.href != null && pathname === item.href
    const body = (
      <>
        {active && (
          <span style={{ position: 'absolute', left: 0, top: 7, bottom: 7, width: 3, background: 'var(--core)' }} />
        )}
        <Icon name={item.icon} size={20} style={{ color: active ? 'var(--ink)' : 'var(--ink-3)' }} />
        {expanded && (
          <span style={{
            fontSize: 'var(--fs-ui)', fontWeight: active ? 600 : 400,
            color: active ? 'var(--ink)' : 'var(--ink-2)',
          }}>
            {item.label}
          </span>
        )}
      </>
    )

    if (item.href && active) {
      return <div key={item.label} title={item.label} style={{ ...itemBase, background: 'var(--fill-selected)' }}>{body}</div>
    }
    if (item.href) {
      return (
        <Link key={item.label} href={item.href} title={item.label} className="admin-nav-link" style={itemBase}>
          {body}
        </Link>
      )
    }
    // inert (Phase 1): present but not yet wired
    return (
      <div key={item.label} title={`${item.label} — coming soon`} aria-disabled="true"
        style={{ ...itemBase, cursor: 'default', opacity: 0.85 }}>
        {body}
      </div>
    )
  }

  return (
    <aside style={{
      width: collapsed ? NAV_W_COLLAPSED : NAV_W_EXPANDED, flexShrink: 0,
      background: 'var(--surface-panel)', borderRight: '1px solid var(--line)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 180ms var(--ease)', overflow: 'hidden',
    }}>
      {/* brand */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 11, height: 58, padding: '0 18px',
        borderBottom: '1px solid var(--line-subtle)', flexShrink: 0,
      }}>
        <Brandmark size={24} />
        {expanded && (
          <>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: '0.01em',
              textTransform: 'uppercase', color: 'var(--ink)', whiteSpace: 'nowrap',
            }}>
              Saly
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--ink-3)', paddingTop: 2,
            }}>
              admin
            </span>
          </>
        )}
      </div>

      {/* nav */}
      <nav style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 2,
        padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden',
      }}>
        {NAV.map(renderItem)}
      </nav>

      {/* collapse toggle */}
      <button
        onClick={toggle}
        title={collapsed ? 'Expand' : 'Collapse'}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: justify, gap: 12, height: 42,
          margin: '8px 10px', padding: '0 14px', background: 'transparent', border: 'none',
          borderTop: '1px solid var(--line-subtle)', cursor: 'pointer', color: 'var(--ink-3)',
        }}
      >
        <Icon name="collapse" size={18} style={{
          color: 'var(--ink-3)', transition: 'transform 180ms', transform: collapsed ? 'rotate(180deg)' : 'none',
        }} />
        {expanded && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Collapse
          </span>
        )}
      </button>

      {/* user */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 11, height: 60, padding: '0 16px',
        borderTop: '1px solid var(--line-subtle)', flexShrink: 0,
      }}>
        <span style={{
          width: 32, height: 32, background: 'var(--surface-sunken)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: '#B06A1E', flexShrink: 0,
        }}>
          M
        </span>
        {expanded && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Manager</div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-3)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              you@company.com
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
