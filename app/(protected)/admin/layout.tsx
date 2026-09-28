import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'

export default async function AdminLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('full_name,role').eq('id',userId).maybeSingle()
 if(!isStaffRole(profile?.role))redirect('/investor')
 const role=profile.role
 const projectAccess=['admin','project_manager'].includes(role)
 const cubicacionAccess=['admin','supervisor','project_manager','accounting','finance','cfo','treasury'].includes(role)
 return <div className="shell"><aside className="sidebar">
  <div style={{padding:'0 0 16px'}}><strong>Administración</strong><div className="muted" style={{fontSize:12,marginTop:4}}>{ROLE_LABELS[role]}</div></div>
  <Link href="/admin">Dashboard administrativo</Link>
  <Link href="/admin/applications">Solicitudes de financiamiento</Link>
  <Link href="/admin/projects">Proyectos</Link>
  {cubicacionAccess && <Link href="/admin/cubicaciones">Cubicaciones y desembolsos</Link>}
  <Link href="/admin/organization">Estructura corporativa</Link>
  {(role==='admin'||role==='compliance'||role==='kyc_reviewer') && <Link href="/admin/investors">Inversionistas / KYC</Link>}
  {role==='admin' && <Link href="/admin/staff">Staff y roles</Link>}
  {projectAccess && <div className="muted" style={{fontSize:11,marginTop:12}}>Puedes crear y editar proyectos.</div>}
  <div style={{marginTop:20,paddingTop:16,borderTop:'1px solid #e5e7eb'}}><Link href="/investor" className="button secondary">Ir al portal inversionista</Link></div>
 </aside><main>{children}</main></div>
}
