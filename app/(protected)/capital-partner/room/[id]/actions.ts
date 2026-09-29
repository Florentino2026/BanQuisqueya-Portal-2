'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
export async function acknowledgeConfidentiality(f:FormData){
 const s=await createClient();const{data:u}=await s.auth.getUser();if(!u.user)throw new Error('Authentication required')
 const room_id=String(f.get('room_id')||'');const{data:p}=await s.from('capital_partner_profiles').select('id,portal_status,onboarding_status').eq('user_id',u.user.id).maybeSingle()
 if(!p||p.portal_status!=='active'||p.onboarding_status!=='approved')throw new Error('Partner access not approved')
 const{data:a}=await s.from('capital_partner_room_access').select('status').eq('room_id',room_id).eq('partner_id',p.id).maybeSingle()
 if(!a||a.status!=='active')throw new Error('Active room access required')
 const{error}=await s.from('capital_partner_confidentiality_acknowledgments').upsert({room_id,partner_id:p.id,user_id:u.user.id,acknowledgment_type:'room_confidentiality',statement_version:'1.0'},{onConflict:'room_id,partner_id,acknowledgment_type,statement_version'})
 if(error)throw new Error(error.message)
 await s.from('capital_partner_room_activity').insert({room_id,partner_id:p.id,activity_type:'nda_acknowledged',subject:'Room confidentiality acknowledged',message:'Confidentiality terms acknowledged electronically.'})
 revalidatePath('/capital-partner/room/'+room_id)
}

export async function roomAction(f:FormData){
 const s=await createClient();const{data:u}=await s.auth.getUser();if(!u.user)throw new Error('Authentication required')
 const room_id=String(f.get('room_id')||'');const activity_type=String(f.get('activity_type')||'');const document_id=String(f.get('document_id')||'')||null
 const{data:p}=await s.from('capital_partner_profiles').select('id,portal_status,onboarding_status').eq('user_id',u.user.id).maybeSingle()
 if(!p||p.portal_status!=='active'||p.onboarding_status!=='approved')throw new Error('Partner access not approved')
 const{data:a}=await s.from('capital_partner_room_access').select('status').eq('partner_id',p.id).eq('room_id',room_id).maybeSingle()
 if(!a||!['active','invited'].includes(a.status))throw new Error('Room access denied')
 if(!['interest_registered','information_requested','nda_acknowledged','message_sent','document_viewed'].includes(activity_type))throw new Error('Invalid activity')
 const{error}=await s.from('capital_partner_room_activity').insert({room_id,partner_id:p.id,activity_type,document_id,subject:String(f.get('subject')||'')||null,message:String(f.get('message')||'')||null})\n if(activity_type==='document_viewed' && document_id){await s.from('capital_room_document_events').insert({room_id,document_id,partner_id:p.id,user_id:u.user.id,event_type:'viewed'})}\n if(activity_type==='information_requested'||activity_type==='message_sent'){await s.from('capital_partner_communications').insert({room_id,partner_id:p.id,activity_id:null,direction:'inbound',communication_type:activity_type==='information_requested'?'information_request':'message',subject:String(f.get('subject')||'Information request'),message:String(f.get('message')||'').trim(),status:'open',created_by:u.user.id})}
 if(error)throw new Error(error.message)
 revalidatePath('/capital-partner/room/'+room_id)
}
