/**
 * Cart — sessionStorage with 2h TTL, venue-namespaced (DEC-001, DEC-013, DEC-015).
 * All operations are pure functions; the client island manages React state.
 */

const TTL_MS = 2 * 60 * 60 * 1000  // 2 hours

export interface CartItem {
  slug: string
  name: string
  price: number   // parsed integer (Lekë)
  qty: number
}

interface StoredCart {
  items: CartItem[]
  ts: number
}

function key(slug: string) {
  return `osp_cart_${slug}`
}

export function loadCart(venueSlug: string): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = sessionStorage.getItem(key(venueSlug))
    if (!raw) return []
    const stored: StoredCart = JSON.parse(raw)
    if (Date.now() - stored.ts > TTL_MS) {
      sessionStorage.removeItem(key(venueSlug))
      return []
    }
    return stored.items
  } catch {
    return []
  }
}

export function saveCart(venueSlug: string, items: CartItem[]): void {
  if (typeof window === 'undefined') return
  try {
    const stored: StoredCart = { items, ts: Date.now() }
    sessionStorage.setItem(key(venueSlug), JSON.stringify(stored))
  } catch {
    // sessionStorage unavailable — continue without persistence
  }
}

export function addItem(items: CartItem[], item: Omit<CartItem, 'qty'>): CartItem[] {
  const existing = items.findIndex(x => x.slug === item.slug)
  if (existing >= 0) {
    return items.map((x, i) => i === existing ? { ...x, qty: x.qty + 1 } : x)
  }
  return [...items, { ...item, qty: 1 }]
}

export function changeQty(items: CartItem[], slug: string, delta: number): CartItem[] {
  return items
    .map(x => x.slug === slug ? { ...x, qty: x.qty + delta } : x)
    .filter(x => x.qty > 0)
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((a, x) => a + x.qty, 0)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((a, x) => a + x.price * x.qty, 0)
}

export function clearCart(venueSlug: string): void {
  if (typeof window === 'undefined') return
  try { sessionStorage.removeItem(key(venueSlug)) } catch { /* continue */ }
}

export function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0
}
