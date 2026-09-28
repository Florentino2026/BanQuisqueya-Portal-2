import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Admin() {
  const s = await createClient()
  const { data: claimsData } = await s.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined
  const { data: p } = await s.from('profiles').select('role').eq('id', userId || '').maybeSingle()

  if (p?.role !== 'admin') redirect('/investor')

  const [{ count: investors }, { count: projects }, { count: kycInReview }] = await Promise.all([
    s.from('investors').select('*', { count: 'exact', head: true }),
    s.from('projects').select('*', { count: 'exact', head: true }),
    s.from('investors').select('*', { count: 'exact', head: true }).eq('kyc_status', 'in_review'),
  ])

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{marginBottom:24}}>
          <div className="muted">BanQuisqueya & Trust</div>
          <h1>Administración</h1>
          <p className="muted">Centro de control para inversionistas, KYC y proyectos.</p>
        </div>

        <div className="grid">
          <div className="card">
            <div className="muted">Inversionistas</div>
            <div className="stat">{investors || 0}</div>
          </div>
          <div className="card">
            <div className="muted">KYC en revisión</div>
            <div className="stat">{kycInReview || 0}</div>
          </div>
          <div className="card">
            <div className="muted">Proyectos</div>
            <div className="stat">{projects || 0}</div>
          </div>
        </div>

        <div className="grid" style={{marginTop:20}}>
          <Link href="/admin/investors" className="card" style={{textDecoration:'none'}}>
            <h2>Inversionistas y KYC</h2>
            <p className="muted">Revisar expedientes, documentos, observaciones y decisiones KYC.</p>
            <strong>Gestionar expedientes →</strong>
          </Link>

          <div className="card">
            <h2>Proyectos</h2>
            <p className="muted">Módulo de proyectos y due diligence será integrado en la siguiente etapa.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
