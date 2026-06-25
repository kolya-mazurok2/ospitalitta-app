import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE, ADMIN_TOKEN } from '@/lib/admin-auth'
import Sidebar from '@/components/admin/Sidebar'

// App shell — persistent sidebar + main content. Auth-gated: unauthenticated users
// are sent to /admin/login (which lives outside this group, so it stays reachable).
export default async function ShellLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies()
  if (store.get(ADMIN_COOKIE)?.value !== ADMIN_TOKEN) {
    redirect('/admin/login')
  }

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
    </div>
  )
}
