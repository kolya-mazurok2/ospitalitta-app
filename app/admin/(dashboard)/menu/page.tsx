import { getMenuForEdit } from '@/lib/admin-repo'
import MenuEditor from '@/components/admin/menu/MenuEditor.client'

// Saly menu editor (single venue for now; venue switcher is a later slice).
export default async function MenuPage() {
  const tree = await getMenuForEdit('saly')
  if (!tree) {
    return (
      <div style={{ padding: 32, fontFamily: 'var(--font-sans)', color: 'var(--ink-2)' }}>
        Could not load the menu. Check the Supabase connection.
      </div>
    )
  }
  return <MenuEditor tree={tree} />
}
