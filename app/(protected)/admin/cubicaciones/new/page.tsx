import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createCubicacion } from '../actions'

export default async function NewCubicacion({searchParams}:{searchParams:Promise<{project_id?:string}>}){
 const params=await searchParams
 const projectId=params.project_id||''
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 if(!['admin','project_manager','developer'].includes(profile?.role||''))redirect('/investor')
 const {data:project}=await supabase.from('projects').select('id,name,target_amount').eq('id',projectId).maybeSingle()
 if(!project)redirect('/admin/cubicaciones?error=Proyecto+no+encontrado')
 return <div className="dashboard"><div className="container"><div className="card"><div className="muted">Proyecto</div><h1>{project.name}</h1><p className="muted">Registrar nueva cubicación para revisión del Supervisor.</p><form action={createCubicacion} className="form-grid"><input type="hidden" name="project_id" value={project.id}/><label>Inicio del período<input type="date" name="period_start" required/></label><label>Fin del período<input type="date" name="period_end" required/></label><label>Avance anterior %<input type="number" name="previous_progress_pct" min="0" max="100" step="0.001" required/></label><label>Avance actual %<input type="number" name="current_progress_pct" min="0" max="100" step="0.001" required/></label><label>Monto bruto<input type="number" name="gross_amount" min="0" step="0.01" required/></label><label>Retención<input type="number" name="retention_amount" min="0" step="0.01" defaultValue="0"/></label><label>Amortización anticipo<input type="number" name="advance_applied" min="0" step="0.01" defaultValue="0"/></label><label>Moneda<select name="currency" defaultValue="USD"><option>USD</option><option>EUR</option><option>DOP</option><option>COP</option></select></label><label style={{gridColumn:'1/-1'}}>Descripción de trabajos realizados<textarea name="work_description" rows={5}/></label><div style={{gridColumn:'1/-1',display:'flex',gap:10}}><button className="button" type="submit">Enviar a Supervisor</button></div></form></div></div></div>
}
