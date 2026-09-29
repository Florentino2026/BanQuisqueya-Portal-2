import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateProject } from '../actions'
import { saveMilestone, saveExecutionUpdate } from './execution-actions'

export default async function ProjectDetail({params}:{params:Promise<{id:string}>}){
 const {id}=await params; const s=await createClient()
 const [{data:p},{data:dash},{data:milestones},{data:updates},{data:exec}]=await Promise.all([
  s.from('projects').select('*').eq('id',id).maybeSingle(),
  s.from('project_execution_dashboard').select('*').eq('project_id',id).maybeSingle(),
  s.from('project_execution_milestones').select('*').eq('project_id',id).order('planned_date',{ascending:true}),
  s.from('project_execution_updates').select('*').eq('project_id',id).order('report_date',{ascending:false}).limit(10),
  s.from('project_execution_controls').select('*').eq('project_id',id).maybeSingle()
 ])
 if(!p)notFound()
 const money=(n:number)=>'USD '+Number(n||0).toLocaleString('en-US',{maximumFractionDigits:0})
 return <div className="dashboard"><div className="container">
  <Link href="/admin/projects">← Proyectos</Link>
  <div style={{margin:'16px 0 24px'}}><div className="muted">Ficha y Command Center</div><h1>{p.name}</h1><p className="muted">{p.sector} · {p.location||'Ubicación no definida'} · {p.status}</p></div>
  {dash&&<div className="metric-grid">
   <div className="metric-card"><div className="metric-label">Presupuesto</div><div className="metric-value">{money(dash.budget)}</div></div>
   <div className="metric-card"><div className="metric-label">Comprometido</div><div className="metric-value">{money(dash.committed)}</div></div>
   <div className="metric-card"><div className="metric-label">Financiado</div><div className="metric-value">{money(dash.funded)}</div></div>
   <div className="metric-card"><div className="metric-label">Funding gap</div><div className="metric-value">{money(dash.funding_gap)}</div></div>
  </div>}
  <div className="dashboard-columns" style={{marginTop:20}}>
   <section className="panel"><div className="panel-heading"><div><div className="eyebrow">Ejecución</div><h2>Avance del proyecto</h2></div></div>
    <div className="pipeline-list"><div className="pipeline-track"><span style={{width:(dash?.physical_progress||0)+'%'}}/></div><strong>Avance físico: {Number(dash?.physical_progress||0).toFixed(1)}%</strong><div className="pipeline-track"><span style={{width:(dash?.financial_progress||0)+'%'}}/></div><strong>Avance financiero: {Number(dash?.financial_progress||0).toFixed(1)}%</strong></div>
    <p className="muted">Hitos retrasados: {dash?.delayed_milestones||0} · Última actualización: {dash?.last_update||'—'}</p>
   </section>
   <section className="panel"><div className="panel-heading"><div><div className="eyebrow">Control</div><h2>Estado operativo</h2></div></div><p><strong>{exec?.status||'No inicializado'}</strong></p><p>Presupuesto: {exec?.approved_budget?'✓':'Pendiente'} · Contratos: {exec?.contracts_ready?'✓':'Pendiente'} · Procurement: {exec?.procurement_ready?'✓':'Pendiente'} · Equipo: {exec?.project_team_ready?'✓':'Pendiente'} · Primer desembolso: {exec?.first_disbursement_ready?'✓':'Pendiente'}</p></section>
  </div>
  <div className="dashboard-columns" style={{marginTop:20}}>
   <section className="panel"><div className="panel-heading"><h2>Registrar actualización</h2></div><form action={saveExecutionUpdate} className="form"><input type="hidden" name="project_id" value={id}/><div className="grid"><label>Fecha<input name="report_date" type="date"/></label><label>Avance físico %<input name="physical_progress_pct" type="number" step="0.1" min="0" max="100"/></label><label>Avance financiero %<input name="financial_progress_pct" type="number" step="0.1" min="0" max="100"/></label><label>Gastado<input name="amount_spent" type="number" step="0.01"/></label><label>Comprometido<input name="amount_committed" type="number" step="0.01"/></label><label>Moneda<input name="currency" defaultValue="USD"/></label></div><label>Resumen<textarea name="summary"/></label><label>Riesgos<textarea name="risks"/></label><label>Decisiones requeridas<textarea name="decisions_required"/></label><button className="btn primary">Guardar actualización</button></form></section>
   <section className="panel"><div className="panel-heading"><h2>Nuevo hito</h2></div><form action={saveMilestone} className="form"><input type="hidden" name="project_id" value={id}/><input type="hidden" name="application_id" value=""/><label>Hito<input name="name" required/></label><div className="grid"><label>Categoría<input name="category" defaultValue="general"/></label><label>Fecha planificada<input name="planned_date" type="date"/></label><label>Progreso %<input name="progress_pct" type="number" min="0" max="100" defaultValue="0"/></label><label>Estado<select name="status"><option value="pending">Pendiente</option><option value="in_progress">En ejecución</option><option value="completed">Completado</option><option value="delayed">Retrasado</option></select></label></div><label>Notas<textarea name="notes"/></label><button className="btn primary">Agregar hito</button></form></section>
  </div>
  <section className="panel" style={{marginTop:20}}><div className="panel-heading"><h2>Hitos</h2></div><div className="table-wrap"><table className="professional-table"><thead><tr><th>Hito</th><th>Categoría</th><th>Planificado</th><th>Progreso</th><th>Estado</th></tr></thead><tbody>{(milestones||[]).map((m:any)=><tr key={m.id}><td><strong>{m.name}</strong></td><td>{m.category}</td><td>{m.planned_date||'—'}</td><td>{Number(m.progress_pct).toFixed(1)}%</td><td>{m.status}</td></tr>)}</tbody></table></div></section>
  <section className="panel" style={{marginTop:20}}><div className="panel-heading"><h2>Últimas actualizaciones</h2></div><div className="table-wrap"><table className="professional-table"><thead><tr><th>Fecha</th><th>Físico</th><th>Financiero</th><th>Gastado</th><th>Riesgos</th></tr></thead><tbody>{(updates||[]).map((u:any)=><tr key={u.id}><td>{u.report_date}</td><td>{u.physical_progress_pct??'—'}%</td><td>{u.financial_progress_pct??'—'}%</td><td>{money(u.amount_spent)}</td><td>{u.risks||'—'}</td></tr>)}</tbody></table></div></section>
 </div></div>
}
