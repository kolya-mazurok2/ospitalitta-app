import type { Metadata } from 'next'
import Script from 'next/script'
import { MouseflowPageViews } from '@/components/MouseflowPageViews'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Ospitalitta',
  description: 'Digital Waiter',
  // Same marks as the marketing site — a guest arriving from ospitalitta.com should not
  // see the tab icon change under them.
  icons: {
    icon: [
      { url: '/brand/favicon.svg', type: 'image/svg+xml' },
      { url: '/brand/favicon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: '/brand/favicon-512.png',
  },
}

const GA_ID = 'G-ZR4VH3NC1Z'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <MouseflowPageViews />
      </body>
      {/* GA4 — global, all venues. venue_slug goes on each event as a param.
          The shim MUST run before hydration: menu_view fires from a mount effect, and with
          an afterInteractive shim window.gtag does not exist yet — the event was dropped.
          Queued dataLayer calls are drained when the remote script lands. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="beforeInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
      {/* Mouseflow — session replay + heatmaps, all pages.
          id MUST NOT be "mouseflow": an element id becomes a global (window.mouseflow points at the
          script tag), and the Mouseflow bundle starts with `if (typeof mouseflow === 'undefined')`.
          With the name taken, the whole recorder silently no-ops — script loads, nothing records.

          mouseflowCrossDomainSupport MUST be set before the loader: guests arrive here from
          www.ospitalitta.com, a different host, and without it Mouseflow cuts the recording and
          starts a fresh session on arrival instead of continuing the one that began on marketing. */}
      <Script id="mf-loader" strategy="afterInteractive">{`
        window.mouseflowCrossDomainSupport = true;
        window._mfq = window._mfq || [];
        (function() {
          var mf = document.createElement("script");
          mf.type = "text/javascript"; mf.defer = true;
          mf.src = "//cdn.mouseflow.com/projects/fbd30d85-a2ca-43a2-92ff-295f0e9c1829.js";
          document.getElementsByTagName("head")[0].appendChild(mf);
        })();
      `}</Script>
    </html>
  )
}
