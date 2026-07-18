import TasteMark from '@/components/TasteMark'

interface Props {
  title: string
  sub: string
  welcome?: string
  hasCocktails: boolean
  showRows?: boolean
  bitterName: string
  bitterDesc: string
  sourName: string
  sourDesc: string
  sweetName: string
  sweetDesc: string
  marksName: string
  marksDesc: string
  oliveName: string
  oliveDesc: string
  lovedName: string
  lovedDesc: string
  pricesNote: string
  cta: string
  onClose: () => void
}

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '16px 0',
  borderTop: '1px solid var(--line-soft)',
}
const iconWrap: React.CSSProperties = {
  width: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  color: 'var(--brand)',
}
const rowName: React.CSSProperties = {
  fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.9375rem', color: 'var(--ink-body-2)',
}
const rowDesc: React.CSSProperties = {
  marginLeft: 'auto',
  fontFamily: 'var(--font-text)', fontSize: '0.9375rem', color: 'var(--ink-faint)',
}

export default function LegendSheet({
  title, sub, welcome, hasCocktails, showRows = true,
  bitterName, bitterDesc, sourName, sourDesc, sweetName, sweetDesc,
  marksName, marksDesc, oliveName, oliveDesc, lovedName, lovedDesc,
  pricesNote, cta, onClose,
}: Props) {
  return (
    <>
      {/* scrim */}
      <div
        onClick={onClose}
        className="animate-bb-dim"
        style={{ position: 'absolute', inset: 0, background: 'rgb(21 17 14 / 0.55)', zIndex: 9 }}
      />

      {/* sheet */}
      <div
        className="animate-bb-up scrollbar-none"
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          background: 'var(--sheet-bg)',
          borderRadius: 'var(--sheet-radius)',
          padding: '14px 24px 28px',
          zIndex: 10,
          boxShadow: '0 -20px 50px rgb(0 0 0 / 0.3)',
          maxHeight: '94%',
          overflowY: 'auto',
        }}
      >
        {/* close button — replaces the non-functional drag handle */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 10, right: 14,
            width: 32, height: 32, zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: 'var(--ink-faint)', padding: 0,
          }}
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'block' }}>
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>

        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.3125rem',
          letterSpacing: '0.02em', color: 'var(--ink-heading)',
          marginTop: 20, lineHeight: 1.2, textAlign: 'center',
        }}>
          {title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.875rem',
          lineHeight: 1.5, color: 'var(--ink-body)',
          marginTop: 6, textAlign: 'center', whiteSpace: 'pre-line',
        }}>
          {sub}
        </p>

        {welcome && (
          <p style={{
            fontFamily: 'var(--font-text)', fontWeight: 300, fontSize: '0.875rem',
            lineHeight: 1.55, color: 'var(--ink-body)',
            marginTop: 14, padding: '12px 14px',
            background: 'var(--surface-frame)',
            border: '1px solid var(--hairline)',
            textWrap: 'pretty',
          }}>
            {welcome}
          </p>
        )}

        {showRows && <div style={{ display: 'flex', flexDirection: 'column', marginTop: 14 }}>
          {hasCocktails && (<>
          {/* bitter */}
          <div style={rowStyle}>
            <span style={iconWrap}>
              <TasteMark taste="bitter" n={1} single />
            </span>
            <span style={rowName}>{bitterName}</span>
            <span style={rowDesc}>{bitterDesc}</span>
          </div>

          {/* sour */}
          <div style={rowStyle}>
            <span style={iconWrap}>
              <TasteMark taste="sour" n={1} single />
            </span>
            <span style={rowName}>{sourName}</span>
            <span style={rowDesc}>{sourDesc}</span>
          </div>

          {/* sweet */}
          <div style={rowStyle}>
            <span style={iconWrap}>
              <TasteMark taste="sweet" n={1} single />
            </span>
            <span style={rowName}>{sweetName}</span>
            <span style={rowDesc}>{sweetDesc}</span>
          </div>

          {/* marks (intensity) — 3 icons at increasing sizes */}
          <div style={rowStyle}>
            <span style={{ ...iconWrap, gap: 3 }}>
              <svg viewBox="0 0 160 160" style={{ width: 11, height: 11, display: 'block', opacity: 0.9 }} aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m88.422 60.233c-6.287-12.673-12.453-25.406-18.622-38.14-6.58-4.906-15.486-4.126-20.64 1.014a16.176 16.176 0 0 0 -1.8 20.02c12.707 6.726 25.52 13.52 38.34 20.313" />
                  <path d="m92.8 61.007c1.013-9.987 2.147-19.967 3.273-29.94-3.493-4.287-7.06-8.187-11.72-10.314s-10.94-2.28-14.56 1.34" />
                  <path d="m152.455 88.567c-.453-8.287-3.393-16.26-7.146-23.66a110.781 110.781 0 0 0 -56.709-52.074c-7.346-2.966-15.12-5.153-23.04-5.2a37.591 37.591 0 0 0 -19.706 5.554c-.007.006-.014.006-.02.013-.334.213-.654.427-.967.647-7.678 5.386-11.767 14.9-12.167 24.266s2.489 18.607 6.522 27.067a102.76 102.76 0 0 0 70.107 55.553c12.66 2.134 27.153.467 35.766-9.06a26.614 26.614 0 0 0 3.98-5.84 1.028 1.028 0 0 0 .06-.126 34.469 34.469 0 0 0 3.32-17.14z" />
                  <path d="m45.851 13.187c-20.479 11.174-35.242 34.569-37.909 57.745a74.421 74.421 0 0 0 23.964 62.94 74.423 74.423 0 0 0 65.251 16.68c22.724-5.275 44.274-26.707 51.978-44.848" />
                  <path d="m95.982 63.633c7.48-3.646 20.14-9.386 25.207-11.893a27.68 27.68 0 0 0 -9.127-15.093 25.9 25.9 0 0 0 -15.987-5.58" />
                  <path d="m97.115 67.147q21.12 8.34 42.24 16.673a27.948 27.948 0 0 0 -3.34-19.66 28.562 28.562 0 0 0 -14.826-12.42" />
                  <path d="m95.575 70.487q12.051 17.61 24.107 35.226a24.847 24.847 0 0 0 11.02 1.207 14.772 14.772 0 0 0 9.127-4.887 13.481 13.481 0 0 0 3.013-9.146 15.579 15.579 0 0 0 -3.487-9.067" />
                </g>
              </svg>
              <svg viewBox="0 0 160 160" style={{ width: 14, height: 14, display: 'block' }} aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m88.422 60.233c-6.287-12.673-12.453-25.406-18.622-38.14-6.58-4.906-15.486-4.126-20.64 1.014a16.176 16.176 0 0 0 -1.8 20.02c12.707 6.726 25.52 13.52 38.34 20.313" />
                  <path d="m92.8 61.007c1.013-9.987 2.147-19.967 3.273-29.94-3.493-4.287-7.06-8.187-11.72-10.314s-10.94-2.28-14.56 1.34" />
                  <path d="m152.455 88.567c-.453-8.287-3.393-16.26-7.146-23.66a110.781 110.781 0 0 0 -56.709-52.074c-7.346-2.966-15.12-5.153-23.04-5.2a37.591 37.591 0 0 0 -19.706 5.554c-.007.006-.014.006-.02.013-.334.213-.654.427-.967.647-7.678 5.386-11.767 14.9-12.167 24.266s2.489 18.607 6.522 27.067a102.76 102.76 0 0 0 70.107 55.553c12.66 2.134 27.153.467 35.766-9.06a26.614 26.614 0 0 0 3.98-5.84 1.028 1.028 0 0 0 .06-.126 34.469 34.469 0 0 0 3.32-17.14z" />
                  <path d="m45.851 13.187c-20.479 11.174-35.242 34.569-37.909 57.745a74.421 74.421 0 0 0 23.964 62.94 74.423 74.423 0 0 0 65.251 16.68c22.724-5.275 44.274-26.707 51.978-44.848" />
                  <path d="m95.982 63.633c7.48-3.646 20.14-9.386 25.207-11.893a27.68 27.68 0 0 0 -9.127-15.093 25.9 25.9 0 0 0 -15.987-5.58" />
                  <path d="m97.115 67.147q21.12 8.34 42.24 16.673a27.948 27.948 0 0 0 -3.34-19.66 28.562 28.562 0 0 0 -14.826-12.42" />
                  <path d="m95.575 70.487q12.051 17.61 24.107 35.226a24.847 24.847 0 0 0 11.02 1.207 14.772 14.772 0 0 0 9.127-4.887 13.481 13.481 0 0 0 3.013-9.146 15.579 15.579 0 0 0 -3.487-9.067" />
                </g>
              </svg>
              <svg viewBox="0 0 160 160" style={{ width: 17, height: 17, display: 'block' }} aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m88.422 60.233c-6.287-12.673-12.453-25.406-18.622-38.14-6.58-4.906-15.486-4.126-20.64 1.014a16.176 16.176 0 0 0 -1.8 20.02c12.707 6.726 25.52 13.52 38.34 20.313" />
                  <path d="m92.8 61.007c1.013-9.987 2.147-19.967 3.273-29.94-3.493-4.287-7.06-8.187-11.72-10.314s-10.94-2.28-14.56 1.34" />
                  <path d="m152.455 88.567c-.453-8.287-3.393-16.26-7.146-23.66a110.781 110.781 0 0 0 -56.709-52.074c-7.346-2.966-15.12-5.153-23.04-5.2a37.591 37.591 0 0 0 -19.706 5.554c-.007.006-.014.006-.02.013-.334.213-.654.427-.967.647-7.678 5.386-11.767 14.9-12.167 24.266s2.489 18.607 6.522 27.067a102.76 102.76 0 0 0 70.107 55.553c12.66 2.134 27.153.467 35.766-9.06a26.614 26.614 0 0 0 3.98-5.84 1.028 1.028 0 0 0 .06-.126 34.469 34.469 0 0 0 3.32-17.14z" />
                  <path d="m45.851 13.187c-20.479 11.174-35.242 34.569-37.909 57.745a74.421 74.421 0 0 0 23.964 62.94 74.423 74.423 0 0 0 65.251 16.68c22.724-5.275 44.274-26.707 51.978-44.848" />
                  <path d="m95.982 63.633c7.48-3.646 20.14-9.386 25.207-11.893a27.68 27.68 0 0 0 -9.127-15.093 25.9 25.9 0 0 0 -15.987-5.58" />
                  <path d="m97.115 67.147q21.12 8.34 42.24 16.673a27.948 27.948 0 0 0 -3.34-19.66 28.562 28.562 0 0 0 -14.826-12.42" />
                  <path d="m95.575 70.487q12.051 17.61 24.107 35.226a24.847 24.847 0 0 0 11.02 1.207 14.772 14.772 0 0 0 9.127-4.887 13.481 13.481 0 0 0 3.013-9.146 15.579 15.579 0 0 0 -3.487-9.067" />
                </g>
              </svg>
            </span>
            <span style={rowName}>{marksName}</span>
            <span style={{ ...rowDesc, textAlign: 'right' }}>{marksDesc}</span>
          </div>

          {/* loved here */}
          <div style={rowStyle}>
            <span style={iconWrap}>
              <svg viewBox="154 164 314 303" style={{ width: 18, height: 18, display: 'block', fill: 'var(--brand)' }} aria-hidden>
                <path d="m467.804 292.907c-7.47-48.489-60.582-101.763-132.159-62.814-29.177-90.905-119.689-69.448-145.953-43.65-85.322 76.173 8.362 203.179 40.333 268.032 14.045-39.091-117.417-181.241-27.244-255.414 68.632-56.454 126.977 25.183 124.741 56.454 44.947-40.995 121.184-16.165 122.736 37.392 3.752 129.472-200.887 143.96-206.188 175.093 115.457-25.643 238.406-79.846 223.734-175.093z" />
                <path d="m287.945 231.035c-46.589-62.449-117.225 12.49-74.644 84.931-12.023-79.435 25.55-110.91 74.644-84.931z" />
              </svg>
            </span>
            <span style={rowName}>{lovedName}</span>
            <span style={rowDesc}>{lovedDesc}</span>
          </div>
          </>)}

          {/* olive / house specialty */}
          <div style={rowStyle}>
            <span style={iconWrap}>
              <svg width="13" height="15" viewBox="0 0 24 24" style={{ display: 'block' }} aria-hidden>
                <ellipse cx="12" cy="12" rx="6.6" ry="8.8" transform="rotate(-18 12 12)" fill="#7E8C50" />
                <ellipse cx="9.7" cy="7.6" rx="1.5" ry="2.3" transform="rotate(-18 12 12)" fill="#B6C07A" />
                <ellipse cx="13.4" cy="14.2" rx="1.4" ry="1.9" transform="rotate(-18 12 12)" fill="#C7503B" />
              </svg>
            </span>
            <span style={rowName}>{oliveName}</span>
            <span style={rowDesc}>{oliveDesc}</span>
          </div>
        </div>}

        {/* prices note */}
        <div style={{
          marginTop: 16, paddingTop: 13,
          borderTop: '1px solid var(--line-soft)',
          fontFamily: 'var(--font-text)', fontWeight: 400, fontSize: '0.6875rem',
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--ink-faint)',
        }}>
          {pricesNote}
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          style={{
            width: '100%', marginTop: 18,
            fontFamily: 'var(--font-text)', fontWeight: 500, fontSize: '0.8125rem',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--surface)', background: 'var(--ink-heading)',
            border: 'none', padding: '14px 0', cursor: 'pointer',
          }}
        >
          {cta}
        </button>
      </div>
    </>
  )
}
