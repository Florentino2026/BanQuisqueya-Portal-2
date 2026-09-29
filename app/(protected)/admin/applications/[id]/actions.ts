'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'

async function staff(required:string[]=[]){
 const s=await createClient()
 const {data:c}=await s.auth.getClaims()
 const uid=c?.claims?.sub as string|undefined
 if(!uid) redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle()
 if(!isStaffRole(p?.role) || (required.length && !required.includes(p.role))) redirect('/admin')
 return {s,uid,role:p.role}
}
const num=(v:FormDataEntryValue|null)=>{const n=Number(v);return v===null||v===''?null:(Number.isFinite(n)?n:null)}
export async function saveStructuring(f:FormData){
 const {s,uid}=await staff()
 const application_id=String(f.get('application_id'))
 const {data:a}=await s.from('funding_applications').select('id').eq('id',application_id).maybeSingle()
 if(!a) throw new Error('Solicitud no encontrada')
 const payload={application_id,structure_type:String(f.get('structure_type')||'financing'),stage:String(f.get('stage')||'pre_screening'),sponsor_contribution_value:num(f.get('sponsor_contribution')),land_value:num(f.get('land_value')),banquisqueya_equity:num(f.get('banquisqueya_equity')),third_party_debt:num(f.get('third_party_debt_equity')),third_party_equity:null,total_project_cost:num(f.get('total_project_cost')),expected_revenue:num(f.get('expected_revenue')),expected_ebitda:num(f.get('expected_ebitda')),expected_irr:num(f.get('expected_irr')),expected_npv:num(f.get('expected_npv')),dscr:num(f.get('dscr')),target_close_date:f.get('target_close_date')||null,investment_committee_decision:String(f.get('investment_committee_decision')||'pending'),investment_committee_notes:String(f.get('investment_committee_notes')||''),created_by:uid}
 const {error}=await s.from('project_structuring').upsert(payload,{onConflict:'application_id'})
 if(error) throw new Error(error.message)
 revalidatePath('/admin/applications/'+application_id)
}
export async function saveInvestmentMemo(f:FormData){
 const {s,uid}=await staff(['admin','executive','cfo','finance','due_diligence','risk_manager','legal'])
 const application_id=String(f.get('application_id'))
 const payload={application_id,executive_summary:String(f.get('executive_summary')||''),investment_thesis:String(f.get('investment_thesis')||''),risk_assessment:String(f.get('risk_assessment')||''),legal_dd_summary:String(f.get('legal_dd_summary')||''),technical_dd_summary:String(f.get('technical_dd_summary')||''),exit_strategy:String(f.get('exit_strategy')||''),proposed_ownership:String(f.get('proposed_ownership')||''),proposed_fees:String(f.get('proposed_fees')||''),recommendation:String(f.get('recommendation')||''),status:String(f.get('memo_status')||'draft'),updated_by:uid,created_by:uid}
 const {error}=await s.from('project_investment_memos').upsert(payload,{onConflict:'application_id'})
 if(error) throw new Error(error.message)
 revalidatePath('/admin/applications/'+application_id)
}
export async function saveSpv(f:FormData){
 const {s,uid}=await staff()
 const application_id=String(f.get('application_id'))
 const payload={application_id,project_id:f.get('project_id')||null,legal_name:String(f.get('legal_name')||''),jurisdiction:String(f.get('jurisdiction')||''),entity_type:String(f.get('entity_type')||'SPV'),registration_number:String(f.get('registration_number')||''),sponsor_equity_pct:num(f.get('sponsor_equity_pct')),banquisqueya_equity_pct:num(f.get('banquisqueya_equity_pct')),status:String(f.get('spv_status')||'planned'),created_by:uid}
 const {error}=await s.from('project_spvs').upsert(payload,{onConflict:'application_id'})
 if(error) throw new Error(error.message)
 revalidatePath('/admin/applications/'+application_id)
}
export async function addCapitalTranche(f:FormData){
 const {s,uid}=await staff()
 const application_id=String(f.get('application_id'))
 const payload={application_id,project_id:f.get('project_id')||null,capital_source_id:f.get('capital_source_id')||null,tranche_name:String(f.get('tranche_name')||''),capital_type:String(f.get('capital_type')||'other'),amount:num(f.get('amount'))||0,currency:String(f.get('currency')||'USD'),status:String(f.get('capital_status')||'proposed')}
 const {error}=await s.from('project_capital_stack').insert(payload)
 if(error) throw new Error(error.message)
 revalidatePath('/admin/applications/'+application_id)
}
export async function updateApplication(f:FormData){
 const {s,role}=await staff()
 const id=String(f.get('id'))
 const status=String(f.get('status')||'')
 const assigned_to=f.get('assigned_to')?String(f.get('assigned_to')):null
 if(status==='funded'){
  if(!['admin','finance','cfo','executive'].includes(role))throw new Error('Solo Finanzas/CFO/Ejecutivo/Admin puede cerrar como financiada.')
  const {data:close}=await s.from('financial_close_summaries').select('status').eq('application_id',id).maybeSingle()
  if(close?.status!=='closed')throw new Error('Financial Close debe estar cerrado antes de marcar la operación como financiada.')
 }
 const payload:any={updated_at:new Date().toISOString()}
 if(status)payload.status=status
 if(f.get('assigned_to')!==null)payload.assigned_to=assigned_to
 const {error}=await s.from('funding_applications').update(payload).eq('id',id)
 if(error)throw new Error(error.message)
 revalidatePath('/admin/applications/'+id)
 revalidatePath('/admin/applications')
}