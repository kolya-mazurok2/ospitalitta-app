import { redirect } from 'next/navigation'

// Any unmatched route (and any notFound() — e.g. unknown venue slug) → marketing site.
export default function NotFound() {
  redirect('https://ospitalitta.com')
}
