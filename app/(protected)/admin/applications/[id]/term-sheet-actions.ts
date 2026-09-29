'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'
async function staff(roles:string[]=[]){const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const {data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role)||(roles.length&&!roles.includes(p.role)))redirect('/admin');return{s,uid}}
const n=(v:FormDataEntryValue|null)=>v==null||v===''?null:Number(v)
export async function saveTermSheet(f:FormData){const {s,uid}=await staff();const application_id=String(f.get('application_id'));const patch={application_id,structure_type:String(f.get('structure_type')||'financing'),amount:n(f.get('amount')),currency:String(f.get('currency')||'USD'),sponsor_equity_pct:n(f.get('sponsor_equity_pct')),banquisqueya_equity_pct:n(f.get('banquisqueya_equity_pct')),third_party_capital:n(f.get('third_party_capital')),development_fee_pct:n(f.get('development_fee_pct')),management_fee_pct:n(f.get('management_fee_pct')),term_months:n(f.get('term_months')),interest_rate:n(f.get('interest_rate')),repayment_structure:String(f.get('repayment_structure')||''),use_of_funds:String(f.get('use_of_funds')||''),conditions_precedent:String(f.get('conditions_precedent')||''),closing_conditions:String(f.get('closing_conditions')||''),validity_days:n(f.get('validity_days'))||15,status:String(f.get('status')||'draft'),prepared_by:uid};const {error}=await s.from('project_term_sheets').upsert(patch,{onConflict:'application_id'});if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+application_id)}
export async function updateTermSheetStatus(f:FormData){const {s,uid}=await staff(['admin','legal','executive','cfo']);const id=String(f.get('id'));const status=String(f.get('status'));const patch:any={status,updated_at:new Date().toISOString()};if(status==='approved_internal'){patch.approved_by=uid;patch.approved_at=new Date().toISOString()}if(status==='issued')patch.issued_at=new Date().toISOString();const {error}=await s.from('project_term_sheets').update(patch).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+String(f.get('application_id')))}
export async function addLegalWorkflow(f:FormData){const {s,uid}=await staff(['admin','legal','contract_manager','executive']);const application_id=String(f.get('application_id'));const {error}=await s.from('project_legal_workflows').insert({application_id,document_type:String(f.get('document_type')),title:String(f.get('title')),version:String(f.get('version')||'1.0'),counterparty_name:String(f.get('counterparty_name')||''),notes:String(f.get('notes')||''),status:'draft',prepared_by:uid});if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+application_id)}
export async function updateLegalWorkflow(f:FormData){const {s,uid}=await staff(['admin','legal','contract_manager','executive']);const id=String(f.get('id'));const status=String(f.get('status'));const patch:any={status,updated_at:new Date().toISOString()};if(status==='approved')patch.approved_by=uid;if(status==='legal_review')patch.reviewed_by=uid;if(status==='sent')patch.sent_at=new Date().toISOString();if(status==='accepted')patch.accepted_at=new Date().toISOString();if(status==='executed')patch.executed_at=new Date().toISOString();const {error}=await s.from('project_legal_workflows').update(patch).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+String(f.get('application_id')))}

export async function prepareClosingPackage(f:FormData){
 const {s,uid}=await staff(['admin','legal','contract_manager','executive']);
 const application_id=String(f.get('application_id'));
 const {data:a}=await s.from('funding_applications').select('id,client_id,project_name,application_number,status,engagement_type,requested_amount,currency').eq('id',application_id).maybeSingle();
 if(!a?.client_id)throw new Error('La solicitud no tiene cliente asociado.');
 const {data:client}=await s.from('clients').select('id,legal_name,contact_name,kyc_status,email').eq('id',a.client_id).maybeSingle();
 if(!client)throw new Error('No se encontró el cliente.');
 if(client.kyc_status!=='approved')throw new Error('El KYC del cliente debe estar aprobado antes de emitir el paquete de cierre.');
 const {data:approvedTerm}=await s.from('project_term_sheets').select('status').eq('application_id',application_id).maybeSingle();
 if(!approvedTerm||!['approved_internal','issued','accepted'].includes(approvedTerm.status))throw new Error('El Term Sheet debe estar aprobado internamente, emitido o aceptado antes de emitir el paquete de cierre.');
 if(!['approved','conditionally_approved','term_sheet','contracting','closing'].includes(a.status))throw new Error('La solicitud todavía no está en una etapa habilitada para cierre documental.');
 const {data:term}=await s.from('project_term_sheets').select('*').eq('application_id',application_id).maybeSingle();
 const {data:legalDocs}=await s.from('legal_documents').select('id,code,name').in('code',['NDA','CAPITAL-MGMT','TERM-SHEET']).eq('active',true);
 const docsByCode=new Map((legalDocs||[]).map(x=>[x.code,x]));
 const base=[
  {type:'nda',code:'NDA',title:'Acuerdo de Confidencialidad — BanQuisqueya & Trust'},
  {type:'management_authorization',code:'CAPITAL-MGMT',title:'Autorización de Gestión de Capitales — BanQuisqueya & Trust'},
  {type:'term_sheet',code:'TERM-SHEET',title:'Hoja de Términos — BanQuisqueya & Trust'}
 ];
 const termText=term?[
  'BanQuisqueya & Trust',
  'HOJA DE TÉRMINOS PRELIMINAR',
  '',
  'Proyecto: '+a.project_name,
  'Solicitud: '+a.application_number,
  'Contraparte: '+(client.legal_name||client.contact_name||'—'),
  'Estructura: '+String(term.structure_type||a.engagement_type||'financing').replaceAll('_',' '),
  'Monto: '+(term.amount??a.requested_amount??'—')+' '+(term.currency||a.currency||'USD'),
  'Equity Sponsor: '+(term.sponsor_equity_pct??'—')+'%',
  'Equity BanQuisqueya & Trust: '+(term.banquisqueya_equity_pct??'—')+'%',
  'Capital de terceros: '+(term.third_party_capital??'—'),
  'Development fee: '+(term.development_fee_pct??'—')+'%',
  'Management fee: '+(term.management_fee_pct??'—')+'%',
  'Plazo: '+(term.term_months??'—')+' meses',
  '',
  'Uso de fondos: '+(term.use_of_funds||'—'),
  'Estructura de repago: '+(term.repayment_structure||'—'),
  'Condiciones precedentes: '+(term.conditions_precedent||'—'),
  'Condiciones de cierre: '+(term.closing_conditions||'—'),
  '',
  'Este documento es preliminar, está sujeto a revisión legal, due diligence, aprobaciones internas y documentación definitiva. No constituye por sí solo un compromiso irrevocable de financiación.',
  'BanQuisqueya & Trust'
 ].join('\n'):'La Hoja de Términos será emitida después de completar la estructuración correspondiente.';
 const contents:any={
  nda:'BanQuisqueya & Trust\nACUERDO DE CONFIDENCIALIDAD\n\nEntre BanQuisqueya & Trust y la contraparte identificada en el expediente del proyecto '+a.project_name+'.\n\nObjeto: proteger la información confidencial intercambiada para la evaluación, estructuración y eventual desarrollo de la oportunidad.\n\nLa versión definitiva y las obligaciones vinculantes deberán ser revisadas y aprobadas por el área legal correspondiente antes de su ejecución.\n\nBanQuisqueya & Trust',
  capital_management_authorization:'BanQuisqueya & Trust\nAUTORIZACIÓN DE GESTIÓN DE CAPITALES\n\nContraparte: '+(client.legal_name||client.contact_name||'—')+'\nProyecto: '+a.project_name+'\n\nEl presente documento registra el alcance preliminar de la autorización para que BanQuisqueya & Trust gestione, estructure y coordine fuentes de capital relacionadas con el proyecto, sujeto a due diligence, aprobaciones internas, cumplimiento normativo y acuerdos definitivos.\n\nNo constituye por sí solo una garantía de financiación, captación de depósitos, promesa de rendimiento ni compromiso irrevocable.\n\nBanQuisqueya & Trust',
  term_sheet:termText
 };
 for(const d of base){
  const ld=docsByCode.get(d.code); if(!ld)continue;
  let workflow:any=null;
  const {data:w}=await s.from('project_legal_workflows').select('id').eq('application_id',application_id).eq('document_type',d.type).maybeSingle();
  if(w)workflow=w; else {
   const {data:nw,error:we}=await s.from('project_legal_workflows').insert({application_id,document_type:d.type,title:d.title,status:'approved',version:'1.0',counterparty_name:client.legal_name||client.contact_name||'',notes:'Paquete de cierre documental de BanQuisqueya & Trust. Sujeto a revisión legal.',prepared_by:uid,approved_by:uid}).select('id').single();
   if(we)throw new Error(we.message); workflow=nw;
  }
  const {data:dv}=await s.from('document_versions').insert({legal_document_id:ld.id,version:'1.0',title:d.title,content:contents[d.type],active:true}).select('id').single();
  if(!dv)continue;
  const {data:delivery,error:deliveryError}=await s.from('project_document_deliveries').upsert({application_id,client_id:a.client_id,legal_workflow_id:workflow.id,document_version_id:dv.id,document_type:d.type,title:d.title,version:'1.0',content:contents[d.type],status:'sent',requires_acceptance:true,sent_at:new Date().toISOString(),created_by:uid},{onConflict:'application_id,document_type'}).select('id').single();
  if(deliveryError)throw new Error(deliveryError.message);
  await s.from('project_legal_workflows').update({status:'sent',sent_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',workflow.id);
 }
 revalidatePath('/admin/applications/'+application_id);
 revalidatePath('/client/applications/'+application_id);
}
