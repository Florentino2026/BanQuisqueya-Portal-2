import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { acceptClosingDocument, markClosingDocumentViewed } from './actions'

const statusLabel:Record<string,string>={prepared:'Preparado',ready:'Listo',sent:'Disponible',viewed:'Visto',accepted:'Aceptado',rejected:'Rechazado',expired:'Expirado'}
const typeLabel:Record<string,string>={nda:'NDA / Confidencialidad',capital_management_authorization:'Autorización de Gestión de Capitales',term_sheet:'Hoja de Términos',jv_agreement:'Acuerdo Joint Venture',development_agreement:'Development Agreement',financing_agreement:'Financing Agreement',ppp_agreement:'PPP Agreement',shareholders_agreement:'Shareholders Agreement',spv_documents:'Documentos SPV',other:'Documento'}

export default async function ClientApplicationClosing({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 const s=await createClient()
 const {data:{user}}=await s.auth.getUser()
 if(!user)redirect('/login')
 const {data:client}=await s.from('clients').select('id,legal_name,contact_name,kyc_status').eq('user_id',user.id).maybeSingle()
 if(!client)redirect('/investor')
 const {data:a}=await s.from('funding_applications').select('id,application_number,project_name,status,client_id').eq('id',id).eq('client_id',client.id).maybeSingle()
 if(!a)notFound()
 const {data:docs}=await s.from('project_document_deliveries').select('id,document_type,title,version,status,content,requires_acceptance,document_version_id,sent_at,accepted_at').eq('application_id',id).eq('client_id',client.id).order('created_at',{ascending:true})
 const pending=(docs||[]).filter(d=>d.requires_acceptance&&d.status!=='accepted').length
 return <div className="investor-portal"><header className="portal-topbar"><Link href="/"><span className="brand">BANQUISQUEYA <span>& TRUST</span></span></Link><div className="topbar-right"><Link href="/client" className="btn secondary">Mi portal</Link><Link href="/investor" className="btn secondary">Portal inversionista</Link></div></header>
 <main className="dashboard"><div className="container dashboard-wide">
  <div className="dashboard-heading"><div><span className="eyebrow">BANQUISQUEYA & TRUST · CIERRE DOCUMENTAL</span><h1>{a.project_name}</h1><p className="muted">{a.application_number} · Documentación de cierre y aceptación.</p></div></div>
  <section className="notice-panel"><div><strong>{pending?pending+' documento(s) requieren tu aceptación':'Expediente documental actualizado'}</strong><p>Revisa cada documento antes de aceptar. Los documentos de BanQuisqueya & Trust permanecen sujetos a las aprobaciones y revisiones legales aplicables.</p></div></section>
  <div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><h2>Paquete documental</h2><p className="muted">Documentos puestos a disposición por BanQuisqueya & Trust.</p></div></div>
   {!docs?.length?<div className="empty-state">Todavía no hay documentos emitidos para este expediente.</div>:<div className="pipeline-list">{docs.map(d=><article className="action-card" key={d.id}><div style={{display:'flex',justifyContent:'space-between',gap:16,alignItems:'flex-start'}}><div><span className="eyebrow">{typeLabel[d.document_type]||d.document_type}</span><h3 style={{margin:'6px 0'}}>{d.title}</h3><p className="muted">Versión {d.version} · {statusLabel[d.status]||d.status}</p></div><span className="status-chip">{statusLabel[d.status]||d.status}</span></div>
    <details style={{marginTop:14}}><summary style={{cursor:'pointer',fontWeight:700}}>Ver documento</summary><div className="document-preview" style={{whiteSpace:'pre-wrap',marginTop:12,padding:16,border:'1px solid #e5e7eb',borderRadius:10,background:'#fafafa'}}>{d.content||'El documento está disponible en el expediente.'}</div><form action={markClosingDocumentViewed} style={{marginTop:10}}><input type="hidden" name="application_id" value={id}/><input type="hidden" name="delivery_id" value={d.id}/><button className="btn secondary">Marcar como visto</button></form></details>
    {d.requires_acceptance&&d.status!=='accepted'&&<form action={acceptClosingDocument} style={{marginTop:14}}><input type="hidden" name="application_id" value={id}/><input type="hidden" name="delivery_id" value={d.id}/><label style={{display:'flex',gap:10,alignItems:'flex-start'}}><input type="checkbox" required name="accept_terms" value="yes"/><span>Declaro que he revisado el documento y acepto electrónicamente su contenido, sujeto a los términos, condiciones y formalidades legales aplicables.</span></label><button className="btn primary" style={{marginTop:10}}>Aceptar documento</button></form>}
    {d.status==='accepted'&&<p style={{marginTop:12}}><strong>✓ Aceptado electrónicamente</strong>{d.accepted_at?' · '+new Date(d.accepted_at).toLocaleString('es-DO'):''}</p>}
   </article>)}</div>}
  </section>
  <section className="panel"><div className="panel-heading"><div><h2>Ruta de cierre</h2><p className="muted">Control documental del expediente.</p></div></div><div className="pipeline-list"><div className="action-card"><strong>1. KYC</strong><span>{client.kyc_status||'Pendiente'}</span></div><div className="action-card"><strong>2. Documentos</strong><span>{docs?.length||0} emitidos</span></div><div className="action-card"><strong>3. Aceptación</strong><span>{pending?'Pendiente':'Completada'}</span></div><div className="action-card"><strong>4. Cierre</strong><span>Sujeto a documentación definitiva y aprobaciones correspondientes.</span></div></div></section></div>
  <div style={{marginTop:20}}><Link href="/client" className="text-link">← Volver al portal del cliente</Link></div>
 </div></main></div>
}
