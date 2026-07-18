'use client'

import { useEffect, useRef, useState } from 'react'
import { TASTE_SPRITE, TASTE_ICONS } from '@/lib/taste-sprite'

/** Static-sprite size relative to the Lottie's drawn artwork. See the render site. */
const STATIC_SCALE = 0.85

type Props = {
  taste: string
  active: boolean
  size?: number
}

/** Inline the <symbol> defs once per page so <use> stays a same-document reference. */
export function TasteSprite() {
  return (
    <svg
      style={{ display: 'none' }}
      aria-hidden
      dangerouslySetInnerHTML={{ __html: TASTE_SPRITE }}
    />
  )
}

/**
 * Taste-tab icon: static SVG from the sprite, swapped for the Lottie while the
 * tab is active.
 *
 * The sprite paints on first render with no JS, so the tab row never sits empty
 * and a reduced-motion visitor simply keeps the static drawing. lottie-web is
 * imported only when a tab actually becomes active, so the player stays out of
 * the initial bundle — it is far bigger than every icon put together.
 *
 * The light player is enough because scripts/bake-lottie.mjs resolves the AE
 * expressions ahead of time; without that bake the strokes would fall back to
 * black.
 */
export default function TasteIcon({ taste, active, size = 17 }: Props) {
  const host = useRef<HTMLSpanElement>(null)
  const [animating, setAnimating] = useState(false)
  const hasIcon = TASTE_ICONS.has(taste)

  useEffect(() => {
    if (!active || !hasIcon) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let anim: { destroy: () => void } | null = null

    void (async () => {
      const mod = await import('lottie-web/build/player/lottie_light')
      const lottie = (mod as { default: typeof import('lottie-web').default }).default
      if (cancelled || !host.current) return

      anim = lottie.loadAnimation({
        container: host.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: `/assets/taste/${taste}.json`,
      })
      setAnimating(true)
    })()

    return () => {
      cancelled = true
      anim?.destroy()
      setAnimating(false)
    }
  }, [active, taste, hasIcon])

  if (!hasIcon) return null

  return (
    <span
      style={{
        width: size, height: size, flexShrink: 0,
        display: 'inline-block', position: 'relative', verticalAlign: 'middle',
      }}
      aria-hidden
    >
      <span ref={host} style={{ position: 'absolute', inset: 0 }} />
      {!animating && (
        <svg
          width={size} height={size}
          // The Lottie composition draws its artwork with padding inside the 500×500
          // canvas; the source SVG fills its viewBox edge to edge. Rendered at the same
          // box the static icon therefore looks larger, and swapping to the Lottie on
          // tab activation reads as a jump. Scaling the static down closes the gap.
          // Eyeballed — nudge this one number if the swap still shifts.
          style={{ display: 'block', transform: `scale(${STATIC_SCALE})`, transformOrigin: 'center' }}
        >
          <use href={`#taste-${taste}`} />
        </svg>
      )}
    </span>
  )
}
