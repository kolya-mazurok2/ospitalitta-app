'use client'

import { useEffect, useRef } from 'react'

// An item counts as "seen" only when half of it sits in the scroll window and stays
// there for a full second. A fast scroll-past is not a look — counting it would blur
// the dead zone we are trying to measure.
const VISIBLE_RATIO = 0.5
const DWELL_MS = 1000

// Fires at most once per item per page session, even across tab switches.
// Cards already carry id="item-{slug}" for scroll targeting — reused here as the hook.
export function useImpressions(
  rootRef: React.RefObject<HTMLElement | null>,
  onSeen: (slug: string, position: number) => void,
  enabled: boolean,
  deps: unknown[],
) {
  const seen = useRef(new Set<string>())
  const cb = useRef(onSeen)
  cb.current = onSeen

  useEffect(() => {
    const root = rootRef.current
    // An open sheet (legend, detail, waiter list) covers the list with a scrim. The observer
    // cannot see occlusion — without this, first-visit onboarding would mark every card
    // behind it as "seen". Re-enabling restarts the dwell for whatever is on screen.
    if (!enabled || !root || typeof IntersectionObserver === 'undefined') return

    const els = Array.from(root.querySelectorAll<HTMLElement>('[id^="item-"]'))
      .filter(el => !seen.current.has(el.id.slice(5)))
    if (!els.length) return

    const position = new Map(els.map((el, i) => [el, i]))
    const timers = new Map<Element, ReturnType<typeof setTimeout>>()
    const cancel = (el: Element) => {
      const t = timers.get(el)
      if (t !== undefined) { clearTimeout(t); timers.delete(el) }
    }

    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        // A card taller than the scroll window can never reach 50% of ITSELF, so it would
        // stay invisible forever. Second clause: it fills half the window → count it.
        const rootH = e.rootBounds?.height ?? 0
        const visible = e.isIntersecting && (
          e.intersectionRatio >= VISIBLE_RATIO ||
          (rootH > 0 && e.intersectionRect.height >= rootH * VISIBLE_RATIO)
        )
        if (!visible) { cancel(e.target); continue }
        if (timers.has(e.target)) continue

        timers.set(e.target, setTimeout(() => {
          timers.delete(e.target)
          // Backgrounded tab keeps timers running — a phone in a pocket is not a reader.
          if (document.visibilityState !== 'visible') return
          const slug = e.target.id.slice(5)
          if (seen.current.has(slug)) return
          seen.current.add(slug)
          io.unobserve(e.target)
          cb.current(slug, position.get(e.target as HTMLElement) ?? -1)
        }, DWELL_MS))
      }
    }, { root, threshold: Array.from({ length: 11 }, (_, i) => i / 10) })

    for (const el of els) io.observe(el)
    return () => { for (const t of timers.values()) clearTimeout(t); io.disconnect() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps])
}
