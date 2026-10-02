import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo'

export default async function ProtectedLayout({children}:{children:React.ReactNode}){
  const supabase=await createClient()
  const {data,error}=await supabase.auth.getClaims()
  if(error||!data?.claims)redirect('/login')
  return <>
    <header className="nav portal-institutional-nav">
      <div className="container portal-nav-inner">
        <div className="portal-brand"><BrandLogo /></div>
        <div className="portal-nav-meta">
          <span className="portal-status-dot" />
          <span>Portal Institucional</span>
        </div>
      </div>
    </header>
    {children}
  </>
}
