import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole } from '@/lib/auth/roles'
import { createVacancy, closeVacancy, updateApplication } from './actions'
import CareerCvLink from './CareerCvLink'

export default async function CareersAdmin(){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined
 const {data:p}=await s.from('profiles').select('role').eq('id',uid||'').maybeSingle()
 if(!isStaffRole(p?.role) || !['admin','hr','operations_manager','executive'].includes(p!.role)) redirect('/admin')
 const [{data:vacancies},{data:applications}]=await Promise.all([
  s.from('job_vacancies').select('*').order('created_at',{ascending:false}),
  s.from('job_applications').select('*').order('created_at',{ascending:false}).limit(100)
 ])
 return <div className="dashboard"><div className="container dashboard-wide">
  <div className="dashboard-heading"><div><span className="eyebrow">BANQUISQUEYA & TRUST · TALENTO</span><h1>Recursos Humanos</h1><p className="muted">Vacantes, candidatos y proceso de selección.</p></div></div>
  <div className="dashboard-columns">
   <section className="panel"><div className="panel-heading"><div><h2>Publicar vacante</h2><p className="muted">La posición aparecerá automáticamente en Carreras.</p></div></div>
    <form action={createVacancy} className="form-grid"><label>Cargo<input name="title" required /></label><label>Departamento<input name="department" required /></label><label>Ubicación<input name="location" placeholder="Santo Domingo / Híbrido / Remoto" /></label><label>Tipo de empleo<input name="employment_type" placeholder="Full-time / Contract" /></label><label>Fecha de cierre<input name="closing_date" type="date" /></label><label className="full">Descripción<textarea name="description" rows={4}/></label><label className="full">Requisitos<textarea name="requirements" rows={5}/></label><div className="full"><button className="btn primary">Publicar vacante</button></div></form>
   </section>
   <section className="panel"><div className="panel-heading"><div><h2>Vacantes</h2><p className="muted">{vacancies?.filter(v=>v.status==='open').length||0} abiertas</p></div></div>
    {!vacancies?.length?<div className="empty-state">No hay vacantes registradas.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Cargo</th><th>Área</th><th>Estado</th><th></th></tr></thead><tbody>{vacancies.map(v=><tr key={v.id}><td><strong>{v.title}</strong></td><td>{v.department}</td><td><span className="status-chip">{v.status}</span></td><td>{v.status==='open'&&<form action={closeVacancy}><input type="hidden" name="id" value={v.id}/><button className="btn secondary">Cerrar</button></form>}</td></tr>)}</tbody></table></div>}
   </section>
  </div>
  <section className="panel"><div className="panel-heading"><div><h2>Candidatos</h2><p className="muted">CV recibidos y seguimiento del proceso.</p></div></div>
   {!applications?.length?<div className="empty-state">No hay candidaturas todavía.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Candidato</th><th>Área</th><th>Vacante</th><th>CV</th><th>Estado</th><th>Notas</th><th>Actualizar</th></tr></thead><tbody>{applications.map(a=><tr key={a.id}><td><strong>{a.full_name}</strong><br/><small>{a.email}</small></td><td>{a.desired_area}</td><td>{vacancies?.find(v=>v.id===a.vacancy_id)?.title||'General'}</td><td><CareerCvLink path={a.cv_storage_path}/></td><td><span className="status-chip">{a.status}</span></td><td>{a.internal_notes||'—'}</td><td><form action={updateApplication} style={{display:'grid',gap:6}}><input type="hidden" name="id" value={a.id}/><select name="status" defaultValue={a.status}><option value="received">Recibido</option><option value="screening">Screening</option><option value="interview">Entrevista</option><option value="shortlisted">Shortlisted</option><option value="rejected">Rechazado</option><option value="hired">Contratado</option></select><input name="internal_notes" defaultValue={a.internal_notes||''} placeholder="Nota interna"/><button className="btn secondary">Guardar</button></form></td></tr>)}</tbody></table></div>}
  </section>
 </div></div>
}
