'use client'

import { useEffect, useRef, useState } from 'react'
import CardVideo from '@/components/CardVideo'

export interface SliderImage { src: string; alt: string; videoSrc?: string }

/**
 * Seamless infinite variant/size slider. The strip is [clone(last), ...images, clone(first)],
 * so stepping past the last slide keeps moving FORWARD into the leading clone and then snaps
 * back to the real first without a transition. Controlled: the parent owns the logical `index`
 * (drives size/flavour selection + price); the slider animates toward it.
 *
 * A slide with `videoSrc` plays a clip (muted, looping) instead of showing the poster.
 * Navigation is swipe + the dots below — no arrows.
 */
export default function VariantSlider({
  images,
  index,
  onIndexChange,
  priority,
  onInteract,
}: {
  images: SliderImage[]
  index: number
  onIndexChange: (i: number) => void
  priority?: boolean
  onInteract?: () => void
}) {
  const len = images.length
  const slides = [images[len - 1], ...images, images[0]] // +1 leading clone, +1 trailing clone
  const [pos, setPos] = useState(index + 1)
  const [trans, setTrans] = useState(true)
  const [dragPx, setDragPx] = useState(0)
  const dragRef = useRef({ startX: 0, dragging: false, w: 0 })

  const logical = (p: number) => (((p - 1) % len) + len) % len

  // Animate toward an externally-set index (size buttons, auto-advance). Forward on a +1 wrap,
  // backward on a -1 wrap, direct jump otherwise. No-op when it already matches (self-initiated).
  useEffect(() => {
    setPos((prev) => {
      if (logical(prev) === index) return prev
      if (index === (logical(prev) + 1) % len) return prev + 1
      if (index === (logical(prev) - 1 + len) % len) return prev - 1
      return index + 1
    })
    setTrans(true)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

  // Snap the transient clone back to its real twin once the slide settles — no transition,
  // so the jump is invisible and the next move continues forward.
  const onEnd = () => {
    if (pos === len + 1) { setTrans(false); setPos(1) }
    else if (pos === 0) { setTrans(false); setPos(len) }
  }

  const go = (nextPos: number) => { setTrans(true); setPos(nextPos); onIndexChange(logical(nextPos)) }
  const cur = () => (pos <= 0 ? len : pos >= len + 1 ? 1 : pos) // normalise off a clone

  return (
    <div
      onPointerDown={(e) => {
        const el = e.currentTarget
        dragRef.current = { startX: e.clientX, dragging: true, w: el.clientWidth }
        onInteract?.()
        el.setPointerCapture(e.pointerId)
        setTrans(false)
      }}
      onPointerMove={(e) => { if (dragRef.current.dragging) setDragPx(e.clientX - dragRef.current.startX) }}
      onPointerUp={(e) => {
        const d = dragRef.current
        if (!d.dragging) return
        d.dragging = false
        const dx = e.clientX - d.startX
        setDragPx(0)
        if (dx < -d.w * 0.18) go(cur() + 1)
        else if (dx > d.w * 0.18) go(cur() - 1)
        else setTrans(true)
      }}
      onPointerCancel={() => { dragRef.current.dragging = false; setDragPx(0); setTrans(true) }}
      onClick={(e) => { if (Math.abs(e.clientX - dragRef.current.startX) > 6) e.stopPropagation() }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', touchAction: 'pan-y', cursor: 'grab' }}
    >
      <div
        onTransitionEnd={onEnd}
        style={{
          display: 'flex', width: '100%', height: '100%',
          transform: `translateX(calc(${-pos * 100}% + ${dragPx}px))`,
          transition: trans && !dragRef.current.dragging ? 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
      >
        {slides.map((im, i) => (
          <div key={i} style={{ flex: '0 0 100%', width: '100%', height: '100%', position: 'relative' }}>
            {im.videoSrc ? (
              <CardVideo
                src={im.videoSrc} poster={im.src}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
            ) : (
              <img
                src={im.src} alt={im.alt}
                draggable={false}
                loading={i <= 1 && priority ? 'eager' : 'lazy'} decoding="async"
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6, zIndex: 2 }}>
        {images.map((_, i) => (
          <span key={i} style={{
            width: 9, height: 9, borderRadius: '50%',
            background: i === logical(pos) ? '#fff' : 'rgb(255 255 255 / 0.5)',
            boxShadow: '0 1px 3px rgb(0 0 0 / 0.45)',
          }} />
        ))}
      </div>
    </div>
  )
}
