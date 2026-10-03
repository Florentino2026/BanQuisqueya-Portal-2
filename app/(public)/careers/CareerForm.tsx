'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Vacancy={id:string,title:string,department:string}
export default function CareerForm({vacancies}:{vacancies:Vacancy[]}){
 const [loading,setLoading]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState('')
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setLoading(true);setError('');setMessage('')
  const f=new FormData(e.currentTarget)
  const file=f.get('cv') as File
  if(!file || !file.size){setError('Adjunta tu curriculum vitae.');setLoading(false);return}
  if(file.size>10*1024*1024){setError('El CV no puede superar 10 MB.');setLoading(false);return}
  const allowed=['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if(!allowed.includes(file.type)){setError('Formato no permitido. Utiliza PDF o Word.');setLoading(false);return}
  const supabase=createClient(); const id=crypto.randomUUID()
  const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_'); const path='applications/'+id+'/'+safe
  const upload=await supabase.storage.from('career-cv').upload(path,file,{upsert:false,contentType:file.type})
  if(upload.error){setError('No fue posible cargar el CV. Intenta nuevamente.');setLoading(false);return}
  const vacancyId=String(f.get('vacancy_id')||'')
  const {error:dbError}=await supabase.from('job_applications').insert({
   vacancy_id:vacancyId||null,full_name:String(f.get('full_name')||''),email:String(f.get('email')||''),
   phone:String(f.get('phone')||''),country:String(f.get('country')||''),desired_area:String(f.get('desired_area')||''),
   linkedin_url:String(f.get('linkedin_url')||''),cover_letter:String(f.get('cover_letter')||''),
   cv_file_name:file.name,cv_storage_path:path
  })
  if(dbError){await supabase.storage.from('career-cv').remove([path]);setError('No fue posible registrar la solicitud. Intenta nuevamente.');setLoading(false);return}
  e.currentTarget.reset();setMessage('Hemos recibido tu CV. Nuestro equipo revisará tu perfil de acuerdo con las oportunidades disponibles.');setLoading(false)
 }
 return <form onSubmit={submit} className="institutional careers-form">
  <div className="form-grid"><label>Nombre completo<input name="full_name" required /></label><label>Correo electrónico<input name="email" type="email" required /></label><label>Teléfono<input name="phone" /></label><label>País / ciudad<input name="country" /></label>
  <label>Área en la que deseas trabajar<select name="desired_area" required><option value="">Seleccionar</option><option>Dirección / Ejecutivo</option><option>Finanzas y Tesorería</option><option>Estructuración de Proyectos</option><option>Investment / Capital Markets</option><option>Project Management</option><option>Due Diligence / Riesgos</option><option>Legal / Contratos</option><option>Contabilidad</option><option>Procurement / Compras</option><option>Ingeniería / Supervisión</option><option>HSE / Seguridad y Medio Ambiente</option><option>Tecnología / IT</option><option>Relaciones Institucionales / CRM</option><option>Administración / Operaciones</option><option>Otra</option></select></label>
  <label>Vacante de interés<select name="vacancy_id"><option value="">Considerar para futuras oportunidades</option>{vacancies.map(v=><option key={v.id} value={v.id}>{v.title} · {v.department}</option>)}</select></label>
  <label>LinkedIn (opcional)<input name="linkedin_url" type="url" placeholder="https://linkedin.com/in/..." /></label><label className="full">Carta de presentación / comentario<textarea name="cover_letter" rows={5} placeholder="Cuéntanos brevemente sobre tu experiencia y el área en la que deseas aportar." /></label>
  <label className="full">Curriculum Vitae <input name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required /><small className="muted">PDF o Word · máximo 10 MB</small></label></div>
  {error&&<p style={{color:'#b42318'}}>{error}</p>}{message&&<p>{message}</p>}<button className="btn primary" type="submit" disabled={loading}>{loading?'Enviando…':'Enviar CV'}</button>
 </form>
}
