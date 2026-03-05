import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'

export default async function AdminLayout({ children }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) redirect('/')

  return <AdminShell>{children}</AdminShell>
}