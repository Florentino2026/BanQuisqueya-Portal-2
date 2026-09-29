'use server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function acceptClosingDocument(f:FormData){
 const application_id=String(f.get('application_id'))
 const delivery_id=String(f.get('delivery_id'))
 const s=await createClient()
 const {data:{user}}=await s.auth.getUser()
 if(!user)redirect('/login')
 const {data:client}=await s.from('clients').select('id').eq('user_id',user.id).maybeSingle()
 if(!client)redirect('/investor')
 const {data:d}=await s.from('project_document_deliveries').select('id,application_id,client_id,document_version_id,status,requires_acceptance').eq('id',delivery_id).eq('application_id',application_id).eq('client_id',client.id).maybeSingle()
 if(!d)throw new Error('Documento no encontrado.')
 if(d.status==='accepted')return
 if(!d.requires_acceptance)throw new Error('Este documento no requiere aceptación.')
 const h=await headers()
 const userAgent=h.get('user-agent')
 const forwarded=h.get('x-forwarded-for')
 const ip=forwarded?.split(',')[0]?.trim()||null
 const {error:ae}=await s.from('document_acceptances').insert({application_id,client_id:client.id,document_version_id:d.document_version_id,accepted:true,accepted_at:new Date().toISOString(),ip_address:ip,user_agent:userAgent})
 if(ae)throw new Error(ae.message)
 const {error:de}=await s.from('project_document_deliveries').update({status:'accepted',accepted_at:new Date().toISOString(),accepted_by:user.id}).eq('id',delivery_id).eq('client_id',client.id)
 if(de)throw new Error(de.message)
 revalidatePath('/client/applications/'+application_id)
}

export async function markClosingDocumentViewed(f:FormData){
 const application_id=String(f.get('application_id'))
 const delivery_id=String(f.get('delivery_id'))
 const s=await createClient()
 const {data:{user}}=await s.auth.getUser()
 if(!user)redirect('/login')
 const {data:client}=await s.from('clients').select('id').eq('user_id',user.id).maybeSingle()
 if(!client)redirect('/investor')
 await s.from('project_document_deliveries').update({status:'viewed',viewed_at:new Date().toISOString()}).eq('id',delivery_id).eq('application_id',application_id).eq('client_id',client.id).in('status',['sent','ready'])
 revalidatePath('/client/applications/'+application_id)
}
