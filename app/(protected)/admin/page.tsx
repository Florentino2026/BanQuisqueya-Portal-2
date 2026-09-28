import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'

export default async function Admin(){
 const s=await createClient()
 const {data:c}=await s.auth.getClaims()
 const uid=c?.claims?.sub as string|undefined
 const {data:p}=await s.from('profiles').select('role').eq('id',uid||'').maybeSingle()
 if(!isStaffRole(p?.role))return null
 const [{count:investors},{count:projects},{count:kyc},{count:applications},{count:dd},{count:funded}]=await Promise.all([
  s.from('investors').select('*',{count:'exact',head:true}),
  s.from('projects').select('*',{count:'exact',head:true}),
  s.from('investors').select('*',{count:'exact',head:true}).eq('kyc_status','in_review'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).not('status','in','(funded,rejected,withdrawn)'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','due_diligence'),
  s.from('funding_applications').select('*',{count:'exact',head:true}).eq('status','funded')
 ])
 return <div className="dashboard"><div className="container">
  <div style={{marginBottom:24}}><div className="muted">BanQuisqueya & Trust</div><h1>Administración</h1><p className="muted">Centro de control para inversionistas, proyectos y gestión de capital.</p><p className="muted">Rol: {ROLE_LABELS[p.role]}</p></div>
  <div className="grid">
   <div className="card"><div className="muted">Inversionistas</div><div className="stat">{investors||0}</div></div>
   <div className="card"><div className="muted">KYC en revisión</div><div className="stat">{kyc||0}</div></div>
   <div className="card"><div className="muted">Proyectos</div><div className="stat">{projects||0}</div></div>
   <div className="card"><div className="muted">Solicitudes activas</div><div className="stat">{applications||0}</div></div>
   <div className="card"><div className="muted">Due Diligence</div><div className="stat">{dd||0}</div></div>
   <div className="card"><div className="muted">Financiadas</div><div className="stat">{funded||0}</div></div>
  </div>
  <div className="grid" style={{marginTop:20}}>
   <Link href="/admin/applications" className="card" style={{textDecoration:'none'}}><h2>Solicitudes de financiamiento</h2><p className="muted">Pipeline: recepción, KYC, Due Diligence, comité, contratación, cierre y funding.</p><strong>Ver pipeline →</strong></Link>
   <Link href="/admin/projects" className="card" style={{textDecoration:'none'}}><h2>Proyectos</h2><p className="muted">Crear, estructurar y administrar proyectos.</p><strong>Gestionar proyectos →</strong></Link>
   <Link href="/admin/investors" className="card" style={{textDecoration:'none'}}><h2>Inversionistas y KYC</h2><p className="muted">Revisar expedientes, documentos y decisiones KYC.</p><strong>Gestionar expedientes →</strong></Link>
  </div>
 </div></div>
}
