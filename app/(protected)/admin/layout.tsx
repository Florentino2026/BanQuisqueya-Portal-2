import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getServerLocale, getTranslations } from '@/lib/i18n'

export default async function AdminLayout({children}:{children:React.ReactNode}){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const userId=c?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:p}=await s.from('profiles').select('full_name,role').eq('id',userId).maybeSingle()
 if(!isStaffRole(p?.role))redirect('/investor')
 const role=p.role
 const locale=await getServerLocale(); const t=getTranslations(locale)
 const projectAccess=['admin','project_manager'].includes(role)
 const cubicacionAccess=['admin','supervisor','project_manager','accounting','finance','cfo','treasury'].includes(role)
 const procurementAccess=['admin','procurement','vendor_manager','project_manager','finance','accounting','supervisor'].includes(role)
 return <div className="shell"><aside className="sidebar"><div className="sidebar-brand"><BrandLogo compact/><div><strong>{t.corporate}</strong><span>{ROLE_LABELS[role]}</span></div></div>
  <div className="sidebar-section">{t.management}</div><Link href="/admin" className="sidebar-link">{t.executiveDashboard}</Link><Link href="/admin/applications" className="sidebar-link">{t.applications}</Link><Link href="/admin/projects" className="sidebar-link">{t.projects}</Link><Link href="/admin/partnerships" className="sidebar-link">{t.jointVentures}</Link>{['admin','finance','cfo','executive','treasury'].includes(role)&&<Link href="/admin/capital-sources" className="sidebar-link">{t.capitalSources}</Link>}
  {procurementAccess&&<Link href="/admin/procurement" className="sidebar-link">{t.procurement}</Link>}
  {['admin','project_manager','finance','accounting','cfo'].includes(role)&&<Link href="/admin/budget" className="sidebar-link">{t.budgets}</Link>}
  {['admin','procurement','project_manager'].includes(role)&&<Link href="/admin/procurement/quotes" className="sidebar-link">{t.quotes}</Link>}
  {['admin','procurement','project_manager','finance','accounting'].includes(role)&&<Link href="/admin/procurement/orders" className="sidebar-link">{t.purchaseOrders}</Link>}
  {['admin','legal','contract_manager','project_manager'].includes(role)&&<Link href="/admin/contracts" className="sidebar-link">{t.contracts}</Link>}
  {cubicacionAccess&&<Link href="/admin/cubicaciones" className="sidebar-link">{t.disbursements}</Link>}
  {['admin','hr','operations_manager','executive'].includes(role)&&<Link href="/admin/careers" className="sidebar-link">{t.humanResources}</Link>}\n  {['admin','relationship_manager','finance','executive','cfo','compliance'].includes(role)&&<><Link href="/admin/capital-desk" className="sidebar-link">{t.capitalDesk}</Link><Link href="/admin/capital-partner-inbox" className="sidebar-link">{t.communications}</Link></>}
  <div className="sidebar-section">{t.control}</div><Link href="/admin/executive-reporting" className="sidebar-link">{t.executiveReporting}</Link><Link href="/admin/investment-analysis" className="sidebar-link">{t.investmentAnalysis}</Link><Link href="/admin/transaction-control" className="sidebar-link">{t.transactionControl}</Link><Link href="/admin/board-report" className="sidebar-link">{t.boardReport}</Link><Link href="/admin/control-center" className="sidebar-link">{t.controlCenter}</Link><Link href="/admin/audit" className="sidebar-link">{t.auditCompliance}</Link><Link href="/admin/compliance" className="sidebar-link">{t.complianceCenter}</Link><Link href="/admin/organization" className="sidebar-link">{t.corporateStructure}</Link>
  {(role==='admin'||role==='compliance'||role==='kyc_reviewer')&&<Link href="/admin/investors" className="sidebar-link">{t.investorsKyc}</Link>}
  {role==='admin'&&<Link href="/admin/staff" className="sidebar-link">{t.staffRoles}</Link>}
  <div className="sidebar-footer"><Link href="/client" className="sidebar-switch">{t.clientView} →</Link><Link href="/investor" className="sidebar-switch">{t.investorPortal} →</Link></div>
 </aside><main className="shell-main"><header className="portal-topbar"><Link href="/"><BrandLogo compact/></Link><div style={{display:'flex',alignItems:'center',gap:18}}><span className="eyebrow" style={{margin:0}}>BANQUISQUEYA & TRUST · INSTITUTIONAL OPERATIONS</span><LanguageSwitcher/><Link href="/client" className="btn secondary">{t.clientView}</Link></div></header>{children}</main></div>
}