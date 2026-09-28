import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { canReviewKyc } from '@/lib/auth/roles'

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
}

export default async function AdminInvestors({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined

  if (!userId) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (!canReviewKyc(profile?.role)) redirect('/investor')

  let query = supabase
    .from('investors')
    .select('id,user_id,investor_type,status,kyc_status,country,risk_profile,kyc_submitted_at,created_at,updated_at')
    .order('updated_at', { ascending: false })

  if (params.status && ['pending', 'in_review', 'approved', 'rejected'].includes(params.status)) {
    query = query.eq('kyc_status', params.status)
  }

  const { data: investors } = await query
  const userIds = (investors || []).map((item) => item.user_id)
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id,full_name').in('id', userIds)
    : { data: [] }

  const names = new Map((profiles || []).map((p) => [p.id, p.full_name || 'Sin nombre']))

  const filters = [
    ['', 'Todos'],
    ['pending', 'Pendientes'],
    ['in_review', 'En revisión'],
    ['approved', 'Aprobados'],
    ['rejected', 'Rechazados'],
  ]

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,marginBottom:24}}>
          <div>
            <div className="muted">BanQuisqueya & Trust</div>
            <h1 style={{marginBottom:6}}>Revisión de Inversionistas</h1>
            <p className="muted">Gestión y revisión de expedientes KYC.</p>
          </div>
          <Link href="/admin" className="button secondary">Administración</Link>
        </div>

        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>
          {filters.map(([value,label]) => (
            <Link
              key={value}
              href={value ? `/admin/investors?status=${value}` : '/admin/investors'}
              className="button secondary"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="card" style={{overflowX:'auto'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left',padding:12}}>Inversionista</th>
                <th style={{textAlign:'left',padding:12}}>Tipo</th>
                <th style={{textAlign:'left',padding:12}}>País</th>
                <th style={{textAlign:'left',padding:12}}>KYC</th>
                <th style={{textAlign:'left',padding:12}}>Enviado</th>
                <th style={{textAlign:'left',padding:12}}></th>
              </tr>
            </thead>
            <tbody>
              {(investors || []).map((item) => (
                <tr key={item.id} style={{borderTop:'1px solid #e5e7eb'}}>
                  <td style={{padding:12}}>
                    <strong>{names.get(item.user_id) || 'Sin nombre'}</strong>
                    <div className="muted" style={{fontSize:12}}>{item.user_id}</div>
                  </td>
                  <td style={{padding:12}}>{item.investor_type}</td>
                  <td style={{padding:12}}>{item.country || '—'}</td>
                  <td style={{padding:12}}><strong>{statusLabels[item.kyc_status] || item.kyc_status}</strong></td>
                  <td style={{padding:12}}>{item.kyc_submitted_at ? new Date(item.kyc_submitted_at).toLocaleDateString('es-DO') : '—'}</td>
                  <td style={{padding:12}}><Link href={`/admin/investors/${item.id}`} className="button">Ver expediente</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!investors?.length && <p className="muted" style={{padding:20}}>No hay inversionistas en este filtro.</p>}
        </div>
      </div>
    </div>
  )
}
