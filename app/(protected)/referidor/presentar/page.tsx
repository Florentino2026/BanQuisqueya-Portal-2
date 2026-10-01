import {createClient} from '@/lib/supabase/server'
import {redirect} from 'next/navigation'
import {submitReferral} from './actions'
export default async function PresentReferral(){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined
 if(!uid)redirect('/login')
 const {data:r}=await s.from('referrers').select('id,status').eq('user_id',uid).maybeSingle()
 if(!r)redirect('/referidor/registro');if(r.status!=='approved')redirect('/referidor')
 return <main className="dashboard-wide"><div className="dashboard-heading"><div><div className="eyebrow">REFERRER NETWORK</div><h1>Presentar proyecto</h1><p className="muted">La oportunidad será recibida por BanQuisqueya & Trust para pre-screening y due diligence.</p></div></div><section className="panel"><form action={submitReferral} className="form"><label>Nombre del proyecto<input name="project_name" required/></label><label>Empresa / Sponsor<input name="sponsor_name"/></label><div className="grid"><label>País<input name="country" required/></label><label>Sector<input name="sector"/></label><label>Monto solicitado<input name="requested_amount" type="number" min="0" step="0.01"/></label><label>Moneda<select name="currency"><option>USD</option><option>EUR</option><option>DOP</option></select></label></div><label>Descripción del proyecto<textarea name="description" required/></label><p className="muted">La comisión aplicable no se determina automáticamente como promesa de pago. Quedará sujeta a aprobación, contrato y revisión regulatoria.</p><button className="btn primary">Enviar referencia</button></form></section></main>
}