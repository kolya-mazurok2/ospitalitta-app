'use client'

import { useActionState, useState } from 'react'
import Brandmark from '@/components/admin/Brandmark'
import { loginAction, type LoginState } from './actions'

// Shared door — one login for the platform, branded Ospitalitta (not venue-specific).
// MVP: single hardcoded user (saly / saly2026). Valid submit sets a cookie and routes
// to the dashboard; the shell layout gate redirects unauthenticated users back here.
export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {})
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const invalid = !!state.error

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap' }}>

      {/* LEFT · platform brand (the shared door) */}
      <div style={{
        flex: '1 1 460px', minHeight: '100vh', background: '#15110E', padding: '48px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Brandmark size={40} />
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 0.9,
            letterSpacing: '0.01em', textTransform: 'uppercase', color: '#F2E9DA',
          }}>
            Ospitalitta
          </div>
        </div>

        {/* reserved image slot — fill later */}
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{
            width: '100%', height: 260, border: '1px solid #2A231C',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#5A4E3F',
            }}>
              Image slot
            </span>
          </div>
        </div>

        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#8C8067',
        }}>
          Digital Waiter · one door, every venue
        </span>
      </div>

      {/* RIGHT · sign-in form */}
      <div style={{
        flex: '1 1 540px', minHeight: '100vh', background: 'var(--surface-panel)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px',
      }}>
        <form action={formAction} style={{ width: '100%', maxWidth: 400 }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'var(--ink-3)',
          }}>
            Digital Waiter
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 52, lineHeight: 0.95,
            letterSpacing: '0.01em', textTransform: 'uppercase', color: 'var(--ink)', marginTop: 14,
          }}>
            Sign in
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)', marginTop: 14 }}>
            Your venue loads from your account
          </p>

          {/* email / user */}
          <div style={{ marginTop: 30 }}>
            <label htmlFor="email" style={labelStyle}>Email</label>
            <input
              id="email" name="email" type="text" placeholder="you@company.com"
              autoComplete="username" className="admin-field" aria-invalid={invalid}
            />
          </div>

          {/* password */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
              <label htmlFor="password" style={labelStyle}>Password</label>
              <button type="button" onClick={() => setShow(s => !s)} style={{
                fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                color: '#B06A1E', background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              }}>
                {show ? 'hide' : 'show'}
              </button>
            </div>
            <input
              id="password" name="password" type={show ? 'text' : 'password'} placeholder="••••••••"
              autoComplete="current-password" className="admin-field" aria-invalid={invalid}
            />
          </div>

          {/* error helper */}
          {state.error && (
            <p style={{ fontSize: 13, color: 'var(--danger)', marginTop: 10 }}>{state.error}</p>
          )}

          {/* remember + forgot */}
          <input type="hidden" name="remember" value={remember ? 'on' : ''} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 18 }}>
            <button type="button" onClick={() => setRemember(r => !r)} style={{
              display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer',
              background: 'none', border: 'none', padding: 0,
            }}>
              <span style={{
                width: 18, height: 18, flexShrink: 0,
                background: remember ? 'var(--ink)' : 'var(--surface-raised)',
                border: `1px solid ${remember ? 'var(--ink)' : 'var(--line-strong)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {remember && <span style={{ color: '#FAF4E8', fontSize: 12, lineHeight: 1 }}>✓</span>}
              </span>
              <span style={{ fontSize: 14, color: 'var(--ink-2)' }}>Remember me</span>
            </button>
            <a href="#" style={{ fontSize: 14, fontWeight: 500, color: '#B06A1E', textDecoration: 'none' }}>
              Forgot password
            </a>
          </div>

          <button type="submit" className="admin-btn-primary" disabled={pending} style={{
            width: '100%', marginTop: 26, fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 600,
            color: '#FAF4E8', background: 'var(--ink)', border: 'none', padding: '14px 22px',
            borderRadius: 'var(--r-asym-sm)', cursor: pending ? 'default' : 'pointer',
            opacity: pending ? 0.7 : 1,
          }}>
            {pending ? 'Signing in' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--ink-3)', display: 'block', marginBottom: 8,
}
