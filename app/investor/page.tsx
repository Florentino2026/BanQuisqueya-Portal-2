import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from './actions'
import { isStaffRole, ROLE_LABELS } from '@/lib/auth/roles'
import BrandLogo from '@/components/BrandLogo'

export default async function InvestorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: investor }, { data: investments }, { data: transactions }] = await Promise.all([
    supabase.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle(),
    supabase.from('investors').select('id, investor_type, status, kyc_status, country, risk_profile').eq('user_id', user.id).maybeSingle(),
    supabase.from('investments').select('id, principal, currency, status, invested_at, maturity_date, project_id').order('created_at', { ascending: false }).limit(10),
    supabase.from('transactions').select('id, type, amount, currency, status, transaction_date, description').order('transaction_date', { ascending: false }).limit(10),
  ])

  const totalInvested = (investments ?? []).reduce((sum, item) => sum + Number(item.principal ?? 0), 0)
  const displayName = profile?.full_name || user.email || 'Inversionista'

  return <>
    <header className="nav">
      <div className="container" style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link href="/"><BrandLogo compact/></Link><div style={{display:'flex',gap:8,alignItems:'center'}}>{isStaffRole(profile?.role) && <Link className="btn secondary" href="/admin">Panel de administración · {ROLE_LABELS[profile!.role as keyof typeof ROLE_LABELS]}</Link>}</div>
        <form action={signOut}><button className="btn secondary" type="submit">Cerrar sesión</button></form>
      </div>
    </header>

    <main className="dashboard">
      <div className="container">
        <span className="pill">Fondo de Inversión Privado</span><p className="muted" style={{marginTop:12}}>Portal del inversionista</p>
        <h1>Bienvenido, {displayName}</h1>
        <p className="muted">{user.email}</p>

        <div className="grid">
          <div className="card">
            <p className="muted">Capital invertido</p>
            <div className="stat">{totalInvested.toLocaleString('en-US',{style:'currency',currency:'USD'})}</div>
          </div>
          <div className="card">
            <p className="muted">Estado KYC</p>
            <div className="stat" style={{fontSize:24}}>{investor?.kyc_status || 'Pendiente'}</div>
          </div>
          <div className="card">
            <p className="muted">Cuenta</p>
            <div className="stat" style={{fontSize:24}}>{investor?.status || 'Pendiente'}</div>
          </div>
        </div>

        {!investor && (
          <section className="section">
            <div className="card">
              <h2>Completa tu perfil</h2>
              <p className="muted">Tu acceso está autenticado. El siguiente paso es completar el perfil, KYC y documentación requerida.</p>
              <Link className="btn primary" href="/investor/profile">Completar perfil</Link>
            </div>
          </section>
        )}

        <section className="section">
          <h2>Mis inversiones</h2>
          {!investments?.length ? (
            <div className="card"><p className="muted">No hay inversiones registradas todavía.</p></div>
          ) : (
            <div className="card">
              <table className="table">
                <thead><tr><th>Proyecto</th><th>Capital</th><th>Estado</th><th>Vencimiento</th></tr></thead>
                <tbody>
                  {investments.map(item => (
                    <tr key={item.id}>
                      <td>Proyecto {item.project_id || '—'}</td>
                      <td>{item.currency} {Number(item.principal).toLocaleString('en-US')}</td>
                      <td>{item.status}</td>
                      <td>{item.maturity_date || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="section" style={{paddingTop:0}}><div className="institutional contact-card" style={{marginBottom:24}}><div><strong>BanQuisqueya & Trust</strong><p className="muted" style={{margin:4}}>Atención institucional para inversionistas y proyectos.</p></div><a href="mailto:info@banquisqueya.com">info@banquisqueya.com</a></div></section><section className="section" style={{paddingTop:0}}>
          <h2>Últimas transacciones</h2>
          {!transactions?.length ? (
            <div className="card"><p className="muted">No hay transacciones registradas todavía.</p></div>
          ) : (
            <div className="card">
              <table className="table">
                <thead><tr><th>Fecha</th><th>Tipo</th><th>Monto</th><th>Estado</th></tr></thead>
                <tbody>
                  {transactions.map(item => (
                    <tr key={item.id}>
                      <td>{new Date(item.transaction_date).toLocaleDateString('es-DO')}</td>
                      <td>{item.type}</td>
                      <td>{item.currency} {Number(item.amount).toLocaleString('en-US')}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  </>
}
