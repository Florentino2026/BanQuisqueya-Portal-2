'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'

async function staff(allowed:string[]=['admin','compliance','internal_audit','risk_manager']){
 const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const{data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role)||!allowed.includes(p.role))redirect('/admin');return{s,role:p.role}
}
export async function refreshComplianceAlerts(){
 const{s}=await staff()
 const{data:projects,error}=await s.from('projects').select('id').in('status',['active','funded','open'])
 if(error)throw new Error(error.message)
 for(const p of projects||[]){const{error:e}=await s.rpc('refresh_compliance_control_alerts',{p_project_id:p.id});if(e)throw new Error(e.message)}
 revalidatePath('/admin/compliance')
}
export async function updateComplianceAlert(f:FormData){
 const{s}=await staff();const id=String(f.get('id')||'');const status=String(f.get('status')||'')
 if(!id)throw new Error('Alerta requerida')
 if(!['acknowledged','resolved'].includes(status))throw new Error('Estado no permitido')
 const{error}=await s.from('compliance_control_alerts').update({status}).eq('id',id)
 if(error)throw new Error(error.message)
 revalidatePath('/admin/compliance')
}