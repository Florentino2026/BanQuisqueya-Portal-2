import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req:Request,{params}:{params:Promise<{id:string,documentId:string}>}){
 const {id,documentId}=await params
 const s=await createClient()
 const {data:{user}}=await s.auth.getUser()
 if(!user)return new NextResponse('Unauthorized',{status:401})
 const {data:p}=await s.from('capital_partner_profiles').select('id,portal_status,onboarding_status').eq('user_id',user.id).maybeSingle()
 if(!p||p.portal_status!=='active'||p.onboarding_status!=='approved')return new NextResponse('Forbidden',{status:403})
 const {data:a}=await s.from('capital_partner_room_access').select('status').eq('room_id',id).eq('partner_id',p.id).maybeSingle()
 if(!a||a.status!=='active')return new NextResponse('Forbidden',{status:403})
 const {data:d}=await s.from('capital_room_documents').select('id,title,status,storage_path').eq('id',documentId).eq('room_id',id).in('status',['approved','shared','published']).maybeSingle()
 if(!d?.storage_path)return new NextResponse('Document unavailable',{status:404})
 const path=d.storage_path.replace(/^project-documents\//,'')
 const {data:signed,error}=await s.storage.from('project-documents').createSignedUrl(path,300)
 if(error||!signed?.signedUrl)return new NextResponse('Unable to create secure document link',{status:500})
 await s.from('capital_room_document_events').insert({room_id:id,document_id:documentId,partner_id:p.id,user_id:user.id,event_type:'downloaded',metadata:{delivery:'signed_url',expires_in_seconds:300}})
 await s.from('capital_partner_room_activity').insert({room_id:id,partner_id:p.id,activity_type:'document_viewed',document_id:documentId,subject:d.title,message:'Document accessed through secure signed URL.'})
 return NextResponse.redirect(signed.signedUrl)
}
