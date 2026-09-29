'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'

async function staff(allowed:string[]=['admin','finance','cfo','executive','relationship_manager']){
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const{data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role)||!allowed.includes(p.role))redirect('/admin');return{s,uid}
}
export async function refreshMatches(f:FormData){
 const{s}=await staff()
 const project_id=String(f.get('project_id')||'')
 if(!project_id)throw new Error('Proyecto requerido')
 const{error}=await s.rpc('refresh_capital_project_matches',{p_project_id:project_id})
 if(error)throw new Error(error.message)
 revalidatePath('/admin/capital-matching');revalidatePath('/admin/projects/'+project_id)
}
export async function updateMatch(f:FormData){
 const{s,uid}=await staff()
 const id=String(f.get('id')||'');if(!id)throw new Error('Match requerido')
 const status=String(f.get('status')||'identified')
 if(!['identified','reviewed','shortlisted','contacted','mandate_discussion','rejected','closed'].includes(status))throw new Error('Estado de matching no permitido')
 const{error}=await s.from('capital_project_matches').update({status,rationale:String(f.get('rationale')||''),notes:String(f.get('notes')||''),reviewed_by:uid,reviewed_at:new Date().toISOString()}).eq('id',id)
 if(error)throw new Error(error.message)
 revalidatePath('/admin/capital-matching')
 const project_id=String(f.get('project_id')||'');if(project_id)revalidatePath('/admin/projects/'+project_id)
}