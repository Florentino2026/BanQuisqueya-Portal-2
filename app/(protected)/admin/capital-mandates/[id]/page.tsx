import { createClient } from '@/lib/supabase/server'
import { updateMandate, updateRoom } from '../actions'

export default async function MandateDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params
 const s=await createClient()
 const [{data:m},{data:r},{data:d},{data:a}]=await Promise.all([
  s.from('capital_mandates').select('*').eq('id',id).maybeSingle(),
  s.from('capital_transaction_rooms').select('*').eq('mandate_id',id).maybeSingle(),
  s.from('capital_room_documents').select('*').eq('room_id',r?.id||'').order('created_at',{ascending:false}),
  s.from('capital_room_access').select('*').eq('room_id',r?.id||'').order('invited_at',{ascending:false})
 ])
 if(!m)return <main className="dashboard-wide"><section className="panel"><h1>Mandato no encontrado</h1><p className="muted">El mandato solicitado no existe o no está disponible.</p></section></main>
 return <main className="dashboard-wide">
  <div className="dashboard-heading"><div><div className="eyebrow">Capital Desk · Transaction Room</div><h1>Capital Mandate</h1><p className="muted">Gestión del mandato, data room y acceso de participantes.</p></div><a className="btn secondary" href="/admin/capital-mandates">← Volver a mandatos</a></div>
  <section className="metric-grid">
   <div className="metric-card"><span className="metric-label">Estado</span><strong className="metric-value" style={{fontSize:20}}>{m.status}</strong></div>
   <div className="metric-card"><span className="metric-label">Objetivo</span><strong className="metric-value">{Number(m.target_amount||0).toLocaleString()} {m.currency}</strong></div>
   <div className="metric-card"><span className="metric-label">Instrumento</span><strong className="metric-value" style={{fontSize:18}}>{m.target_instrument||'—'}</strong></div>
   <div className="metric-card"><span className="metric-label">Documentos</span><strong className="metric-value">{(d||[]).length}</strong></div>
  </section>
  <section className="panel" style={{marginTop:20}}><h2>Capital Process</h2><div className="pipeline-track"><span>Matching</span><span>Mandate</span><span>Data Room</span><span>Due Diligence</span><span>Proposal / Term Sheet</span><span>Closing</span></div><p className="muted" style={{marginTop:12}}>La transición de estados está controlada por reglas de due diligence, Transaction Room y documentación contractual.</p></section><div className="dashboard-columns" style={{marginTop:20}}>
   <section className="panel"><h2>Mandate Terms</h2><form action={updateMandate} className="form"><input type="hidden" name="id" value={id}/><div className="grid">
    <label>Status<select name="status" defaultValue={m.status}>{['draft','proposed','nda','data_room','due_diligence','proposal','term_sheet','approved','declined','closed','expired'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Mandate Type<select name="mandate_type" defaultValue={m.mandate_type}>{['capital_introduction','fundraising','debt_arrangement','equity_placement','co_investment','strategic_capital','other'].map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Target Amount<input name="target_amount" type="number" step="0.01" defaultValue={m.target_amount||0}/></label>
    <label>Currency<input name="currency" defaultValue={m.currency||'USD'}/></label>
    <label>Target Instrument<input name="target_instrument" defaultValue={m.target_instrument||''}/></label>
    <label>Validity Until<input name="validity_until" type="date" defaultValue={m.validity_until||''}/></label>
   </div><label>Mandate Scope<textarea name="mandate_scope" defaultValue={m.mandate_scope||''}/></label><label>Fee Structure<textarea name="fee_structure" defaultValue={m.fee_structure||''}/></label><label>Exclusivity<input name="exclusivity" defaultValue={m.exclusivity||''}/></label><button className="btn primary">Save Mandate</button></form></section>
   <section className="panel"><h2>Transaction Room</h2>{r?<form action={updateRoom} className="form"><input type="hidden" name="id" value={r.id}/><input type="hidden" name="mandate_id" value={id}/><label>Room Name<input value={r.room_name||''} readOnly/></label><label>Status<select name="status" defaultValue={r.status}>{['preparing','open','restricted','closed'].map(x=><option key={x}>{x}</option>)}</select></label><label>Confidentiality Notice<textarea name="confidentiality_notice" defaultValue={r.confidentiality_notice||''}/></label><button className="btn primary">Update Room</button></form>:<p className="muted">No transaction room is linked.</p>}</section>
  </div>
  <div className="dashboard-columns" style={{marginTop:20}}>
   <section className="panel"><h2>Data Room Documents</h2><div className="table-wrap"><table className="professional-table"><thead><tr><th>Title</th><th>Type</th><th>Version</th><th>Status</th><th>Confidentiality</th></tr></thead><tbody>{(d||[]).map((x:any)=><tr key={x.id}><td>{x.title}</td><td>{x.document_type}</td><td>{x.version||'—'}</td><td><span className="status-chip">{x.status}</span></td><td>{x.confidentiality||'—'}</td></tr>)}{!(d||[]).length&&<tr><td colSpan={5}>No documents registered.</td></tr>}</tbody></table></div></section>
   <section className="panel"><h2>Room Access</h2><div className="table-wrap"><table className="professional-table"><thead><tr><th>User</th><th>Access</th><th>Status</th><th>Last Access</th></tr></thead><tbody>{(a||[]).map((x:any)=><tr key={x.id}><td>{x.user_id}</td><td>{x.access_level}</td><td><span className="status-chip">{x.status}</span></td><td>{x.last_access_at?new Date(x.last_access_at).toLocaleString():'—'}</td></tr>)}{!(a||[]).length&&<tr><td colSpan={4}>No users assigned.</td></tr>}</tbody></table></div></section>
  </div>
  <section className="notice-panel" style={{marginTop:20}}><strong>Control de cumplimiento:</strong> el Transaction Room funciona como espacio de documentación y trazabilidad. Cualquier operación de capital queda sujeta a due diligence, documentación contractual, autorizaciones aplicables y cierre formal; no constituye una oferta o garantía de financiación.</section>
 </main>
}