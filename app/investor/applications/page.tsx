import Link from 'next/link'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import InvestorNav from '@/components/InvestorNav'

export default async function InvestorApplications(){
  const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
  const {data:inv}=await s.from('investors').select('id,status,kyc_status').eq('user_id',user.id).maybeSingle()
  return <div className="investor-portal"><header className="portal-topbar"><Link href="/investor" className="investor-topbar-brand"><span className="brand-logo"><img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust"/><span className="brand-wordmark"><strong>BANQUISQUEYA</strong><span className="brand-subline"><i/> &amp; TRUST</span></span></span></Link><div className="topbar-right"><Link className="btn secondary" href="/investor/profile">Mi perfil</Link></div></header>
  <main className="dashboard"><div className="container dashboard-wide"><InvestorNav active="Solicitudes"/>
    <section className="dashboard-heading"><div><span className="eyebrow">RELATIONSHIP REQUESTS</span><h1>Solicitudes</h1><p className="muted">Seguimiento de solicitudes y conversaciones formales con BanQuisqueya &amp; Trust.</p></div></section>
    <section className="notice-panel"><div><strong>Flujo de solicitudes en preparación</strong><p>Esta sección ya forma parte de la arquitectura del portal, pero el workflow específico de solicitudes de inversión todavía no está activado. No mostramos registros de terceros ni mezclamos solicitudes de clientes con tu expediente de inversionista.</p></div><Link href="/investor/projects" className="btn primary">Explorar oportunidades</Link></section>
    <div className="dashboard-columns"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">ACCOUNT STATUS</span><h2>Relación actual</h2></div></div><div className="profile-detail-grid"><div><span>Inversionista</span><strong>{inv?.status||'Pendiente'}</strong></div><div><span>KYC</span><strong>{inv?.kyc_status||'Pendiente'}</strong></div><div><span>Canal</span><strong>Investor Portal</strong></div></div></section><section className="panel"><div className="panel-heading"><div><span className="eyebrow">NEXT ACTION</span><h2>Iniciar una conversación</h2></div></div><p className="muted">Selecciona una oportunidad y el equipo podrá registrar el interés, la revisión inicial y los siguientes pasos dentro del workflow institucional.</p><Link href="/investor/projects" className="text-link">Ver oportunidades →</Link></section></div>
  </div></main></div>
}
