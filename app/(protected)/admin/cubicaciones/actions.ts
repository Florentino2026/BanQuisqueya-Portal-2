'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function getContext(){
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId) redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 return {supabase,userId,role:profile?.role as string|undefined}
}

export async function createCubicacion(formData:FormData){
 const {supabase,userId,role}=await getContext()
 if(!['admin','project_manager','developer'].includes(role||'')) redirect('/investor')
 const projectId=String(formData.get('project_id')||'')
 const applicationId=String(formData.get('application_id')||'')||null
 const {data:project}=await supabase.from('projects').select('id').eq('id',projectId).maybeSingle()
 if(!project) redirect('/admin/cubicaciones?error=Proyecto+no+encontrado')
 const {data:assignment}=await supabase.from('project_staff_assignments').select('id').eq('project_id',projectId).eq('user_id',userId).eq('active',true).in('role',['project_manager','developer']).maybeSingle()
 if(role!=='admin' && !assignment) redirect('/admin/cubicaciones?error=No+tiene+acceso+a+este+proyecto')
 const {data,error}=await supabase.from('project_cubicaciones').insert({
  project_id:projectId,application_id:applicationId,
  period_start:String(formData.get('period_start')),period_end:String(formData.get('period_end')),
  previous_progress_pct:Number(formData.get('previous_progress_pct')||0),
  current_progress_pct:Number(formData.get('current_progress_pct')||0),
  gross_amount:Number(formData.get('gross_amount')||0),
  retention_amount:Number(formData.get('retention_amount')||0),
  advance_applied:Number(formData.get('advance_applied')||0),
  currency:String(formData.get('currency')||'USD'),
  work_description:String(formData.get('work_description')||''),
  contract_id:String(formData.get('contract_id')||'')||null,
  purchase_order_id:String(formData.get('purchase_order_id')||'')||null,
  budget_line_id:String(formData.get('budget_line_id')||'')||null,
  submitted_by:userId,status:'submitted'
 }).select('id').single()
 if(error||!data) redirect('/admin/cubicaciones?error='+encodeURIComponent(error?.message||'No se pudo crear la cubicación'))
 revalidatePath('/admin/cubicaciones')
 redirect('/admin/cubicaciones/'+data.id)
}

export async function reviewCubicacion(formData:FormData){
 const {supabase,userId,role}=await getContext()
 if(!['admin','supervisor'].includes(role||'')) redirect('/investor')
 const id=String(formData.get('id')||'')
 const decision=String(formData.get('decision')||'')
 if(!['approved','rejected','under_review'].includes(decision)) redirect('/admin/cubicaciones/'+id+'?error=Decisión+inválida')
 const {data:c}=await supabase.from('project_cubicaciones').select('id,project_id,status').eq('id',id).maybeSingle()
 if(!c) redirect('/admin/cubicaciones?error=Cubicación+no+encontrada')
 if(role!=='admin'){
  const {data:a}=await supabase.from('project_staff_assignments').select('id').eq('project_id',c.project_id).eq('user_id',userId).eq('active',true).eq('role','supervisor').maybeSingle()
  if(!a) redirect('/admin/cubicaciones?error=Supervisor+no+asignado')
 }
 const nextStatus=decision==='approved'?'ready_for_payment':decision
 const {error}=await supabase.from('project_cubicaciones').update({
  status:nextStatus,reviewed_by:userId,reviewed_at:new Date().toISOString(),
  review_notes:String(formData.get('review_notes')||''),updated_at:new Date().toISOString()
 }).eq('id',id)
 if(error) redirect('/admin/cubicaciones/'+id+'?error='+encodeURIComponent(error.message))
 await supabase.from('audit_log').insert({actor_id:userId,action:'cubicacion_'+decision,entity_type:'project_cubicacion',entity_id:id,department_code:'SUPERVISION',new_data:{status:nextStatus}})
 revalidatePath('/admin/cubicaciones')
 revalidatePath('/admin/cubicaciones/'+id)
 redirect('/admin/cubicaciones/'+id+'?success=1')
}

export async function prepareDisbursement(formData:FormData){
 const {supabase,userId,role}=await getContext()
 if(!['admin','accounting','finance','cfo'].includes(role||'')) redirect('/investor')
 const cubicacionId=String(formData.get('cubicacion_id')||'')
 const {data:c}=await supabase.from('project_cubicaciones').select('id,project_id,net_amount,currency,status').eq('id',cubicacionId).maybeSingle()
 if(!c||!['ready_for_payment','approved'].includes(c.status)) redirect('/admin/cubicaciones/'+cubicacionId+'?error=Cubicación+no+está+lista+para+desembolso')
 const {data:existing}=await supabase.from('project_disbursements').select('id').eq('cubicacion_id',cubicacionId).maybeSingle()
 if(existing) redirect('/admin/cubicaciones/'+cubicacionId+'?error=Ya+existe+un+desembolso')
 const {data:d,error}=await supabase.from('project_disbursements').insert({
  cubicacion_id:c.id,project_id:c.project_id,amount:c.net_amount,currency:c.currency,
  status:'pending_accounting',prepared_by:userId,prepared_at:new Date().toISOString(),
  notes:String(formData.get('notes')||'')
 }).select('id').single()
 if(error||!d) redirect('/admin/cubicaciones/'+cubicacionId+'?error='+encodeURIComponent(error?.message||'No se pudo preparar el desembolso'))
 await supabase.from('project_cubicaciones').update({status:'accounting_review',accounting_reviewed_by:userId,accounting_reviewed_at:new Date().toISOString()}).eq('id',cubicacionId)
 await supabase.from('audit_log').insert({actor_id:userId,action:'disbursement_prepared',entity_type:'project_disbursement',entity_id:d.id,department_code:'ACCOUNTING',new_data:{cubicacion_id:cubicacionId,amount:c.net_amount}})
 revalidatePath('/admin/cubicaciones')
 revalidatePath('/admin/cubicaciones/'+cubicacionId)
 redirect('/admin/cubicaciones/'+cubicacionId+'?success=1')
}

export async function processDisbursement(formData:FormData){
 const {supabase,userId,role}=await getContext()
 if(!['admin','accounting','finance','cfo','treasury'].includes(role||'')) redirect('/investor')
 const id=String(formData.get('id')||'')
 const status=String(formData.get('status')||'')
 if(!['approved','paid','rejected','cancelled'].includes(status)) redirect('/admin/cubicaciones?error=Estado+inválido')
 const {data:d}=await supabase.from('project_disbursements').select('id,project_id,status').eq('id',id).maybeSingle()
 if(!d) redirect('/admin/cubicaciones?error=Desembolso+no+encontrado')
 const patch:any={status,notes:String(formData.get('notes')||''),updated_at:new Date().toISOString()}
 if(status==='approved') Object.assign(patch,{approved_by:userId,approved_at:new Date().toISOString()})
 if(status==='paid') Object.assign(patch,{paid_by:userId,paid_at:new Date().toISOString(),payment_reference:String(formData.get('payment_reference')||''),payment_method:String(formData.get('payment_method')||'')})
 const {error}=await supabase.from('project_disbursements').update(patch).eq('id',id)
 if(error) redirect('/admin/cubicaciones?error='+encodeURIComponent(error.message))
 await supabase.from('audit_log').insert({actor_id:userId,action:'disbursement_'+status,entity_type:'project_disbursement',entity_id:id,department_code:status==='paid'?'TREASURY':'ACCOUNTING',new_data:patch})
 revalidatePath('/admin/cubicaciones')
 redirect('/admin/cubicaciones?success=1')
}
