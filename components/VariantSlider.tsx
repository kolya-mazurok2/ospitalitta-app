'use client'

import { useRef, useState } from 'react'
import { Chevron, sliderArrow } from '@/components/SliderArrow'

export interface SliderImage { src: string; alt: string }

/**
 * Swipeable variant/size image strip. Controlled: the parent owns the index (so it can
 * stay in sync with size/flavour selection and price). Same slider on the grid card and
 * the detail view.
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
  const dragRef = useRef({ startX: 0, dragging: false, w: 0 })
  const [dragPx, setDragPx] = useState(0)
  const len = images.length

  return (
    <div
      onPointerDown={(e) => {
        const el = e.currentTarget
        dragRef.current = { startX: e.clientX, dragging: true, w: el.clientWidth }
        onInteract?.()
        el.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => { if (dragRef.current.dragging) setDragPx(e.clientX - dragRef.current.startX) }}
      onPointerUp={(e) => {
        const d = dragRef.current
        if (!d.dragging) return
        d.dragging = false
        const dx = e.clientX - d.startX
        const ni = dx < -d.w * 0.18 ? Math.min(index + 1, len - 1)
          : dx > d.w * 0.18 ? Math.max(index - 1, 0) : index
        onIndexChange(ni)
        setDragPx(0)
      }}
      onPointerCancel={() => { dragRef.current.dragging = false; setDragPx(0) }}
      onClick={(e) => { if (Math.abs(e.clientX - dragRef.current.startX) > 6) e.stopPropagation() }}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', touchAction: 'pan-y', cursor: 'grab' }}
    >
      <div style={{
        display: 'flex', width: '100%', height: '100%',
        transform: `translateX(calc(${-index * 100}% + ${dragPx}px))`,
        transition: dragRef.current.dragging ? 'none' : 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        {images.map((im, i) => (
          <img
            key={i}
            src={im.src} alt={im.alt}
            draggable={false}
            loading={i === 0 && priority ? 'eager' : 'lazy'} decoding="async"
            style={{ flex: '0 0 100%', width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
          />
        ))}
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onInteract?.(); onIndexChange(Math.max(0, index - 1)) }}
        aria-label="Previous" style={sliderArrow('left')}
      ><Chevron dir="left" /></button>
      <button
        onClick={(e) => { e.stopPropagation(); onInteract?.(); onIndexChange(Math.min(len - 1, index + 1)) }}
        aria-label="Next" style={sliderArrow('right')}
      ><Chevron dir="right" /></button>
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 4, zIndex: 2 }}>
        {images.map((_, i) => (
          <span key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: i === index ? '#fff' : 'rgb(255 255 255 / 0.5)' }} />
        ))}
      </div>
    </div>
  )
}
