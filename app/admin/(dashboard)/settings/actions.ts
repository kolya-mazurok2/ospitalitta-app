'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export async function logout() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}
