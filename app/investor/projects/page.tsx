import Link from 'next/link'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import InvestorNav from '@/components/InvestorNav'

const money=(v:number)=>v.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0})
const statusLabel:Record<string,string>={open:'Abierta',active:'En ejecución',funded:'Financiada',completed:'Completada',closed:'Cerrada',draft:'En preparación'}

export default async function InvestorProjects(){
  const s=await createClient()
  const {data:{user}}=await s.auth.getUser()
  if(!user) redirect('/login')
  const {data:projects}=await s.from('projects').select('id,name,sector,location,description,target_amount,minimum_investment,projected_return,term_months,status').in('status',['open','active','funded']).order('created_at',{ascending:false})
  return <div className="investor-portal">
    <header className="portal-topbar"><Link href="/" className="investor-topbar-brand"><span className="brand-logo"><img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust"/><span className="brand-wordmark"><strong>BANQUISQUEYA</strong><span className="brand-subline"><i/> &amp; TRUST</span></span></span></Link><div className="topbar-right"><Link className="btn secondary" href="/investor">Dashboard</Link><Link className="btn secondary" href="/investor/profile">Mi perfil</Link></div></header>
    <main className="dashboard"><div className="container dashboard-wide">
      <InvestorNav active="Oportunidades"/>
      <section className="dashboard-heading"><div><span className="eyebrow">INVESTMENT OPPORTUNITIES</span><h1>Oportunidades de inversión</h1><p className="muted">Proyectos disponibles para revisión dentro del entorno institucional de BanQuisqueya &amp; Trust.</p></div></section>
      <section className="notice-panel"><div><strong>Información de evaluación</strong><p>Las oportunidades mostradas son datos demo. Las condiciones, retornos y plazos deben considerarse indicativos hasta completar due diligence, aprobación interna y documentación contractual.</p></div><span className="status-chip">DEMO</span></section>
      <div className="project-opportunity-grid">{(projects||[]).map(p=><article className="project-opportunity-card" key={p.id}>
        <div className="project-card-top"><span className="eyebrow">{p.sector}</span><span className="status-chip">{statusLabel[p.status]||p.status}</span></div>
        <h2>{p.name}</h2><p>{p.description||'Oportunidad institucional en evaluación.'}</p>
        <div className="project-facts"><div><span>Ubicación</span><strong>{p.location||'—'}</strong></div><div><span>Objetivo</span><strong>{p.target_amount?money(Number(p.target_amount)):'—'}</strong></div><div><span>Mínimo</span><strong>{p.minimum_investment?money(Number(p.minimum_investment)):'—'}</strong></div><div><span>Retorno proyectado</span><strong>{p.projected_return!=null?Number(p.projected_return).toFixed(2)+'%':'—'}</strong></div><div><span>Plazo</span><strong>{p.term_months?Math.round(Number(p.term_months)/12)+' años':'—'}</strong></div></div>
        <div className="project-card-footer"><span>Disponible para revisión</span><Link href="/investor/applications" className="text-link">Iniciar conversación →</Link></div>
      </article>)}</div>
      {(!projects||projects.length===0)&&<div className="empty-state">No hay oportunidades publicadas en este momento.</div>}
    </div></main>
  </div>
}
