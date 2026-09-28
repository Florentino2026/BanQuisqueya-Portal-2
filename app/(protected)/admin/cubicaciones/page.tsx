import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole } from '@/lib/auth/roles'

const labels:Record<string,string>={submitted:'Enviada',under_review:'En revisión',approved:'Aprobada',rejected:'Rechazada',ready_for_payment:'Lista para pago',accounting_review:'En Contabilidad',payment_approved:'Pago aprobado',paid:'Pagada',cancelled:'Cancelada'}

export default async function CubicacionesPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const params=await searchParams
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 if(!isStaffRole(profile?.role))redirect('/investor')
 const {data:rows}=await supabase.from('project_cubicaciones').select('id,cubicacion_number,project_id,period_start,period_end,current_progress_pct,progress_increment_pct,net_amount,currency,status,submitted_at').order('submitted_at',{ascending:false})
 const {data:projects}=await supabase.from('projects').select('id,name').order('name')
 const canCreate=['admin','project_manager','developer'].includes(profile.role)
 return <div className="dashboard"><div className="container">
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:24}}><div><div className="muted">Ejecución de proyectos</div><h1 style={{marginBottom:6}}>Cubicaciones y desembolsos</h1><p className="muted">Supervisión técnica, aprobación y flujo financiero.</p></div>{canCreate&&projects?.length?<Link href={'/admin/cubicaciones/new?project_id='+projects[0].id} className="button">Nueva cubicación</Link>:null}</div>
  {params.error&&<div className="card" style={{marginBottom:16}}>Error: {params.error}</div>}
  {params.success&&<div className="card" style={{marginBottom:16}}>Operación completada correctamente.</div>}
  <section className="card" style={{overflowX:'auto'}}><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:10}}>Cubicación</th><th style={{textAlign:'left',padding:10}}>Proyecto</th><th style={{textAlign:'left',padding:10}}>Avance</th><th style={{textAlign:'left',padding:10}}>Neto</th><th style={{textAlign:'left',padding:10}}>Estado</th></tr></thead><tbody>{(rows||[]).map(r=><tr key={r.id} style={{borderTop:'1px solid #e5e7eb'}}><td style={{padding:10}}><Link href={'/admin/cubicaciones/'+r.id}><strong>{r.cubicacion_number}</strong></Link><div className="muted" style={{fontSize:12}}>{r.period_start} → {r.period_end}</div></td><td style={{padding:10}}>{r.project_id}</td><td style={{padding:10}}>{Number(r.current_progress_pct).toFixed(2)}% <span className="muted">(+{Number(r.progress_increment_pct).toFixed(2)}%)</span></td><td style={{padding:10}}>{r.currency} {Number(r.net_amount).toLocaleString()}</td><td style={{padding:10}}>{labels[r.status]||r.status}</td></tr>)}</tbody></table>{!rows?.length&&<p className="muted" style={{padding:16}}>No hay cubicaciones registradas.</p>}</section>
 </div></div>
}
