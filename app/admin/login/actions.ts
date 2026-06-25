'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, ADMIN_TOKEN, checkCredentials } from '@/lib/admin-auth'

export interface LoginState {
  error?: string
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const user = String(formData.get('email') ?? '')
  const pass = String(formData.get('password') ?? '')
  const remember = formData.get('remember') === 'on'

  if (!checkCredentials(user, pass)) {
    return { error: 'Wrong email or password' }
  }

  const store = await cookies()
  store.set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: remember ? 60 * 60 * 24 * 30 : undefined, // 30d if remembered, else session
  })

  redirect('/admin')
}
