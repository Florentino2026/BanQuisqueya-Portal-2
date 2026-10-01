'use server'
import {createClient} from '@/lib/supabase/server'
import {redirect} from 'next/navigation'
export async function submitReferral(f:FormData){
 const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined
 if(!uid)redirect('/login')
 const {data:r}=await s.from('referrers').select('id,status').eq('user_id',uid).maybeSingle()
 if(!r||r.status!=='approved')throw new Error('El referidor debe estar aprobado.')
 const {error}=await s.from('project_referrals').insert({referrer_id:r.id,project_name:String(f.get('project_name')||''),sponsor_name:String(f.get('sponsor_name')||''),country:String(f.get('country')||''),sector:String(f.get('sector')||''),description:String(f.get('description')||''),requested_amount:Number(f.get('requested_amount')||0)||null,currency:String(f.get('currency')||'USD')})
 if(error)throw new Error(error.message)
 redirect('/referidor')
}