'use client'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Browser anon client — used only for direct Storage uploads (via signed upload URL).
let client: SupabaseClient | null = null

export function supabaseBrowser(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
      { auth: { persistSession: false } },
    )
  }
  return client
}
