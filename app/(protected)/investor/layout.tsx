import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'

export default async function InvestorLayout({children}:{children:React.ReactNode}){
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 const staff=isStaffRole(profile?.role)
 return <div className="shell"><aside className="sidebar">
  <div style={{padding:'0 0 18px'}}><BrandLogo compact/><strong style={{display:'block',marginTop:10}}>Portal del inversionista</strong></div>
  <Link href="/investor">Dashboard</Link>
  <Link href="/investor/applications">Mis solicitudes</Link>
  <Link href="/investor/investments">Mis inversiones</Link>
  <Link href="/investor/documents">Documentos</Link>
  <Link href="/investor/profile">Mi perfil</Link>
  {staff&&<div style={{marginTop:20,paddingTop:16,borderTop:'1px solid #e5e7eb'}}><div className="muted" style={{fontSize:12,marginBottom:8}}>Acceso interno · {ROLE_LABELS[profile!.role as keyof typeof ROLE_LABELS]}</div><Link href="/admin" className="button secondary">Panel de administración</Link></div>}
 </aside><main>{children}</main></div>
}
