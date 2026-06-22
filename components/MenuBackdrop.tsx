export type BackgroundTheme = 'seafood' | 'cocktail' | 'none'

interface Layer {
  src: string
  style: React.CSSProperties
}

const THEMES: Record<BackgroundTheme, Layer[]> = {
  seafood: [
    { src: '/decor/seafood/scallop-fan.png', style: { width: '42%', top: '-3%', right: '-13%', opacity: 0.16, filter: 'saturate(0.7)', transform: 'rotate(9deg)' } },
    { src: '/decor/seafood/swordfish.png',   style: { width: '52%', top: 'calc(33% + 60px)', right: 'calc(-9% + 170px)', opacity: 0.10, filter: 'saturate(0.85)', transform: 'rotate(-4deg)' } },
    { src: '/decor/seafood/octopus-2.png',   style: { width: '118%', left: '-24%', bottom: '-2%', opacity: 0.16, filter: 'saturate(0.95) contrast(1.03)' } },
  ],
  cocktail: [
    { src: '/decor/cocktail/shaker.png',      style: { width: '50%', top: 'calc(-5% + 100px)', left: '-15%',  opacity: 0.15, filter: 'saturate(0.9)', transform: 'rotate(-13deg)' } },
    { src: '/decor/cocktail/orange-round.png', style: { width: '25%', top: 'calc(9% + 25px)',   right: '-7%',  opacity: 0.12, filter: 'saturate(0.7)' } },
    { src: '/decor/cocktail/olives.png',       style: { width: '66%', bottom: '1%', right: '-16%', opacity: 0.13, filter: 'saturate(0.85)' } },
    { src: '/decor/cocktail/barspoon.png',     style: { width: '46%', bottom: '-9%', left: '-13%', opacity: 0.10, filter: 'saturate(0.7)', transform: 'rotate(38deg)' } },
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
