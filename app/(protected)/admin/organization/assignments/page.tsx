import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { assignProjectStaff } from './actions'
import { ROLE_LABELS, isStaffRole } from '@/lib/auth/roles'

const assignable=['project_manager','developer','supervisor','accounting','finance','cfo','treasury','due_diligence','legal','procurement','vendor_manager','hse_manager']

export default async function AssignmentsPage({searchParams}:{searchParams:Promise<{error?:string;success?:string}>}){
 const params=await searchParams
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 if(profile?.role!=='admin')redirect('/investor')
 const [{data:projects},{data:users},{data:assignments}]=await Promise.all([
  supabase.from('projects').select('id,name').order('name'),
  supabase.from('profiles').select('id,full_name,role').neq('role','member').order('full_name'),
  supabase.from('project_staff_assignments').select('id,project_id,user_id,role,active,assigned_at').eq('active',true).order('assigned_at',{ascending:false})
 ])
 return <div className="dashboard"><div className="container"><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}><div><div className="muted">Gobierno corporativo</div><h1>Asignación de equipos por proyecto</h1><p className="muted">Define quién puede operar cada proyecto y bajo qué función.</p></div><Link href="/admin/organization" className="button secondary">Estructura corporativa</Link></div>
 {params.error&&<div className="card" style={{marginBottom:16}}>Error: {params.error}</div>}{params.success&&<div className="card" style={{marginBottom:16}}>Asignación guardada correctamente.</div>}
 <section className="card" style={{marginBottom:20}}><h2>Nueva asignación</h2><form action={assignProjectStaff} className="form-grid"><label>Proyecto<select name="project_id" required>{(projects||[]).map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><label>Usuario<select name="user_id" required>{(users||[]).map(u=><option key={u.id} value={u.id}>{u.full_name||u.id} — {isStaffRole(u.role)?ROLE_LABELS[u.role]:u.role}</option>)}</select></label><label>Función<select name="role" required>{assignable.map(r=><option key={r} value={r}>{ROLE_LABELS[r as keyof typeof ROLE_LABELS]||r}</option>)}</select></label><label>Notas<input name="notes" placeholder="Opcional"/></label><div style={{gridColumn:'1/-1'}}><button className="button" type="submit">Asignar responsable</button></div></form></section>
 <section className="card" style={{overflowX:'auto'}}><h2>Asignaciones activas</h2><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:10}}>Proyecto</th><th style={{textAlign:'left',padding:10}}>Usuario</th><th style={{textAlign:'left',padding:10}}>Función</th><th style={{textAlign:'left',padding:10}}>Desde</th></tr></thead><tbody>{(assignments||[]).map(a=>{const p=projects?.find(x=>x.id===a.project_id);const u=users?.find(x=>x.id===a.user_id);return <tr key={a.id} style={{borderTop:'1px solid #e5e7eb'}}><td style={{padding:10}}>{p?.name||a.project_id}</td><td style={{padding:10}}>{u?.full_name||a.user_id}</td><td style={{padding:10}}>{ROLE_LABELS[a.role as keyof typeof ROLE_LABELS]||a.role}</td><td style={{padding:10}}>{new Date(a.assigned_at).toLocaleDateString()}</td></tr>})}</tbody></table>{!assignments?.length&&<p className="muted">No hay asignaciones activas.</p>}</section>
 </div></div>
}
