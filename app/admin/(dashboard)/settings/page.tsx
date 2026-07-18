import { getVenueRow } from '@/lib/admin-repo'
import { logout } from './actions'

const LOCALE_NAMES: Record<string, string> = {
  en: 'English', sq: 'Albanian', it: 'Italian', pl: 'Polish',
  uk: 'Ukrainian', de: 'German', fr: 'French', no: 'Norwegian',
}
const CURRENCY_NAME: Record<string, string> = { ALL: 'Lekë' }

const labelMono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', display: 'block', marginBottom: 7,
}
const sunkenField: React.CSSProperties = {
  maxWidth: 360, width: '100%', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-3)',
  background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '11px 13px', cursor: 'not-allowed',
}

function Lock({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} style={{ display: 'block', color: 'var(--ink-4)' }} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="1" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function SectionHead({ n, title, tag }: { n: string; title: string; tag?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, borderTop: '1px solid var(--line)', paddingTop: 18 }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-3)' }}>{n}</span>
      <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>{title}</h2>
      {tag && <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-4)' }}>{tag}</span>}
    </div>
  )
}

export default async function SettingsPage() {
  const venue = await getVenueRow('saly')
  if (!venue) {
    return <div style={{ padding: 32, fontFamily: 'var(--font-sans)', color: 'var(--ink-2)' }}>Could not load venue settings.</div>
  }
  const guestUrl = `app.ospitalitta.com/venue/${venue.slug}/menu`

  return (
    <>
      <header style={{ display: 'flex', alignItems: 'center', height: 58, padding: '0 28px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>settings</span>
      </header>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 32px 64px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 0.9, textTransform: 'uppercase', color: 'var(--ink)' }}>Settings</h1>
        <p style={{ maxWidth: 560, marginTop: 12, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)' }}>
          Venue-level settings for {venue.name}. Most are read-only for now and will open up later
        </p>

        <div style={{ maxWidth: 680 }}>

          {/* 01 venue */}
          <div style={{ marginTop: 34 }}>
            <SectionHead n="01" title="Venue" />
            <div style={{ marginTop: 18 }}>
              <label style={labelMono}>Name</label>
              <input type="text" defaultValue={venue.name} readOnly style={{ ...sunkenField, fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--ink)', background: 'var(--surface-raised)', cursor: 'default' }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ ...labelMono, display: 'flex', alignItems: 'center', gap: 7 }}>Slug <Lock /> locked</label>
              <input type="text" value={venue.slug} disabled style={sunkenField} />
              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 8 }}>
                The slug is fixed. If it ever changes, the old link keeps a 301 redirect so printed QR codes never break
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={labelMono}>Public guest link</label>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-2)' }}>
                {guestUrl}
              </div>
            </div>
          </div>

          {/* 02 languages */}
          <div style={{ marginTop: 38 }}>
            <SectionHead n="02" title="Languages" tag={<><Lock />editing later</>} />
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)', marginTop: 14 }}>
              Content languages for the guest menu. {venue.defaultLocale.toUpperCase()} is the base. Guests fall back to the base where a translation is empty
            </p>
            <div style={{ border: '1px solid var(--line-subtle)', borderRadius: 'var(--r-asym-sm)', overflow: 'hidden', marginTop: 16, background: 'var(--surface-panel)' }}>
              {venue.locales.map(code => (
                <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', borderBottom: '1px solid var(--line-subtle)', opacity: 0.9 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--ink-2)', width: 28, flexShrink: 0 }}>{code.toUpperCase()}</span>
                  <span style={{ fontSize: 14, color: 'var(--ink)', flex: 1 }}>{LOCALE_NAMES[code] ?? code}</span>
                  {code === venue.defaultLocale && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B06A1E', border: '1px solid #E8C79A', padding: '3px 8px', borderRadius: '5px 0 0 5px' }}>base</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 03 currency */}
          <div style={{ marginTop: 38 }}>
            <SectionHead n="03" title="Currency" tag={<><Lock />locked</>} />
            <div style={{ marginTop: 16, display: 'flex', gap: 26, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <div>
                <label style={labelMono}>Venue currency</label>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, width: 200, justifyContent: 'space-between', background: 'var(--surface-sunken)', border: '1px solid var(--line)', padding: '11px 13px', cursor: 'not-allowed' }}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--ink-2)' }}>
                    {CURRENCY_NAME[venue.currency] ?? venue.currency} <span style={{ color: 'var(--ink-4)' }}>· {venue.currency}</span>
                  </span>
                  <Lock />
                </div>
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-3)', maxWidth: 300, paddingBottom: 11 }}>
                One currency per venue. It is applied to every price in the menu, so prices stay clean integers
              </div>
            </div>
          </div>

          {/* 04 account */}
          <div style={{ marginTop: 38 }}>
            <SectionHead n="04" title="Account" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18, background: 'var(--surface-panel)', border: '1px solid var(--line-subtle)', borderRadius: 'var(--r-asym-sm)', padding: '16px 18px' }}>
              <span style={{ width: 40, height: 40, background: 'var(--surface-sunken)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 14, color: '#B06A1E', flexShrink: 0 }}>M</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Manager</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-3)' }}>you@company.com</div>
              </div>
              <form action={logout}>
                <button type="submit" style={{ fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500, color: '#9A2E10', background: 'transparent', border: '1px solid #E6B9A6', padding: '9px 15px', borderRadius: '7px 0 0 7px', cursor: 'pointer' }}>
                  Sign out
                </button>
              </form>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-3)', marginTop: 10 }}>
              Single hardcoded user for now. Real accounts and per-venue access come later
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
