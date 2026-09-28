'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function assignProjectStaff(formData:FormData){
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const actorId=claimsData?.claims?.sub as string|undefined
 if(!actorId)redirect('/login')
 const {data:actor}=await supabase.from('profiles').select('role').eq('id',actorId).maybeSingle()
 if(!['admin'].includes(actor?.role||''))redirect('/investor')
 const projectId=String(formData.get('project_id')||'')
 const userId=String(formData.get('user_id')||'')
 const role=String(formData.get('role')||'')
 const allowed=['project_manager','developer','supervisor','accounting','finance','cfo','treasury','due_diligence','legal','procurement','vendor_manager','hse_manager']
 if(!projectId||!userId||!allowed.includes(role))redirect('/admin/organization/assignments?error=Datos+inválidos')
 const {data:user}=await supabase.from('profiles').select('id,role').eq('id',userId).maybeSingle()
 if(!user)redirect('/admin/organization/assignments?error=Usuario+no+encontrado')
 if(user.role!==role && user.role!=='admin')redirect('/admin/organization/assignments?error=El+rol+del+usuario+no+coincide+con+la+función+asignada')
 const {error}=await supabase.from('project_staff_assignments').upsert({project_id:projectId,user_id:userId,role,active:true,assigned_by:actorId,notes:String(formData.get('notes')||'')},{onConflict:'project_id,user_id,role'})
 if(error)redirect('/admin/organization/assignments?error='+encodeURIComponent(error.message))
 await supabase.from('audit_log').insert({actor_id:actorId,action:'project_staff_assigned',entity_type:'project_staff_assignment',department_code:'PMO',new_data:{project_id:projectId,user_id:userId,role}})
 revalidatePath('/admin/organization')
 revalidatePath('/admin/organization/assignments')
 redirect('/admin/organization/assignments?success=1')
}
