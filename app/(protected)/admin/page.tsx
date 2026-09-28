import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'

const stages=[['submitted','Recibidas'],['kyc_review','KYC'],['due_diligence','Due Diligence'],['investment_committee','Comité'],['contracting','Contratación'],['funded','Financiadas']] as const

export default async function Admin(){
 const s=await createClient()
 const {data:c}=await s.auth.getClaims()
 const uid=c?.claims?.sub as string|undefined
 const {data:p}=await s.from('profiles').select('role,full_name').eq('id',uid||'').maybeSingle()
 if(!isStaffRole(p?.role))return null
 const [{count:investors},{count:projects},{count:kyc},{count:applications},{count:dd},{count:funded},{data:recent}]=await Promise.all([
  s.from('investors').select('*',{count:'exact',head:true}),s.from('projects').select('*',{count:'exact',head:true}),s.from('investors').select('*',{count:'exact',head:true}).eq('kyc_status','in_review'),s.from('funding_applications').select('*',{count:'exact',head:true}).not('status','in','(funded,rejected,withdrawn)'),s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','due_diligence'),s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','funded'),s.from('funding_applications').select('id,application_number,project_name,requested_amount,currency,status,created_at').order('created_at',{ascending:false}).limit(6)
 ])
 const stageCounts=await Promise.all(stages.map(([status])=>s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status',status)))
 const pipeline=stages.map(([status,label],i)=>({status,label,count:stageCounts[i].count||0}))
 const maxStage=Math.max(...pipeline.map(x=>x.count),1)
 const metrics: Array<[string, number, string, string]>=[['Inversionistas',investors||0,'Expedientes registrados','/admin/investors'],['Proyectos',projects||0,'Proyectos en plataforma','/admin/projects'],['KYC en revisión',kyc||0,'Requieren atención','/admin/investors'],['Solicitudes activas',applications||0,'Pipeline vigente','/admin/applications'],['Due Diligence',dd||0,'Expedientes en análisis','/admin/applications'],['Financiadas',funded||0,'Operaciones cerradas','/admin/applications']]
 return <div className="dashboard admin-dashboard"><div className="container dashboard-wide">
  <div className="dashboard-heading"><div><span className="eyebrow">BANQUISQUEYA & TRUST · CONTROL CENTER</span><h1>Panel de gestión</h1><p className="muted">Vista ejecutiva de capital, proyectos, inversionistas y operaciones.</p></div><div className="role-badge"><span>Sesión</span><strong>{ROLE_LABELS[p.role]}</strong></div></div>
  <div className="metric-grid">{metrics.map(([label,value,caption,href])=><Link key={label} href={href} className="metric-card"><span className="metric-icon">BQ</span><div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-caption">{caption}</div></div><span className="metric-arrow">→</span></Link>)}</div>
  <div className="dashboard-columns">
   <section className="panel"><div className="panel-heading"><div><h2>Pipeline de financiamiento</h2><p className="muted">Distribución de solicitudes por etapa.</p></div><Link href="/admin/applications" className="text-link">Ver pipeline →</Link></div><div className="pipeline-list">{pipeline.map(x=><div className="pipeline-row" key={x.status}><div className="pipeline-meta"><span>{x.label}</span><strong>{x.count}</strong></div><div className="pipeline-track"><span style={{width:(x.count/maxStage)*100+'%'}}/></div></div>)}</div></section>
   <section className="panel"><div className="panel-heading"><div><h2>Acciones prioritarias</h2><p className="muted">Accesos rápidos para el equipo.</p></div></div><div className="action-grid"><Link href="/admin/applications" className="action-card"><strong>Solicitudes</strong><span>Revisar pipeline y asignaciones</span></Link><Link href="/admin/investors" className="action-card"><strong>KYC / Compliance</strong><span>Expedientes y documentos</span></Link><Link href="/admin/projects" className="action-card"><strong>Proyectos</strong><span>Estructuración y seguimiento</span></Link><Link href="/admin/cubicaciones" className="action-card"><strong>Desembolsos</strong><span>Cubicaciones y pagos</span></Link></div></section>
  </div>
  <section className="panel"><div className="panel-heading"><div><h2>Actividad reciente</h2><p className="muted">Últimas solicitudes registradas en la plataforma.</p></div></div>{!recent?.length?<div className="empty-state">No hay solicitudes registradas todavía.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Solicitud</th><th>Proyecto</th><th>Monto</th><th>Etapa</th><th>Fecha</th></tr></thead><tbody>{recent.map(x=><tr key={x.id}><td><strong>{x.application_number}</strong></td><td>{x.project_name}</td><td>{x.requested_amount?x.currency+' '+Number(x.requested_amount).toLocaleString('en-US'):'—'}</td><td><span className="status-chip">{x.status}</span></td><td>{new Date(x.created_at).toLocaleDateString('es-DO')}</td></tr>)}</tbody></table></div>}</section>
 </div></div>
}
// Build verification: admin dashboard metric hrefs are explicitly typed.
