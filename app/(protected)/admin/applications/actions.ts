'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'
export async function updateApplication(f:FormData){const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const {data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role))redirect('/investor');const id=String(f.get('id')||'');const status=String(f.get('status')||'submitted');const assigned=String(f.get('assigned_to')||'').trim()||null;const {error}=await s.from('funding_applications').update({status,assigned_to:assigned}).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/admin/applications');revalidatePath('/admin/applications/'+id)}
