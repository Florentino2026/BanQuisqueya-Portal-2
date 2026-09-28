import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'

export default async function InvestorLayout({children}:{children:React.ReactNode}){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const userId=c?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',userId).maybeSingle()
 const staff=isStaffRole(p?.role)
 return <div className="shell"><aside className="sidebar"><div className="sidebar-brand"><BrandLogo compact/><div><strong>Portal inversionista</strong><span>BanQuisqueya & Trust</span></div></div>
  <div className="sidebar-section">PORTAFOLIO</div><Link href="/investor" className="sidebar-link">Dashboard</Link><Link href="/investor/applications" className="sidebar-link">Mis solicitudes</Link><Link href="/investor/investments" className="sidebar-link">Mis inversiones</Link><Link href="/investor/documents" className="sidebar-link">Documentos</Link>
  <div className="sidebar-section">CUENTA</div><Link href="/investor/profile" className="sidebar-link">Mi perfil y KYC</Link>
  {staff&&<div className="sidebar-footer"><div className="sidebar-note">Acceso interno · {ROLE_LABELS[p!.role as keyof typeof ROLE_LABELS]}</div><Link href="/admin" className="sidebar-switch">Panel administrativo →</Link><Link href="/client" className="sidebar-switch">Vista cliente →</Link></div>}
 </aside><main className="shell-main">{children}</main></div>
}