// Safe wrappers for localStorage/sessionStorage — handle SecurityError in cross-origin iframes.

export function lsGet(key: string): string | null {
  try { return localStorage.getItem(key) } catch { return null }
}

export function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value) } catch { /* blocked in iframe/private mode */ }
}

export function ssGet(key: string): string | null {
  try { return sessionStorage.getItem(key) } catch { return null }
}

export function ssSet(key: string, value: string): void {
  try { sessionStorage.setItem(key, value) } catch { /* blocked */ }
}

export function ssRemove(key: string): void {
  try { sessionStorage.removeItem(key) } catch { /* blocked */ }
}
