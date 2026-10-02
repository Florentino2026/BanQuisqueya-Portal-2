import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'

const money=(value:number,currency='USD')=>value.toLocaleString('en-US',{style:'currency',currency,maximumFractionDigits:0})
const date=(value:string|null)=>value?new Date(value).toLocaleDateString('es-DO',{year:'numeric',month:'short',day:'2-digit'}):'—'

export default async function InvestorDashboard(){
  const s=await createClient()
  const {data:{user}}=await s.auth.getUser()
  if(!user) redirect('/login')

  const {data:profile}=await s.from('profiles').select('full_name,role').eq('id',user.id).maybeSingle()
  const {data:investor}=await s.from('investors').select('id,investor_type,status,kyc_status,country,risk_profile').eq('user_id',user.id).maybeSingle()

  const [{data:investments},{data:transactions}]=await Promise.all([
    s.from('investments').select('id,principal,currency,status,invested_at,maturity_date,project_id').eq('investor_id',investor?.id||'').order('created_at',{ascending:false}).limit(12),
    s.from('transactions').select('id,type,amount,currency,status,transaction_date,description').eq('investor_id',investor?.id||'').order('transaction_date',{ascending:false}).limit(8)
  ])

  const projectIds=(investments??[]).map(x=>x.project_id).filter(Boolean)
  const {data:projects}=projectIds.length
    ? await s.from('projects').select('id,name,sector,location,status').in('id',projectIds)
    : {data:[] as any[]}

  const projectMap=new Map((projects??[]).map(p=>[p.id,p]))
  const totalInvested=(investments??[]).reduce((n,x)=>n+Number(x.principal||0),0)
  const activeCapital=(investments??[]).filter(x=>x.status==='active').reduce((n,x)=>n+Number(x.principal||0),0)
  const pendingAmount=(transactions??[]).filter(x=>x.status==='pending').reduce((n,x)=>n+Number(x.amount||0),0)
  const displayName=profile?.full_name||user.email||'Inversionista'
  const kycLabel=({pending:'Pendiente',in_review:'En revisión',approved:'Aprobado',rejected:'Rechazado'} as Record<string,string>)[investor?.kyc_status||'pending']||investor?.kyc_status||'Pendiente'

  return <div className="investor-portal">
    <header className="portal-topbar">
      <Link href="/" aria-label="BanQuisqueya & Trust"><BrandLogo compact/></Link>
      <div className="topbar-right">
        <span className="portal-demo-badge">ENTORNO DEMO</span>
        {isStaffRole(profile?.role)&&<Link className="btn secondary" href="/admin">Administración · {ROLE_LABELS[profile!.role as keyof typeof ROLE_LABELS]}</Link>}
        <Link className="btn secondary" href="/investor/profile">Mi perfil</Link>
        <form action={signOut}><button className="btn secondary" type="submit">Cerrar sesión</button></form>
      </div>
    </header>

    <main className="dashboard">
      <div className="container dashboard-wide">
        <section className="dashboard-heading">
          <div>
            <span className="eyebrow">BANQUISQUEYA & TRUST · INVESTOR PORTAL</span>
            <h1>Buenos días, {displayName}</h1>
            <p className="muted">Vista institucional de capital, posiciones, movimientos y cumplimiento.</p>
          </div>
          <div className="dashboard-heading-actions">
            <Link href="/investor/profile" className="btn primary">Ver expediente KYC</Link>
            <Link href="/investor/investments" className="btn secondary">Cartera</Link>
          </div>
        </section>

        <section className="notice-panel">
          <div>
            <strong>Entorno de demostración</strong>
            <p>Las cifras y operaciones visibles en este portal son datos demo para validar navegación, permisos, reportes y experiencia de usuario. No representan saldos reales.</p>
          </div>
          <span className="status-chip">DEMO</span>
        </section>

        <section className="metric-grid investor-metrics">
          <div className="metric-card"><span className="metric-icon">◈</span><div><div className="metric-label">Capital invertido</div><div className="metric-value">{money(totalInvested)}</div><div className="metric-caption">Capital registrado en cartera</div></div></div>
          <div className="metric-card"><span className="metric-icon">◆</span><div><div className="metric-label">Capital activo</div><div className="metric-value">{money(activeCapital)}</div><div className="metric-caption">Posiciones con estado activo</div></div></div>
          <div className="metric-card"><span className="metric-icon">◎</span><div><div className="metric-label">Posiciones</div><div className="metric-value">{investments?.length||0}</div><div className="metric-caption">Proyectos en cartera</div></div></div>
          <div className="metric-card"><span className="metric-icon">✓</span><div><div className="metric-label">KYC</div><div className="metric-value metric-text">{kycLabel}</div><div className="metric-caption">{investor?.risk_profile||'Perfil pendiente'}</div></div></div>
        </section>

        {!investor&&<section className="notice-panel"><div><strong>Completa tu expediente de inversionista</strong><p>Necesitamos tu perfil, KYC y documentación para habilitar plenamente tu relación con BanQuisqueya & Trust.</p></div><Link href="/investor/profile" className="btn primary">Completar ahora</Link></section>}

        <div className="dashboard-columns">
          <section className="panel">
            <div className="panel-heading">
              <div><span className="eyebrow">PORTFOLIO</span><h2>Posiciones por proyecto</h2><p className="muted">Exposición de capital y estado de cada inversión.</p></div>
              <Link href="/investor/investments" className="text-link">Ver cartera →</Link>
            </div>
            {!investments?.length?<div className="empty-state">No hay inversiones registradas todavía.</div>:
              <div className="allocation-list">{investments.map(x=>{const p=projectMap.get(x.project_id);return <div className="allocation-row" key={x.id}>
                <div className="allocation-meta"><span>{p?.name||'Proyecto en evaluación'}</span><strong>{money(Number(x.principal||0),x.currency||'USD')}</strong></div>
                <div className="allocation-meta"><small>{p?.sector||'—'} · {p?.location||'—'}</small><span className="status-chip">{x.status}</span></div>
                <div className="pipeline-track"><span style={{width:Math.min(100,Number(x.principal||0)/Math.max(totalInvested,1)*100)+'%'}}/></div>
                <small>Vencimiento: {date(x.maturity_date)}</small>
              </div>})}</div>}
          </section>

          <section className="panel">
            <div className="panel-heading"><div><span className="eyebrow">RELATIONSHIP CENTER</span><h2>Centro de relación</h2><p className="muted">Accesos rápidos a los módulos institucionales.</p></div></div>
            <div className="action-grid">
              <Link href="/investor/applications" className="action-card"><strong>Mis solicitudes</strong><span>Seguimiento de oportunidades y financiamientos</span></Link>
              <Link href="/investor/documents" className="action-card"><strong>Documentos</strong><span>Contratos, KYC y archivos de la relación</span></Link>
              <Link href="/investor/profile" className="action-card"><strong>Perfil & KYC</strong><span>Datos corporativos y cumplimiento</span></Link>
              <Link href="/investor/investments" className="action-card"><strong>Portfolio</strong><span>Posiciones, vencimientos y movimientos</span></Link>
            </div>
            <div className="panel-footer-note">Movimientos pendientes en demo: <strong>{money(pendingAmount)}</strong></div>
          </section>
        </div>

        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">INVESTMENT BOOK</span><h2>Registro de inversiones</h2><p className="muted">Vista consolidada de posiciones demo.</p></div></div>
          {!investments?.length?<div className="empty-state">No hay inversiones registradas todavía.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Proyecto</th><th>Sector</th><th>Capital</th><th>Estado</th><th>Fecha</th><th>Vencimiento</th></tr></thead><tbody>{investments.map(x=>{const p=projectMap.get(x.project_id);return <tr key={x.id}><td><strong>{p?.name||'Proyecto'}</strong></td><td>{p?.sector||'—'}</td><td>{money(Number(x.principal||0),x.currency||'USD')}</td><td><span className="status-chip">{x.status}</span></td><td>{date(x.invested_at)}</td><td>{date(x.maturity_date)}</td></tr>})}</tbody></table></div>}
        </section>

        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">TRANSACTION LEDGER</span><h2>Últimos movimientos</h2><p className="muted">Registro de operaciones utilizadas para la prueba del portal.</p></div></div>
          {!transactions?.length?<div className="empty-state">No hay transacciones registradas todavía.</div>:<div className="table-wrap"><table className="table professional-table"><thead><tr><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th>Estado</th></tr></thead><tbody>{transactions.map(x=><tr key={x.id}><td>{date(x.transaction_date)}</td><td>{x.description||'Movimiento'}</td><td>{x.type}</td><td>{money(Number(x.amount||0),x.currency||'USD')}</td><td><span className="status-chip">{x.status}</span></td></tr>)}</tbody></table></div>}
        </section>
      </div>
    </main>
  </div>
}
