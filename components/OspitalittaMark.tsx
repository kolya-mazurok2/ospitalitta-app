const SITE = 'https://ospitalitta.com'

/**
 * The Ospitalitta house mark at the foot of the menu — a quiet credit, not a banner.
 *
 * Static by design: no entrance animation, and no dedicated wordmark face. It rides the
 * venue's own text font so it recedes into whatever brand it sits under instead of
 * announcing a second typeface at the bottom of every menu.
 */
export default function OspitalittaMark() {
  return (
    <a
      href={SITE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ospitalitta"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 7,
        textDecoration: 'none', lineHeight: 0, opacity: 0.75,
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: 15, height: 15, overflow: 'visible' }} aria-hidden>
        <defs>
          <clipPath id="ospMarkL"><rect x="0" y="0" width="96" height="200" /></clipPath>
          <clipPath id="ospMarkR"><rect x="104" y="0" width="96" height="200" /></clipPath>
        </defs>
        <circle cx="100" cy="100" r="50" fill="#E0992E" clipPath="url(#ospMarkL)" />
        <polygon
          points="166,100 146.2,80.9 146.7,53.3 119.1,53.8 100,34 80.9,53.8 53.3,53.3 53.8,80.9 34,100 53.8,119.1 53.3,146.7 80.9,146.2 100,166 119.1,146.2 146.7,146.7 146.2,119.1"
          fill="#D6431C"
          clipPath="url(#ospMarkR)"
        />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-text)',
          fontWeight: 400,
          fontSize: '0.625rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--ink-faint)',
          lineHeight: 1,
          display: 'inline-block',
        }}
      >
        Ospitalitta
      </span>
    </a>
  )
}
