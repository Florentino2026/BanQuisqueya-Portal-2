import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { reviewCubicacion, prepareDisbursement, processDisbursement } from '../actions'

const labels:Record<string,string>={submitted:'Enviada',under_review:'En revisión',approved:'Aprobada',rejected:'Rechazada',ready_for_payment:'Lista para pago',accounting_review:'En Contabilidad',payment_approved:'Pago aprobado',paid:'Pagada',cancelled:'Cancelada'}

export default async function CubicacionDetail({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string;success?:string}>}){
 const {id}=await params; const q=await searchParams
 const supabase=await createClient()
 const {data:claimsData}=await supabase.auth.getClaims()
 const userId=claimsData?.claims?.sub as string|undefined
 if(!userId)redirect('/login')
 const {data:profile}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle()
 if(!profile?.role||profile.role==='member')redirect('/investor')
 const {data:c}=await supabase.from('project_cubicaciones').select('*').eq('id',id).maybeSingle()
 if(!c)redirect('/admin/cubicaciones?error=Cubicación+no+encontrada')
 const {data:project}=await supabase.from('projects').select('name').eq('id',c.project_id).maybeSingle()
 const {data:d}=await supabase.from('project_disbursements').select('*').eq('cubicacion_id',id).maybeSingle()
 const supervisor=['admin','supervisor'].includes(profile.role)
 const accounting=['admin','accounting','finance','cfo','treasury'].includes(profile.role)
 return <div className="dashboard"><div className="container"><Link href="/admin/cubicaciones" className="muted">← Volver a cubicaciones</Link><div className="card" style={{marginTop:16}}><div className="muted">{project?.name}</div><h1>{c.cubicacion_number}</h1><div className="grid"><div><strong>Período</strong><p>{c.period_start} → {c.period_end}</p></div><div><strong>Avance</strong><p>{Number(c.current_progress_pct).toFixed(2)}% (+{Number(c.progress_increment_pct).toFixed(2)}%)</p></div><div><strong>Bruto</strong><p>{c.currency} {Number(c.gross_amount).toLocaleString()}</p></div><div><strong>Neto</strong><p>{c.currency} {Number(c.net_amount).toLocaleString()}</p></div><div><strong>Estado</strong><p>{labels[c.status]||c.status}</p></div></div><hr/><h2>Trabajos realizados</h2><p>{c.work_description||'Sin descripción.'}</p></div>
 {q.error&&<div className="card" style={{marginTop:16}}>Error: {q.error}</div>}{q.success&&<div className="card" style={{marginTop:16}}>Operación completada correctamente.</div>}
 {supervisor&&['submitted','under_review','rejected'].includes(c.status)&&<div className="card" style={{marginTop:16}}><h2>Revisión del Supervisor</h2><form action={reviewCubicacion}><input type="hidden" name="id" value={c.id}/><textarea name="review_notes" rows={4} placeholder="Observaciones técnicas" style={{width:'100%',marginBottom:10}}/><div style={{display:'flex',gap:10}}><button className="button" name="decision" value="approved">Aprobar cubicación</button><button className="button secondary" name="decision" value="rejected">Rechazar</button></div></form></div>}
 {accounting&&['approved','ready_for_payment'].includes(c.status)&&!d&&<div className="card" style={{marginTop:16}}><h2>Contabilidad / Finanzas</h2><p>El Supervisor ha certificado el avance. El monto neto a preparar es <strong>{c.currency} {Number(c.net_amount).toLocaleString()}</strong>.</p><form action={prepareDisbursement}><input type="hidden" name="cubicacion_id" value={c.id}/><textarea name="notes" rows={3} placeholder="Notas contables"/><br/><button className="button" type="submit">Preparar desembolso</button></form></div>}
 {d&&<div className="card" style={{marginTop:16}}><h2>Desembolso</h2><p><strong>Estado:</strong> {d.status}</p><p><strong>Monto:</strong> {d.currency} {Number(d.amount).toLocaleString()}</p>{accounting&&['pending_accounting'].includes(d.status)&&<form action={processDisbursement} style={{marginTop:12}}><input type="hidden" name="id" value={d.id}/><input name="payment_reference" placeholder="Referencia bancaria / comprobante"/><input name="payment_method" placeholder="Método de pago" style={{marginTop:8}}/><textarea name="notes" rows={3} placeholder="Notas" style={{marginTop:8,width:'100%'}}/><div style={{display:'flex',gap:10,marginTop:10}}><button className="button" name="status" value="approved">Aprobar pago</button><button className="button secondary" name="status" value="rejected">Rechazar</button></div></form>}{['approved'].includes(d.status)&&['admin','treasury','accounting','cfo'].includes(profile.role)&&<form action={processDisbursement} style={{marginTop:12}}><input type="hidden" name="id" value={d.id}/><input name="payment_reference" placeholder="Referencia de transferencia" required/><input name="payment_method" placeholder="ACH / Wire / Transferencia" style={{marginTop:8}} required/><button className="button" name="status" value="paid" style={{marginTop:10}}>Registrar pago ejecutado</button></form>}</div>}
 </div></div>
}
