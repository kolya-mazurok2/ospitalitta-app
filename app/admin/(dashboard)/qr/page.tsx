'use client'

import { useState } from 'react'
import Icon from '@/components/admin/Icon'

const GUEST_URL = 'app.ospitalitta.com/venue/saly/menu'
const QR_SRC = '/admin/assets/saly-qr.png'

export default function QrPage() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${GUEST_URL}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <>
      <header style={{ display: 'flex', alignItems: 'center', height: 58, padding: '0 28px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
          qr code
        </span>
      </header>

      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '28px 32px 56px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, lineHeight: 0.9, textTransform: 'uppercase', color: 'var(--ink)' }}>QR code</h1>
        <p style={{ maxWidth: 560, marginTop: 12, fontSize: 15, lineHeight: 1.6, color: 'var(--ink-2)' }}>
          One QR per venue. It opens the guest menu at the public link below. Print it for the tables
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, marginTop: 26, alignItems: 'start', maxWidth: 760 }}>
          {/* QR card */}
          <div style={{ ...cardRaised, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 22 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_SRC} alt="Saly venue QR" width={212} height={212} style={{ display: 'block', imageRendering: 'pixelated' }} />
          </div>

          {/* meta + actions */}
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 8 }}>
              Public guest link
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'stretch', background: 'var(--surface-raised)', border: '1px solid var(--line)' }}>
              <span style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink)' }}>
                {GUEST_URL}
              </span>
              <button onClick={copy} title="Copy link" style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '0 13px', background: 'var(--surface-sunken)',
                border: 'none', borderLeft: '1px solid var(--line)', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: copied ? 'var(--s-success-ink)' : 'var(--ink-3)',
              }}>
                <Icon name="copy" size={14} />
                {copied ? 'copied' : 'copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              <a href={QR_SRC} download="saly-qr.png" style={{
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600, color: '#FAF4E8', background: 'var(--ink)',
                border: 'none', padding: '11px 18px', borderRadius: 'var(--r-asym-sm)', textDecoration: 'none',
              }}>
                Download PNG
              </a>
              <button onClick={() => window.print()} style={{
                fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 500, color: 'var(--ink)', background: 'transparent',
                border: '1px solid var(--line-strong)', padding: '11px 18px', borderRadius: 'var(--r-asym-sm)', cursor: 'pointer',
              }}>
                Print
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 22, background: 'var(--surface-panel)', border: '1px solid var(--line-subtle)', borderRadius: 'var(--r-asym-sm)', padding: '16px 18px' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B06A1E', flexShrink: 0, paddingTop: 1 }}>note</span>
              <span style={{ fontSize: 14, lineHeight: 1.55, color: 'var(--ink-2)' }}>
                The QR stays the same if you rename the venue. The old link keeps a 301 redirect, so printed codes never break
              </span>
            </div>
          </div>
        </div>

        {/* paper menu, later */}
        <div style={{ marginTop: 32, maxWidth: 760, borderTop: '1px solid var(--line)', paddingTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 18, color: 'var(--ink)' }}>Paper menu</h2>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B06A1E', border: '1px solid #E8C79A', padding: '4px 9px', borderRadius: '6px 0 0 6px' }}>
              Coming later
            </span>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-2)', marginTop: 16, maxWidth: 560 }}>
            Later this section will also generate a <b style={{ color: 'var(--ink)' }}>full printable paper menu</b> from the same content:
            categories, items, prices and the QR on one print-ready layout. For now it is the QR only
          </p>
        </div>
      </div>
    </>
  )
}

const cardRaised: React.CSSProperties = {
  background: 'var(--surface-raised)', border: '1px solid var(--line-subtle)', borderRadius: 'var(--r-asym-sm)',
}
