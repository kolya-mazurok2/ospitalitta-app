// Supabase free-tier keepalive — pings once every 5 days via Vercel cron.
// Without this, projects on the free tier pause after 7 days of inactivity.
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(request: Request) {
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return NextResponse.json({ skipped: 'no supabase url' })

  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '' },
    })
    return NextResponse.json({ ok: true, status: res.status })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
