import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({children}:{children:React.ReactNode}){
  const supabase=await createClient()
  const {data,error}=await supabase.auth.getClaims()
  if(error||!data?.claims)redirect('/login')
  return <>
    <header className="nav">
      <div className="container" style={{width:'100%',display:'flex',justifyContent:'space-between'}}>
        <div className="brand">BanQuisqueya <span>& Trust</span></div>
        <div className="muted">Portal privado</div>
      </div>
    </header>
    {children}
  </>
}
