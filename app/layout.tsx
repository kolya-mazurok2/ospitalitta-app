import type { Metadata } from 'next'
import Script from 'next/script'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Ospitalitta',
  description: 'Digital Waiter',
}

const GA_ID = 'G-ZR4VH3NC1Z'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
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
      {/* Mouseflow — session replay + heatmaps, all pages */}
      <Script id="mouseflow" strategy="afterInteractive">{`
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
