'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'
async function staff(){const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const{data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role))redirect('/admin');return{s,uid}}
export async function saveCanvas(f:FormData){const{s,uid}=await staff();const project_id=String(f.get('project_id'));const fields=['opportunity','problem_statement','proposed_solution','target_market','competitive_advantage','sponsor_assets','land_rights','permits_status','technical_summary','environmental_summary','proposed_structure','revenue_model','exit_strategy','key_risks','strategic_rationale'];const payload:any={project_id,updated_at:new Date().toISOString()};for(const k of fields)payload[k]=String(f.get(k)||'');for(const k of ['capex','opex','projected_revenue','projected_ebitda','funding_need','sponsor_contribution','banquisqueya_potential_contribution','third_party_capital'])payload[k]=f.get(k)?Number(f.get(k)):null;payload.currency=String(f.get('currency')||'USD');const{error}=await s.from('project_canvases').upsert({...payload,created_by:uid},{onConflict:'project_id'});if(error)throw new Error(error.message);revalidatePath('/admin/projects/'+project_id+'/canvas')}
export async function initializeAgile(f:FormData){const{s}=await staff();const project_id=String(f.get('project_id'));const application_id=f.get('application_id')||null;const{error}=await s.rpc('initialize_project_agile_framework',{p_project_id:project_id,p_application_id:application_id});if(error)throw new Error(error.message);revalidatePath('/admin/projects/'+project_id+'/canvas');revalidatePath('/admin/projects/'+project_id+'/agile')}


export async function evaluateGate1(f:FormData){
 const {s}=await staff()
 const project_id=String(f.get('project_id'))
 const {data:items,error}=await s.from('project_readiness_items').select('id,status').eq('project_id',project_id)
 if(error)throw new Error(error.message)
 const total=items?.length||0
 const completed=(items||[]).filter((x:any)=>x.status==='verified'||x.status==='complete').length
 const nextStatus=total>0&&completed===total?'in_review':'pending'
 const {error:ge}=await s.from('project_stage_gates').update({completed_items:completed,status:nextStatus}).eq('project_id',project_id).eq('gate_number',1)
 if(ge)throw new Error(ge.message)
 revalidatePath('/admin/projects/'+project_id+'/canvas')
 revalidatePath('/admin/projects/'+project_id+'/agile')
}
