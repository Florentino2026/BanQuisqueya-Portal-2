import Link from 'next/link'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import InvestorNav from '@/components/InvestorNav'

const money=(v:number,c='USD')=>v.toLocaleString('en-US',{style:'currency',currency:c,maximumFractionDigits:0})
const date=(v:string|null)=>v?new Date(v).toLocaleDateString('es-DO',{year:'numeric',month:'short',day:'2-digit'}):'—'
const status:Record<string,string>={active:'Activa',pending:'Pendiente',completed:'Completada',closed:'Cerrada',cancelled:'Cancelada'}

export default async function InvestorInvestments(){
  const s=await createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login')
  const {data:inv}=await s.from('investors').select('id').eq('user_id',user.id).maybeSingle()
  const {data:positions}=inv?.id?await s.from('investments').select('id,principal,currency,status,invested_at,maturity_date,project_id').eq('investor_id',inv.id).order('created_at',{ascending:false}):{data:[] as any[]}
  const ids=(positions||[]).map(x=>x.project_id).filter(Boolean)
  const {data:projects}=ids.length?await s.from('projects').select('id,name,sector,location,projected_return,term_months,status').in('id',ids):{data:[] as any[]}
  const map=new Map((projects||[]).map(p=>[p.id,p]))
  const total=(positions||[]).reduce((n,x)=>n+Number(x.principal||0),0)
  const active=(positions||[]).filter(x=>x.status==='active').reduce((n,x)=>n+Number(x.principal||0),0)
  return <div className="investor-portal"><header className="portal-topbar"><Link href="/investor" className="investor-topbar-brand"><span className="brand-logo"><img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust"/><span className="brand-wordmark"><strong>BANQUISQUEYA</strong><span className="brand-subline"><i/> &amp; TRUST</span></span></span></Link><div className="topbar-right"><Link className="btn secondary" href="/investor/profile">Mi perfil</Link></div></header>
  <main className="dashboard"><div className="container dashboard-wide"><InvestorNav active="Portfolio"/>
    <section className="dashboard-heading"><div><span className="eyebrow">INVESTMENT BOOK</span><h1>Mi Portfolio</h1><p className="muted">Posiciones de capital, vencimientos y exposición por proyecto.</p></div></section>
    <div className="metric-grid"><div className="metric-card"><div><div className="metric-label">Capital invertido</div><div className="metric-value">{money(total)}</div><div className="metric-caption">Posiciones registradas</div></div></div><div className="metric-card"><div><div className="metric-label">Capital activo</div><div className="metric-value">{money(active)}</div><div className="metric-caption">Exposición activa</div></div></div><div className="metric-card"><div><div className="metric-label">Posiciones</div><div className="metric-value">{positions?.length||0}</div><div className="metric-caption">Inversiones en libro</div></div></div></div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">POSITION REGISTER</span><h2>Detalle de cartera</h2><p className="muted">Información proveniente del libro de inversiones demo.</p></div></div>{!positions?.length?<div className="empty-state">No hay inversiones registradas todavía.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Proyecto</th><th>Sector / Ubicación</th><th>Capital</th><th>Retorno proyectado</th><th>Estado</th><th>Invertido</th><th>Vencimiento</th></tr></thead><tbody>{positions.map(x=>{const p=map.get(x.project_id);return <tr key={x.id}><td><strong>{p?.name||'Proyecto'}</strong></td><td>{p?.sector||'—'}<br/><small>{p?.location||'—'}</small></td><td><strong>{money(Number(x.principal||0),x.currency||'USD')}</strong></td><td>{p?.projected_return!=null?Number(p.projected_return).toFixed(2)+'%':'—'}</td><td><span className="status-chip">{status[x.status]||x.status}</span></td><td>{date(x.invested_at)}</td><td>{date(x.maturity_date)}</td></tr>})}</tbody></table></div>}</section>
    <section className="notice-panel"><div><strong>Gestión institucional de cartera</strong><p>La siguiente fase permitirá consultar documentación por posición, eventos de distribución, estados de liquidación y reportes de rendimiento.</p></div><Link href="/investor/transactions" className="btn primary">Ver movimientos</Link></section>
  </div></main></div>
