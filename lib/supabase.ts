/**
 * Supabase wiring (DEC-005).
 * - Public READ path uses raw tagged `fetch` to PostgREST (see menu-repo.ts), NOT this client,
 *   so it stays edge-friendly and integrates with Next's Data Cache (DEC-004).
 * - The service-role client here is Node-only (seed + admin writes); it bypasses RLS.
 */
import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

/** Public read env present → dual-mode read may use Supabase. */
export const hasSupabaseEnv = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

/** Service-role client. Node only (seed, admin Server Actions). Bypasses RLS — never ship to the browser. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!SUPABASE_URL || !key) {
    throw new Error('Supabase service env missing (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)')
  }
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false } })
}
