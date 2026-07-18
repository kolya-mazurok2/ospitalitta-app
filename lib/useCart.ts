'use client'

/**
 * Cart state + the "added" toast, shared by the menu list and the product page.
 *
 * Both screens can add to the cart, and both show the same confirmation, so the state
 * lives here rather than in either component. sessionStorage is the source of truth —
 * navigating between the two remounts the hook and it reloads from there.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type CartItem, loadCart, saveCart, addItem, changeQty as changeQtyIn,
  cartCount, cartTotal, clearCart,
} from './cart'
import { ssGet, ssSet, ssRemove } from './storage'
import { track } from './analytics'

const TOAST_MS = 1800

const placedKey = (slug: string) => `osp_placed_${slug}`

export function useCart(venueSlug: string) {
  const [cart, setCart] = useState<CartItem[]>([])
  // Survives closing the sheet and moving between the menu and a product page — a placed
  // order must not quietly become editable again just because the guest tapped away.
  const [placed, setPlaced] = useState(false)
  // id is a timestamp — remounts the node so the fade replays on rapid repeat taps
  const [toast, setToast] = useState<{ id: number; name: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const saved = loadCart(venueSlug)
    if (saved.length) setCart(saved)
    setPlaced(ssGet(placedKey(venueSlug)) === '1')
  }, [venueSlug])

  useEffect(() => { saveCart(venueSlug, cart) }, [cart, venueSlug])

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const add = useCallback((slug: string, name: string, rawPrice: number) => {
    setCart(prev => addItem(prev, { slug, name, price: rawPrice }))

    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), name })
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS)

    // GA4 ecommerce shape → feeds native Item reports (sliceable by Country).
    track('add_to_cart', {
      venue_slug: venueSlug,
      currency: 'ALL',
      value: rawPrice,
      items: [{ item_id: slug, item_name: name, price: rawPrice, quantity: 1 }],
    })
  }, [venueSlug])

  const changeQty = useCallback((slug: string, delta: number) => {
    setCart(prev => changeQtyIn(prev, slug, delta))
  }, [])

  const place = useCallback(() => {
    ssSet(placedKey(venueSlug), '1')
    setPlaced(true)
  }, [venueSlug])

  // "Change order" — the guest wants the steppers back. The cart itself is untouched.
  const unplace = useCallback(() => {
    ssRemove(placedKey(venueSlug))
    setPlaced(false)
  }, [venueSlug])

  const clear = useCallback(() => {
    clearCart(venueSlug)
    ssRemove(placedKey(venueSlug))
    setCart([])
    setPlaced(false)
  }, [venueSlug])

  return {
    cart,
    count: cartCount(cart),
    total: cartTotal(cart),
    toast,
    placed,
    add,
    changeQty,
    place,
    unplace,
    clear,
  }
}
