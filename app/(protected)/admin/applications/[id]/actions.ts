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
export async function generateInvestmentCommitteeMemo(f:FormData){
 const {s,uid}=await staff(['admin','executive','cfo','finance','due_diligence','risk_manager','legal'])
 const application_id=String(f.get('application_id'))
 const {data:a}=await s.from('funding_applications').select('*').eq('id',application_id).maybeSingle()
 if(!a) throw new Error('Solicitud no encontrada')
 const project_id=String(a.project_id||'')
 const [{data:st},{data:m},{data:sc},{data:sens},{data:term},{data:spv}]=await Promise.all([
  s.from('project_structuring').select('*').eq('application_id',application_id).maybeSingle(),
  s.from('project_financial_models').select('*').eq('project_id',project_id).maybeSingle(),
  s.from('project_financial_scenarios').select('*').eq('project_id',project_id).order('scenario_type'),
  s.from('project_financial_sensitivity').select('*').eq('project_id',project_id),
  s.from('project_term_sheets').select('*').eq('application_id',application_id).maybeSingle(),
  s.from('project_spvs').select('*').eq('application_id',application_id).maybeSingle()
 ])
 const scenarios=(sc||[]).map((x:any)=>x.name+': IRR '+(x.irr!=null?(Number(x.irr)*100).toFixed(2)+'%':'—')+', NPV '+(x.npv!=null?Number(x.npv).toLocaleString():'—')+', DSCR '+(x.dscr!=null?Number(x.dscr).toFixed(2)+'x':'—')).join('; ')
 const sensitivity=sens||[]
 const worst=sensitivity.length?sensitivity.reduce((x:any,y:any)=>(Number(y.irr??-999)<Number(x.irr??-999)?y:x),sensitivity[0]):null
 const best=sensitivity.length?sensitivity.reduce((x:any,y:any)=>(Number(y.irr??-999)>Number(x.irr??-999)?y:x),sensitivity[0]):null
 const executive_summary='Investment Committee Memo — '+a.project_name+'\n\nOpportunity: '+(a.engagement_type||'financing')+' in '+(a.country||'—')+'. Requested amount: '+(a.requested_amount||'—')+' '+(a.currency||'USD')+'. Project description: '+(a.project_description||'—')
 const investment_thesis='Proposed structure: '+(st?.structure_type||a.engagement_type||'financing')+'. Total project cost: '+(st?.total_project_cost||m?.total_project_cost||'—')+'. Sponsor contribution: '+(st?.sponsor_contribution_value||a.sponsor_contribution_value||'—')+'. BanQuisqueya equity: '+(st?.banquisqueya_equity||m?.banquisqueya_equity||'—')+'. Third-party capital/debt: '+(st?.third_party_debt||'—')+'.'
 const risk_assessment='Financial sensitivity range: '+(worst?.irr!=null?(Number(worst.irr)*100).toFixed(2)+'%':'—')+' to '+(best?.irr!=null?(Number(best.irr)*100).toFixed(2)+'%':'—')+'. Review project assumptions, capital stack, debt service, legal/technical due diligence, permits, sponsor contribution evidence and execution conditions before approval.'
 const financial='Base calculated IRR: '+(m?.calculated_irr!=null?(Number(m.calculated_irr)*100).toFixed(2)+'%':'—')+'; NPV: '+(m?.calculated_npv!=null?Number(m.calculated_npv).toLocaleString():'—')+'; minimum DSCR: '+(m?.calculated_dscr!=null?Number(m.calculated_dscr).toFixed(2)+'x':'—')+'; Payback: '+(m?.payback_years??'—')+' years. Scenarios: '+(scenarios||'not calculated')+'.'
 const legaldd='Term Sheet status: '+(term?.status||'not prepared')+'. SPV: '+(spv?.status||'not prepared')+'. Legal and technical DD should be evidenced in the project record before committee decision.'
 const exit_strategy='Exit / realization strategy: to be defined in the transaction-specific structure, including refinance, sale, distributions or other approved exit mechanisms subject to legal, tax and market validation.'
 const ownership='Proposed ownership: '+(term?.sponsor_equity_pct??st?.sponsor_equity_pct??'—')+'% sponsor / '+(term?.banquisqueya_equity_pct??'—')+'% BanQuisqueya, subject to final capitalization and legal documentation.'
 const fees='Development fee: '+(term?.development_fee_pct??'—')+'%; management fee: '+(term?.management_fee_pct??'—')+'%. Final fees subject to approved term sheet and contracts.'
 const recommendation='For Investment Committee review. This memo is an analytical summary and does not constitute an approval, investment recommendation, commitment, guarantee or promise of return.'
 const {error}=await s.from('project_investment_memos').upsert({
  application_id,
  executive_summary,
  investment_thesis,
  risk_assessment,
  legal_dd_summary:legaldd,
  technical_dd_summary:financial,
  exit_strategy,
  proposed_ownership:ownership,
  proposed_fees:fees,
  recommendation,
  status:'draft',
  created_by:uid,
  updated_by:uid
 },{onConflict:'application_id'})
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
 const {data:current}=await s.from('funding_applications').select('id,status,project_id').eq('id',id).maybeSingle()
 if(!current)throw new Error('Solicitud no encontrada')
 if(current.status==='investment_committee' && ['term_sheet','contracting','closing','funded'].includes(status)){
  const {data:ic}=await s.from('project_ic_decisions').select('decision').eq('project_id',current.project_id).order('decided_at',{ascending:false,nullsFirst:false}).order('created_at',{ascending:false}).limit(1).maybeSingle()
  if(!['approved','conditional'].includes(ic?.decision))throw new Error('La solicitud no puede avanzar sin una decisión válida del Investment Committee.')
  if(ic?.decision==='conditional' && !['term_sheet','contracting'].includes(status))throw new Error('La decisión del Investment Committee es condicional. Primero deben resolverse las condiciones antes de avanzar a Closing o Funded.')
 }
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