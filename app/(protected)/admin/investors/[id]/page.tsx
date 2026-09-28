import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { reviewKyc, updateDocumentReview } from '../../actions'

const statusLabels: Record<string,string> = {
  pending:'Pendiente',
  in_review:'En revisión',
  approved:'Aprobado',
  rejected:'Rechazado',
}

export default async function InvestorKycReview({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { id } = await params
  const messages = await searchParams
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined
  if (!userId) redirect('/login')

  const { data: admin } = await supabase.from('profiles').select('role').eq('id', userId).maybeSingle()
  if (admin?.role !== 'admin') redirect('/investor')

  const { data: investor } = await supabase
    .from('investors')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!investor) redirect('/admin/investors')

  const [{ data: profile }, { data: documents }, { data: reviews }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', investor.user_id).maybeSingle(),
    supabase.from('documents').select('*').eq('investor_id', id).order('uploaded_at', { ascending: false }),
    supabase.from('kyc_reviews').select('*').eq('investor_id', id).order('created_at', { ascending: false }),
  ])

  const documentsWithUrls = await Promise.all((documents || []).map(async (doc) => {
    const { data } = await supabase.storage.from('investor-kyc').createSignedUrl(doc.storage_path, 900)
    return {...doc, signedUrl: data?.signedUrl || null}
  }))

  return (
    <div className="dashboard">
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <Link href="/admin/investors" className="muted">← Inversionistas</Link>
            <h1 style={{marginTop:8}}>{profile?.full_name || 'Inversionista'}</h1>
            <p className="muted">Expediente KYC · {investor.id}</p>
          </div>
          <span className="card" style={{padding:'8px 14px'}}>{statusLabels[investor.kyc_status] || investor.kyc_status}</span>
        </div>

        {messages.success && <div className="card" style={{marginBottom:16}}>Operación realizada correctamente.</div>}
        {messages.error && <div className="card" style={{marginBottom:16}}>Error: {messages.error}</div>}

        <div className="grid">
          <section className="card">
            <h2>Información personal</h2>
            <p><strong>Nombre:</strong> {profile?.full_name || '—'}</p>
            <p><strong>Teléfono:</strong> {investor.phone || '—'}</p>
            <p><strong>País:</strong> {investor.country || '—'}</p>
            <p><strong>Nacionalidad:</strong> {investor.nationality || '—'}</p>
            <p><strong>Fecha de nacimiento:</strong> {investor.date_of_birth || '—'}</p>
            <p><strong>Dirección:</strong> {investor.address || '—'}</p>
            <p><strong>Ciudad:</strong> {investor.city || '—'}</p>
            <p><strong>Estado/Provincia:</strong> {investor.state_province || '—'}</p>
            <p><strong>Código postal:</strong> {investor.postal_code || '—'}</p>
          </section>

          <section className="card">
            <h2>Perfil de inversión</h2>
            <p><strong>Tipo:</strong> {investor.investor_type}</p>
            <p><strong>Perfil de riesgo:</strong> {investor.risk_profile || '—'}</p>
            <p><strong>Estado:</strong> {investor.status}</p>
            <p><strong>Enviado:</strong> {investor.kyc_submitted_at ? new Date(investor.kyc_submitted_at).toLocaleString('es-DO') : '—'}</p>
          </section>

          <section className="card">
            <h2>Identificación y fondos</h2>
            <p><strong>Documento:</strong> {investor.document_type || '—'}</p>
            <p><strong>Número:</strong> {investor.document_number || '—'}</p>
            <p><strong>Origen de fondos:</strong> {investor.source_of_funds || '—'}</p>
            <p><strong>Beneficiario final:</strong> {investor.beneficial_owner_name || '—'}</p>
            <p><strong>Relación:</strong> {investor.beneficial_owner_relationship || '—'}</p>
          </section>
        </div>

        <section className="card" style={{marginTop:20}}>
          <h2>Documentos KYC</h2>
          {(documentsWithUrls.length === 0) && <p className="muted">No hay documentos cargados.</p>}
          <div style={{display:'grid',gap:12}}>
            {documentsWithUrls.map((doc) => (
              <div key={doc.id} style={{borderTop:'1px solid #e5e7eb',paddingTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
                  <div>
                    <strong>{doc.document_type}</strong>
                    <div>{doc.file_name}</div>
                    <div className="muted">{doc.status} · {new Date(doc.uploaded_at).toLocaleString('es-DO')}</div>
                  </div>
                  {doc.signedUrl && <a className="button secondary" href={doc.signedUrl} target="_blank" rel="noreferrer">Abrir documento</a>}
                </div>
                <form action={updateDocumentReview} style={{display:'flex',gap:8,marginTop:10,flexWrap:'wrap'}}>
                  <input type="hidden" name="document_id" value={doc.id} />
                  <input type="hidden" name="investor_id" value={id} />
                  <select name="status" defaultValue={doc.status}>
                    <option value="submitted">Enviado</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                  <input name="notes" placeholder="Nota opcional" style={{minWidth:240}} />
                  <button className="button" type="submit">Actualizar documento</button>
                </form>
              </div>
            ))}
          </div>
        </section>

        <section className="card" style={{marginTop:20}}>
          <h2>Decisión KYC</h2>
          <p className="muted">Aprobar activa al inversionista. Rechazar exige indicar el motivo. “Requiere cambios” devuelve el expediente a estado pendiente.</p>
          <form action={reviewKyc} style={{display:'grid',gap:12}}>
            <input type="hidden" name="investor_id" value={id} />
            <textarea name="notes" rows={4} placeholder="Observaciones de revisión..." />
            <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
              <button className="button" name="decision" value="approved" type="submit">Aprobar KYC</button>
              <button className="button secondary" name="decision" value="request_changes" type="submit">Solicitar cambios</button>
              <button className="button secondary" name="decision" value="rejected" type="submit">Rechazar KYC</button>
            </div>
          </form>
        </section>

        <section className="card" style={{marginTop:20}}>
          <h2>Historial de revisión</h2>
          {(reviews || []).length === 0 && <p className="muted">No hay revisiones registradas.</p>}
          {(reviews || []).map((review) => (
            <div key={review.id} style={{borderTop:'1px solid #e5e7eb',padding:'12px 0'}}>
              <strong>{review.decision}</strong>
              <div className="muted">{new Date(review.created_at).toLocaleString('es-DO')}</div>
              {review.notes && <p>{review.notes}</p>}
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
