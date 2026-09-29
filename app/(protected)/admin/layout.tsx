import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'

export default async function AdminLayout({children}:{children:React.ReactNode}){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const userId=c?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:p}=await s.from('profiles').select('full_name,role').eq('id',userId).maybeSingle()
 if(!isStaffRole(p?.role))redirect('/investor')
 const role=p.role
 const projectAccess=['admin','project_manager'].includes(role)
 const cubicacionAccess=['admin','supervisor','project_manager','accounting','finance','cfo','treasury'].includes(role)
 const procurementAccess=['admin','procurement','vendor_manager','project_manager','finance','accounting','supervisor'].includes(role)
 return <div className="shell"><aside className="sidebar"><div className="sidebar-brand"><BrandLogo compact/><div><strong>Centro corporativo</strong><span>{ROLE_LABELS[role]}</span></div></div>
  <div className="sidebar-section">GESTIÓN</div><Link href="/admin" className="sidebar-link">Dashboard ejecutivo</Link><Link href="/admin/applications" className="sidebar-link">Solicitudes de financiamiento</Link><Link href="/admin/projects" className="sidebar-link">Proyectos</Link><Link href="/admin/partnerships" className="sidebar-link">Joint Ventures & Develop</Link>{['admin','finance','cfo','executive','treasury'].includes(role)&&<Link href="/admin/capital-sources" className="sidebar-link">Fuentes de capital</Link>}
  {procurementAccess&&<Link href="/admin/procurement" className="sidebar-link">Procurement y compras</Link>}
  {['admin','project_manager','finance','accounting','cfo'].includes(role)&&<Link href="/admin/budget" className="sidebar-link">Presupuestos</Link>}
  {['admin','procurement','project_manager'].includes(role)&&<Link href="/admin/procurement/quotes" className="sidebar-link">Cotizaciones</Link>}
  {['admin','procurement','project_manager','finance','accounting'].includes(role)&&<Link href="/admin/procurement/orders" className="sidebar-link">Órdenes de compra</Link>}
  {['admin','legal','contract_manager','project_manager'].includes(role)&&<Link href="/admin/contracts" className="sidebar-link">Contratos</Link>}
  {cubicacionAccess&&<Link href="/admin/cubicaciones" className="sidebar-link">Cubicaciones y desembolsos</Link>}
  {['admin','hr','operations_manager','executive'].includes(role)&&<Link href="/admin/careers" className="sidebar-link">Recursos Humanos</Link>}
  <div className="sidebar-section">CONTROL</div><Link href="/admin/organization" className="sidebar-link">Estructura corporativa</Link>
  {(role==='admin'||role==='compliance'||role==='kyc_reviewer')&&<Link href="/admin/investors" className="sidebar-link">Inversionistas / KYC</Link>}
  {role==='admin'&&<Link href="/admin/staff" className="sidebar-link">Staff y roles</Link>}
  <div className="sidebar-footer"><Link href="/client" className="sidebar-switch">Vista cliente →</Link><Link href="/investor" className="sidebar-switch">Portal inversionista →</Link></div>
 </aside><main className="shell-main">{children}</main></div>
}