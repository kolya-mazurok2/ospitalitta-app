'use client'

import { useEffect, useRef } from 'react'

const SITE = 'https://ospitalitta.com'

/**
 * The Ospitalitta house mark, ported from the marketing nav: gold half rises, ember half
 * snaps in from the left, wordmark wipes left to right.
 *
 * One change from marketing: there the nav is on screen at load, so the motion runs on
 * mount. Here the mark sits at the foot of a long menu, and a mount-triggered animation
 * would finish long before anyone scrolled to it. An IntersectionObserver starts it the
 * first time it actually comes into view, once.
 *
 * Reduced motion skips straight to the resting state — the mark still reads, it just
 * doesn't move.
 */
export default function OspitalittaMark() {
  const hostRef = useRef<HTMLAnchorElement | null>(null)
  const goldRef = useRef<SVGGElement | null>(null)
  const emberRef = useRef<SVGGElement | null>(null)
  const wordRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const host = hostRef.current
    const gold = goldRef.current
    const ember = emberRef.current
    const word = wordRef.current
    if (!host || !gold || !ember || !word) return

    const settle = () => {
      gold.style.opacity = '1'
      gold.style.transform = 'scale(1)'
      ember.style.opacity = '1'
      ember.style.transform = 'translateX(0)'
      word.style.clipPath = 'inset(0 0 0 0)'
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      settle()
      return
    }

    let raf = 0
    const run = () => {
      const DUR = 1050
      const start = performance.now()
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

      const step = (now: number) => {
        const e = Math.min(1, (now - start) / DUR)

        const g = easeOut(Math.min(1, e / 0.45))
        gold.style.opacity = g.toFixed(3)
        gold.style.transform = `scale(${(0.82 + 0.18 * g).toFixed(4)})`

        const em = (e - 0.4) / 0.3
        if (em <= 0) {
          ember.style.opacity = '0'
          ember.style.transform = 'translateX(-30px)'
        } else if (em >= 1) {
          ember.style.opacity = '1'
          ember.style.transform = 'translateX(0)'
        } else {
          const o = 1 - Math.pow(1 - em, 2)
          ember.style.opacity = '1'
          ember.style.transform = `translateX(${(-30 * (1 - o)).toFixed(2)}px)`
        }

        const w = Math.max(0, Math.min(1, (e - 0.55) / 0.45))
        word.style.clipPath = `inset(0 ${((1 - w) * 100).toFixed(1)}% 0 0)`

        if (e < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      run()
    }, { threshold: 0.6 })
    io.observe(host)

    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])

  return (
    <a
      ref={hostRef}
      href={SITE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ospitalitta"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        textDecoration: 'none', lineHeight: 0,
      }}
    >
      <svg viewBox="0 0 200 200" style={{ width: 24, height: 24, overflow: 'visible' }} aria-hidden>
        <defs>
          <clipPath id="ospMarkL"><rect x="0" y="0" width="96" height="200" /></clipPath>
          <clipPath id="ospMarkR"><rect x="104" y="0" width="96" height="200" /></clipPath>
        </defs>
        <g ref={goldRef} style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0 }}>
          <circle cx="100" cy="100" r="50" fill="#E0992E" clipPath="url(#ospMarkL)" />
        </g>
        <g ref={emberRef} style={{ transformBox: 'fill-box', transformOrigin: 'center', opacity: 0 }}>
          <polygon
            points="166,100 146.2,80.9 146.7,53.3 119.1,53.8 100,34 80.9,53.8 53.3,53.3 53.8,80.9 34,100 53.8,119.1 53.3,146.7 80.9,146.2 100,166 119.1,146.2 146.7,146.7 146.2,119.1"
            fill="#D6431C"
            clipPath="url(#ospMarkR)"
          />
        </g>
      </svg>
      <span
        ref={wordRef}
        style={{
          fontFamily: 'var(--font-osp-mark), sans-serif',
          fontSize: 17,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: 'var(--ink-heading)',
          lineHeight: 1,
          display: 'inline-block',
          clipPath: 'inset(0 100% 0 0)',
        }}
      >
        Ospitalitta
      </span>
    </a>
  )
}
