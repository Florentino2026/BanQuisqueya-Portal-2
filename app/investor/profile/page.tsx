import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { saveProfile, submitKyc, uploadKycDocument } from './actions'

const errorMessages: Record<string, string> = {
  required: 'Completa todos los campos obligatorios antes de continuar.',
  save: 'No fue posible guardar el perfil. Inténtalo nuevamente.',
  profile: 'Primero debes guardar tu perfil.',
  document: 'Debes cargar al menos un documento de identidad.',
  submit: 'No fue posible enviar el KYC a revisión.',
  file: 'Archivo no válido. Usa PDF, JPG, PNG o WEBP de máximo 10 MB.',
  upload: 'No fue posible cargar el documento.',
  save_document: 'El archivo se cargó pero no pudo registrarse. Inténtalo nuevamente.',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  approved: 'Aprobado',
  rejected: 'Rechazado',
}

export default async function InvestorProfile({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: investor }, { data: documents }] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle(),
    supabase.from('investors').select('id, investor_type, phone, country, nationality, date_of_birth, address, city, state_province, postal_code, risk_profile, document_type, document_number, source_of_funds, beneficial_owner_name, beneficial_owner_relationship, kyc_status, kyc_submitted_at').eq('user_id', user.id).maybeSingle(),
    supabase.from('documents').select('id, document_type, file_name, status, uploaded_at').order('uploaded_at', { ascending: false }),
  ])

  const error = typeof params.error === 'string' ? errorMessages[params.error] : ''
  const message = params.saved ? 'Perfil guardado correctamente.' : params.uploaded ? 'Documento cargado correctamente.' : params.submitted ? 'Tu KYC fue enviado y está pendiente de revisión.' : ''

  return (
    <>
      <header className="nav">
        <div className="container" style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div className="brand">BanQuisqueya <span>& Trust</span></div>
          <Link className="btn secondary" href="/investor">Volver al dashboard</Link>
        </div>
      </header>

      <main className="dashboard">
        <div className="container">
          <p className="muted">Onboarding del inversionista</p>
          <h1>Perfil y KYC</h1>
          <p className="muted">Completa tu información para que BanQuisqueya & Trust pueda revisar tu perfil y documentación.</p>

          {error && <div className="card" style={{marginBottom:20}}><strong>{error}</strong></div>}
          {message && <div className="card" style={{marginBottom:20}}><strong>{message}</strong></div>}

          <div className="card" style={{marginBottom:24}}>
            <p className="muted">Estado KYC</p>
            <div className="stat" style={{fontSize:24}}>{statusLabels[investor?.kyc_status || 'pending'] || investor?.kyc_status || 'Pendiente'}</div>
            {investor?.kyc_submitted_at && <p className="muted">Enviado: {new Date(investor.kyc_submitted_at).toLocaleDateString('es-DO')}</p>}
          </div>

          <section className="section">
            <h2>1. Información personal</h2>
            <form className="form card" action={saveProfile}>
              <label htmlFor="full_name">Nombre completo *</label>
              <input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} required />

              <label htmlFor="phone">Teléfono *</label>
              <input id="phone" name="phone" type="tel" defaultValue={investor?.phone || ''} required />

              <div className="grid">
                <div>
                  <label htmlFor="country">País de residencia *</label>
                  <input id="country" name="country" defaultValue={investor?.country || ''} required />
                </div>
                <div>
                  <label htmlFor="nationality">Nacionalidad *</label>
                  <input id="nationality" name="nationality" defaultValue={investor?.nationality || ''} required />
                </div>
              </div>

              <label htmlFor="date_of_birth">Fecha de nacimiento *</label>
              <input id="date_of_birth" name="date_of_birth" type="date" defaultValue={investor?.date_of_birth || ''} required />

              <label htmlFor="address">Dirección *</label>
              <input id="address" name="address" defaultValue={investor?.address || ''} required />

              <div className="grid">
                <div><label htmlFor="city">Ciudad</label><input id="city" name="city" defaultValue={investor?.city || ''} /></div>
                <div><label htmlFor="state_province">Estado/Provincia</label><input id="state_province" name="state_province" defaultValue={investor?.state_province || ''} /></div>
                <div><label htmlFor="postal_code">Código postal</label><input id="postal_code" name="postal_code" defaultValue={investor?.postal_code || ''} /></div>
              </div>

              <h3>Perfil de inversión</h3>
              <label htmlFor="investor_type">Tipo de inversionista *</label>
              <select id="investor_type" name="investor_type" defaultValue={investor?.investor_type || 'individual'}>
                <option value="individual">Persona física</option>
                <option value="corporate">Corporativo</option>
                <option value="institutional">Institucional</option>
              </select>

              <label htmlFor="risk_profile">Perfil de riesgo</label>
              <select id="risk_profile" name="risk_profile" defaultValue={investor?.risk_profile || ''}>
                <option value="">Seleccionar</option>
                <option value="conservative">Conservador</option>
                <option value="moderate">Moderado</option>
                <option value="aggressive">Agresivo</option>
              </select>

              <h3>Identificación y origen de fondos</h3>
              <label htmlFor="document_type">Tipo de documento *</label>
              <select id="document_type" name="document_type" defaultValue={investor?.document_type || 'passport'}>
                <option value="passport">Pasaporte</option>
                <option value="national_id">Documento de identidad</option>
                <option value="drivers_license">Licencia de conducir</option>
              </select>

              <label htmlFor="document_number">Número de documento *</label>
              <input id="document_number" name="document_number" defaultValue={investor?.document_number || ''} required />

              <label htmlFor="source_of_funds">Fuente de fondos *</label>
              <select id="source_of_funds" name="source_of_funds" defaultValue={investor?.source_of_funds || ''} required>
                <option value="">Seleccionar</option>
                <option value="salary">Salario / ingresos profesionales</option>
                <option value="business">Negocio / empresa</option>
                <option value="investments">Inversiones</option>
                <option value="sale_of_assets">Venta de activos</option>
                <option value="inheritance">Herencia</option>
                <option value="other">Otra fuente</option>
              </select>

              <label htmlFor="beneficial_owner_name">Beneficiario final, si corresponde</label>
              <input id="beneficial_owner_name" name="beneficial_owner_name" defaultValue={investor?.beneficial_owner_name || ''} />

              <label htmlFor="beneficial_owner_relationship">Relación con el beneficiario final</label>
              <input id="beneficial_owner_relationship" name="beneficial_owner_relationship" defaultValue={investor?.beneficial_owner_relationship || ''} />

              <button className="btn primary" type="submit">Guardar perfil</button>
            </form>
          </section>

          <section className="section">
            <h2>2. Documentación KYC</h2>
            <div className="card" style={{marginBottom:16}}>
              <p className="muted">Carga documentos en PDF, JPG, PNG o WEBP. Máximo 10 MB por archivo.</p>
              <form className="form" action={uploadKycDocument} encType="multipart/form-data">
                <label htmlFor="upload_document_type">Tipo de documento</label>
                <select id="upload_document_type" name="upload_document_type" required>
                  <option value="identity_document">Documento de identidad / pasaporte</option>
                  <option value="proof_of_address">Comprobante de domicilio</option>
                  <option value="proof_of_funds">Evidencia de fondos</option>
                  <option value="tax_document">Documento fiscal</option>
                  <option value="corporate_document">Documento corporativo</option>
                  <option value="other">Otro</option>
                </select>
                <label htmlFor="file">Archivo</label>
                <input id="file" name="file" type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" required />
                <button className="btn secondary" type="submit">Cargar documento</button>
              </form>
            </div>

            <div className="card">
              <h3>Documentos cargados</h3>
              {!documents?.length ? <p className="muted">Todavía no has cargado documentos.</p> : (
                <table className="table">
                  <thead><tr><th>Documento</th><th>Archivo</th><th>Estado</th><th>Fecha</th></tr></thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td>{doc.document_type}</td>
                        <td>{doc.file_name}</td>
                        <td>{doc.status}</td>
                        <td>{doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('es-DO') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <section className="section">
            <h2>3. Enviar KYC a revisión</h2>
            <div className="card">
              <p className="muted">Al enviar, el estado cambiará a <strong>En revisión</strong>. El equipo de BanQuisqueya podrá revisar tu información y documentos.</p>
              <form action={submitKyc}>
                <input type="hidden" name="full_name" value={profile?.full_name || ''} />
                <input type="hidden" name="phone" value={investor?.phone || ''} />
                <input type="hidden" name="country" value={investor?.country || ''} />
                <input type="hidden" name="nationality" value={investor?.nationality || ''} />
                <input type="hidden" name="date_of_birth" value={investor?.date_of_birth || ''} />
                <input type="hidden" name="address" value={investor?.address || ''} />
                <input type="hidden" name="document_type" value={investor?.document_type || ''} />
                <input type="hidden" name="document_number" value={investor?.document_number || ''} />
                <input type="hidden" name="source_of_funds" value={investor?.source_of_funds || ''} />
                <button className="btn primary" type="submit" disabled={!investor || investor.kyc_status === 'approved'}>Enviar KYC a revisión</button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
