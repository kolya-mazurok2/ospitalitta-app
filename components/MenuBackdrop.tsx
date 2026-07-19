export type BackgroundTheme = 'seafood' | 'cocktail' | 'patisserie' | 'none'

interface Layer {
  src: string
  style: React.CSSProperties
}

const THEMES: Record<BackgroundTheme, Layer[]> = {
  seafood: [
    { src: '/decor/seafood/scallop-fan.webp', style: { width: '42%', top: '-3%', right: '-13%', opacity: 0.16, filter: 'saturate(0.7)', transform: 'rotate(9deg)' } },
    { src: '/decor/seafood/swordfish.webp',   style: { width: '52%', top: 'calc(33% + 60px)', right: 'calc(-9% + 170px)', opacity: 0.10, filter: 'saturate(0.85)', transform: 'rotate(-4deg)' } },
    { src: '/decor/seafood/octopus-2.webp',   style: { width: '118%', left: '-24%', bottom: '-2%', opacity: 0.16, filter: 'saturate(0.95) contrast(1.03)' } },
  ],
  cocktail: [
    { src: '/decor/cocktail/shaker.webp',      style: { width: '50%', top: 'calc(-5% + 100px)', left: '-15%',  opacity: 0.15, filter: 'saturate(0.9)', transform: 'rotate(-13deg)' } },
    { src: '/decor/cocktail/orange-round.webp', style: { width: '25%', top: 'calc(9% + 25px)',   right: '-7%',  opacity: 0.12, filter: 'saturate(0.7)' } },
    { src: '/decor/cocktail/olives.webp',       style: { width: '66%', bottom: '1%', right: '-16%', opacity: 0.13, filter: 'saturate(0.85)' } },
    { src: '/decor/cocktail/barspoon.webp',     style: { width: '46%', bottom: '-9%', left: '-13%', opacity: 0.10, filter: 'saturate(0.7)', transform: 'rotate(38deg)' } },
  ],
  // Vintage pastry engravings, anchored to corners (middle stays clean under the list).
  // Exact per-layer rotate/opacity/saturate from the design handoff.
  patisserie: [
    { src: '/decor/patisserie/espresso-cup.webp', style: { width: '50%',  top: '7%',     right: '-6%',  opacity: 0.20, filter: 'saturate(0.9)' } },
    { src: '/decor/patisserie/macaron.webp',      style: { width: '19%',  top: '20%',    right: '30%',  opacity: 0.18, filter: 'saturate(0.75)', transform: 'rotate(-26deg)' } },
    { src: '/decor/patisserie/macaron.webp',      style: { width: '19%',  top: '24.5%',  right: '16%',  opacity: 0.16, filter: 'saturate(0.7)',  transform: 'rotate(23deg)' } },
    { src: '/decor/patisserie/coffee-bean.webp',  style: { width: '5.4%', top: '9%',     left: '8%',    opacity: 0.30, transform: 'rotate(-22deg)' } },
    { src: '/decor/patisserie/coffee-bean.webp',  style: { width: '5.4%', top: '11.5%',  left: '14%',   opacity: 0.24, transform: 'rotate(34deg)' } },
    { src: '/decor/patisserie/strawberry.webp',   style: { width: '56%',  top: '43%',    left: '-24%',  opacity: 0.20, filter: 'saturate(0.85)', transform: 'rotate(270deg)' } },
    { src: '/decor/patisserie/croissant.webp',    style: { width: '82%',  bottom: '8%',  left: '-15%',  opacity: 0.26, filter: 'saturate(1) contrast(1.02)' } },
    { src: '/decor/patisserie/coffee-bean.webp',  style: { width: '5.6%', bottom: '13%', right: '11%',  opacity: 0.40, transform: 'rotate(-18deg)' } },
    { src: '/decor/patisserie/coffee-bean.webp',  style: { width: '5.2%', bottom: '10%', right: '6%',   opacity: 0.34, transform: 'rotate(22deg)' } },
    { src: '/decor/patisserie/coffee-bean.webp',  style: { width: '5.0%', bottom: '9%',  right: '15%',  opacity: 0.28, transform: 'rotate(-44deg)' } },
  ],
  none: [],
}

const INTENSITY = { soft: 1, medium: 1.45, strong: 2 } as const

interface Props {
  theme: BackgroundTheme
  intensity?: keyof typeof INTENSITY
}

export default function MenuBackdrop({ theme, intensity = 'soft' }: Props) {
  const layers = THEMES[theme]
  if (!layers.length) return null
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute', inset: 0,
        pointerEvents: 'none', overflow: 'hidden',
        opacity: INTENSITY[intensity],
        zIndex: 0,
      }}
    >
      {layers.map((l, i) => (
        <img
          key={i} src={l.src} alt=""
          style={{
            position: 'absolute',
            mixBlendMode: 'multiply',
            ...l.style,
          }}
        />
      ))}
    </div>
  )
}
