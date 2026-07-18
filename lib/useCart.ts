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
import { track } from './analytics'

const TOAST_MS = 1800

export function useCart(venueSlug: string) {
  const [cart, setCart] = useState<CartItem[]>([])
  // id is a timestamp — remounts the node so the fade replays on rapid repeat taps
  const [toast, setToast] = useState<{ id: number; name: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const saved = loadCart(venueSlug)
    if (saved.length) setCart(saved)
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

  const clear = useCallback(() => {
    clearCart(venueSlug)
    setCart([])
  }, [venueSlug])

  return {
    cart,
    count: cartCount(cart),
    total: cartTotal(cart),
    toast,
    add,
    changeQty,
    clear,
  }
}
