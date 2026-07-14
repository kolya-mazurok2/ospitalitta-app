'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

declare global {
  interface Window {
    _mfq?: unknown[]
  }
}

// A client-side route change never reloads the document, so Mouseflow keeps recording the whole
// visit as one page. The loader only registers the first view — every route after it has to be
// announced by hand.
function Tracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams.toString()
    window._mfq = window._mfq || []
    window._mfq.push(['newPageView', qs ? `${pathname}?${qs}` : pathname])
  }, [pathname, searchParams])

  return null
}

// useSearchParams drops the whole tree to client rendering unless it sits behind a Suspense
// boundary, so the boundary lives here and callers can drop the component in anywhere.
export function MouseflowPageViews() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  )
}
