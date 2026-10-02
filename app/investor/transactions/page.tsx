import Link from 'next/link'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import InvestorNav from '@/components/InvestorNav'

const money=(v:number,c='USD')=>v.toLocaleString('en-US',{style:'currency',currency:c,maximumFractionDigits:0})
const date=(v:string|null)=>v?new Date(v).toLocaleDateString('es-DO',{year:'numeric',month:'short',day:'2-digit'}):'—'

export default async function InvestorTransactions(){
  const s=await createClient(); const {data:{user}}=await s.auth.getUser(); if(!user) redirect('/login')
  const {data:inv}=await s.from('investors').select('id').eq('user_id',user.id).maybeSingle()
  const {data:tx}=inv?.id?await s.from('transactions').select('id,type,amount,currency,status,transaction_date,reference,description').eq('investor_id',inv.id).order('transaction_date',{ascending:false}).limit(50)):{data:[] as any[]}
  const total=(tx||[]).reduce((n,x)=>n+Number(x.amount||0),0)
  return <div className="investor-portal"><header className="portal-topbar"><Link href="/investor" className="investor-topbar-brand"><span className="brand-logo"><img className="brand-mark" src="/banquisqueya-original-mark.webp" alt="BanQuisqueya & Trust"/><span className="brand-wordmark"><strong>BANQUISQUEYA</strong><span className="brand-subline"><i/> &amp; TRUST</span></span></span></Link><div className="topbar-right"><Link className="btn secondary" href="/investor/profile">Mi perfil</Link></div></header>
  <main className="dashboard"><div className="container dashboard-wide"><InvestorNav active="Movimientos"/>
    <section className="dashboard-heading"><div><span className="eyebrow">TRANSACTION LEDGER</span><h1>Movimientos</h1><p className="muted">Registro consolidado de movimientos asociados a tu relación de inversión.</p></div></section>
    <div className="metric-grid"><div className="metric-card"><div><div className="metric-label">Movimientos</div><div className="metric-value">{tx?.length||0}</div><div className="metric-caption">Registros disponibles</div></div></div><div className="metric-card"><div><div className="metric-label">Volumen registrado</div><div className="metric-value">{money(total)}</div><div className="metric-caption">Incluye movimientos demo</div></div></div></div>
    <section className="panel"><div className="panel-heading"><div><span className="eyebrow">LEDGER</span><h2>Historial de operaciones</h2></div></div>{!tx?.length?<div className="empty-state">No hay movimientos registrados.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Fecha</th><th>Referencia</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th>Estado</th></tr></thead><tbody>{tx.map(x=><tr key={x.id}><td>{date(x.transaction_date)}</td><td>{x.reference||'—'}</td><td>{x.description||'Movimiento'}</td><td>{x.type}</td><td><strong>{money(Number(x.amount||0),x.currency||'USD')}</strong></td><td><span className="status-chip">{x.status}</span></td></tr>)}</tbody></table></div>}</section>
  </div></main></div>
}
