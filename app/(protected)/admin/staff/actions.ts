'use server'

import { createClient } from '@/lib/supabase/server'
import { STAFF_ROLES } from '@/lib/auth/roles'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateStaffRole(formData: FormData) {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined
  if (!userId) redirect('/login')

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (admin?.role !== 'admin') redirect('/investor')

  const targetId = String(formData.get('user_id') || '')
  const role = String(formData.get('role') || '')

  const allowed = role === 'member' || STAFF_ROLES.includes(role as typeof STAFF_ROLES[number])
  if (!targetId || !allowed) redirect('/admin/staff?error=Rol+invalido')

  if (targetId === userId && role !== 'admin') {
    redirect('/admin/staff?error=No+puede+quitarse+su+propio+rol+de+administrador')
  }

  const { error } = await supabase.from('profiles').update({
    role,
    updated_at: new Date().toISOString(),
  }).eq('id', targetId)

  if (error) redirect(`/admin/staff?error=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin')
  revalidatePath('/admin/staff')
  redirect('/admin/staff?success=1')
}
