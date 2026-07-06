// Thin GA4 wrapper. No-op when gtag is absent (SSR, blocked, or GA not loaded).
// Single call-site for events so components never touch window.gtag directly.
type Params = Record<string, unknown>

export function track(event: string, params: Params = {}) {
  if (typeof window === 'undefined') return
  const g = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag
  if (typeof g !== 'function') return
  g('event', event, params)
}
