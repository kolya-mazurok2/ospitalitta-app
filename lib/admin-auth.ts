// Admin auth — hardcoded single user (MVP, low-priority per handoff).
// Server-only: imported by the login Server Action and the shell layout, never by client.
export const ADMIN_COOKIE = 'osp-admin-auth'
export const ADMIN_TOKEN = 'saly-admin-ok' // cookie value when authenticated

const ADMIN_USER = 'saly'
const ADMIN_PASS = 'saly2026'

export function checkCredentials(user: string, pass: string): boolean {
  return user.trim().toLowerCase() === ADMIN_USER && pass === ADMIN_PASS
}
