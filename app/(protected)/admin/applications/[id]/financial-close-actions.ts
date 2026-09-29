'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'

async function staff(roles:string[]=[]){
 const s=await createClient()
 const {data:c}=await s.auth.getClaims()
 const uid=c?.claims?.sub as string|undefined
 if(!uid)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle()
 if(!isStaffRole(p?.role)||(roles.length&&!roles.includes(p.role)))redirect('/admin')
 return {s,uid}
}

export async function refreshFinancialClose(f:FormData){
 const {s}=await staff()
 const application_id=String(f.get('application_id'))
 const {error}=await s.rpc('initialize_financial_close_checklist',{p_application_id:application_id})
 if(error)throw new Error(error.message)
 const {error:refreshError}=await s.rpc('refresh_financial_close_checklist',{p_application_id:application_id})
 if(refreshError)throw new Error(refreshError.message)
 revalidatePath('/admin/applications/'+application_id)
}

export async function updateFinancialCloseItem(f:FormData){
 const {s,uid}=await staff(['admin','finance','cfo','executive','legal','contract_manager','project_manager','due_diligence','compliance'])
 const id=String(f.get('id'))
 const application_id=String(f.get('application_id'))
 const status=String(f.get('status'))
 const evidence_note=String(f.get('evidence_note')||'')
 if(!['pending','in_progress','complete','waived'].includes(status))throw new Error('Estado no válido.')
 const {error}=await s.from('financial_close_checklists').update({
   status,evidence_note,
   completed_by:status==='complete'||status==='waived'?uid:null,
   completed_at:status==='complete'||status==='waived'?new Date().toISOString():null,
   updated_at:new Date().toISOString()
 }).eq('id',id).eq('application_id',application_id)
 if(error)throw new Error(error.message)
 revalidatePath('/admin/applications/'+application_id)
}
