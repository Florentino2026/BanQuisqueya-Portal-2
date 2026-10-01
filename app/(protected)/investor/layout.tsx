import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { getServerLocale, getTranslations } from '@/lib/i18n'

export default async function InvestorLayout({children}:{children:React.ReactNode}){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const userId=c?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:p}=await s.from('profiles').select('role').eq('id',userId).maybeSingle()
 const staff=isStaffRole(p?.role)
 const locale=await getServerLocale(); const t=getTranslations(locale)
 return <div className="shell"><aside className="sidebar"><div className="sidebar-brand"><BrandLogo compact/><div><strong>{t.investorPortal}</strong><span>BanQuisqueya & Trust</span></div></div>
  <div className="sidebar-section">{t.portfolio}</div><Link href="/investor" className="sidebar-link">{t.dashboard}</Link><Link href="/investor/applications" className="sidebar-link">{t.myApplications}</Link><Link href="/investor/investments" className="sidebar-link">{t.myInvestments}</Link><Link href="/investor/documents" className="sidebar-link">{t.documents}</Link>
  <div className="sidebar-section">{t.account}</div><Link href="/investor/profile" className="sidebar-link">{t.myProfile}</Link>
  {staff&&<div className="sidebar-footer"><div className="sidebar-note">Acceso interno · {ROLE_LABELS[p!.role as keyof typeof ROLE_LABELS]}</div><Link href="/admin" className="sidebar-switch">{t.adminPanel} →</Link><Link href="/client" className="sidebar-switch">{t.clientView} →</Link></div>}
 </aside><main className="shell-main"><div className="portal-language-bar"><LanguageSwitcher locale={locale}/></div>{children}</main></div>
}