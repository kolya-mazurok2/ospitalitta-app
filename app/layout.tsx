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
      {/* GA4 — global, all venues. venue_slug goes on each event as a param. */}
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{`
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
          mf.src = "//cdn.mouseflow.com/projects/ce70d7f3-98a6-4a82-884e-0d9c8739b0ee.js";
          document.getElementsByTagName("head")[0].appendChild(mf);
        })();
      `}</Script>
    </html>
  )
}
