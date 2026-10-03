'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function uploadReferrerDocument(formData:FormData){
 const s=await createClient(); const {data:c}=await s.auth.getClaims(); const uid=c?.claims?.sub as string|undefined
 if(!uid) redirect('/login')
 const {data:r}=await s.from('referrers').select('id').eq('user_id',uid).maybeSingle()
 if(!r) redirect('/referidor/registro')
 const type=String(formData.get('document_type')||'other')
 const file=formData.get('file')
 if(!(file instanceof File)||file.size===0) throw new Error('Selecciona un archivo.')
 if(file.size>10*1024*1024) throw new Error('El archivo supera el límite de 10 MB.')
 const allowed=['application/pdf','image/jpeg','image/png','image/webp']
 if(!allowed.includes(file.type)) throw new Error('Formato no permitido.')
 const safe=file.name.replace(/[^a-zA-Z0-9._-]/g,'_')
 const path=uid+'/'+type+'/'+Date.now()+'-'+safe
 const {error:uploadError}=await s.storage.from('referrer-kyc').upload(path,file,{contentType:file.type,upsert:false})
 if(uploadError) throw new Error(uploadError.message)
 const {error}=await s.from('referrer_documents').insert({referrer_id:r.id,document_type:type,file_name:file.name,storage_path:path})
 if(error) throw new Error(error.message)
 redirect('/referidor/kyc')
}

export async function savePaymentAccount(formData:FormData){
 const s=await createClient(); const {data:c}=await s.auth.getClaims(); const uid=c?.claims?.sub as string|undefined
 if(!uid) redirect('/login')
 const {data:r}=await s.from('referrers').select('id').eq('user_id',uid).maybeSingle()
 if(!r) redirect('/referidor/registro')
 const payload={referrer_id:r.id,account_holder_name:String(formData.get('account_holder_name')||'').trim(),bank_name:String(formData.get('bank_name')||'').trim(),bank_country:String(formData.get('bank_country')||'').trim(),account_number_last4:String(formData.get('account_number_last4')||'').trim()||null,iban:String(formData.get('iban')||'').trim()||null,swift_bic:String(formData.get('swift_bic')||'').trim()||null,routing_number:String(formData.get('routing_number')||'').trim()||null,currency:String(formData.get('currency')||'USD')}
 if(!payload.account_holder_name||!payload.bank_name||!payload.bank_country) throw new Error('Completa los datos bancarios obligatorios.')
 const {error}=await s.from('referrer_payment_accounts').insert(payload)
 if(error) throw new Error(error.message)
 redirect('/referidor/kyc')
}
