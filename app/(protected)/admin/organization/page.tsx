import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ROLE_LABELS, isStaffRole } from '@/lib/auth/roles'

export default async function OrganizationPage(){
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 if(!isStaffRole(profile?.role))redirect('/investor')
 const [{data:departments},{data:roles},{data:matrix},{data:assignments}]=await Promise.all([
  supabase.from('departments').select('id,code,name,description,active').order('name'),
  supabase.from('role_catalog').select('code,department_code,name,description,active').order('department_code'),
  supabase.from('approval_matrix').select('name,department_code,min_amount,max_amount,currency,required_roles,active').order('min_amount'),
  supabase.from('project_staff_assignments').select('id,project_id,user_id,role,active,assigned_at').eq('active',true).order('assigned_at',{ascending:false}).limit(50),
 ])
 return <div className="dashboard"><div className="container">
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:24}}>
   <div><div className="muted">BanQuisqueya & Trust</div><h1 style={{marginBottom:6}}>Estructura corporativa</h1><p className="muted">Departamentos, funciones, matriz de aprobación y asignaciones por proyecto.</p></div>
   <Link href="/admin" className="button secondary">Panel administrativo</Link>
  </div>
  <section className="card" style={{marginBottom:20}}><h2>Departamentos</h2><div className="grid">{(departments||[]).map(d=><div key={d.id} style={{borderTop:'1px solid #e5e7eb',paddingTop:12}}><strong>{d.name}</strong><div className="muted" style={{fontSize:12}}>{d.code}</div><p className="muted">{d.description}</p></div>)}</div></section>
  <section className="card" style={{marginBottom:20}}><h2>Catálogo de roles</h2><div className="grid">{(roles||[]).map(r=><div key={r.code} style={{borderTop:'1px solid #e5e7eb',paddingTop:12}}><strong>{ROLE_LABELS[r.code as keyof typeof ROLE_LABELS] || r.name}</strong><div className="muted" style={{fontSize:12}}>{r.department_code}</div><p className="muted">{r.description}</p></div>)}</div></section>
  <section className="card" style={{marginBottom:20,overflowX:'auto'}}><h2>Matriz de aprobación</h2><table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:10}}>Nivel</th><th style={{textAlign:'left',padding:10}}>Rango</th><th style={{textAlign:'left',padding:10}}>Roles requeridos</th></tr></thead><tbody>{(matrix||[]).map((m,i)=><tr key={i} style={{borderTop:'1px solid #e5e7eb'}}><td style={{padding:10}}>{m.name}</td><td style={{padding:10}}>{m.currency} {Number(m.min_amount).toLocaleString()} {m.max_amount===null ? 'en adelante' : '– '+Number(m.max_amount).toLocaleString()}</td><td style={{padding:10}}>{(m.required_roles||[]).map((r:string)=>ROLE_LABELS[r as keyof typeof ROLE_LABELS]||r).join(' → ')}</td></tr>)}</tbody></table></section>
  <section className="card"><h2>Asignaciones activas de proyectos</h2>{assignments?.length ? <table style={{width:'100%',borderCollapse:'collapse'}}><thead><tr><th style={{textAlign:'left',padding:10}}>Proyecto</th><th style={{textAlign:'left',padding:10}}>Usuario</th><th style={{textAlign:'left',padding:10}}>Rol</th></tr></thead><tbody>{assignments.map(a=><tr key={a.id} style={{borderTop:'1px solid #e5e7eb'}}><td style={{padding:10}}>{a.project_id}</td><td style={{padding:10}}>{a.user_id}</td><td style={{padding:10}}>{ROLE_LABELS[a.role as keyof typeof ROLE_LABELS]||a.role}</td></tr>)}</tbody></table>:<p className="muted">Aún no hay asignaciones. Las asignaciones por proyecto se habilitarán desde la gestión de proyectos.</p>}</section>
 </div></div>
}
