'use client'

import { useEffect, useRef } from 'react'

/**
 * Card video: nothing is fetched until the card is actually near the screen.
 *
 * These clips run several MB each, and with plain autoPlay every card in the open
 * tab pulled its file whether or not the guest ever scrolled to it. The margin is
 * generous on purpose — the clip should already be moving by the time the card
 * edges into view, so the motion is what catches the eye, not a still that starts
 * late.
 */
export default function CardVideo({ src, poster, style }: { src: string; poster?: string; style: React.CSSProperties }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void el.play().catch(() => {})
        else el.pause()
      },
      { rootMargin: '300px 0px', threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [src])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      loop
      playsInline
      muted
      preload="none"
      style={style}
    />
  )
}
