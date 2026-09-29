'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function staff(){
 const s=await createClient(); const {data:c}=await s.auth.getClaims(); const uid=c?.claims?.sub as string|undefined
 const {data:p}=await s.from('profiles').select('role').eq('id',uid||'').maybeSingle()
 if(!p?.role || !['admin','hr','operations_manager','executive'].includes(p.role)) redirect('/admin')
 return s
}
export async function createVacancy(formData:FormData){
 const s=await staff()
 await s.from('job_vacancies').insert({title:String(formData.get('title')),department:String(formData.get('department')),location:String(formData.get('location')||''),employment_type:String(formData.get('employment_type')||''),description:String(formData.get('description')||''),requirements:String(formData.get('requirements')||''),status:'open',closing_date:formData.get('closing_date')||null})
 revalidatePath('/admin/careers');revalidatePath('/careers')
}
export async function closeVacancy(formData:FormData){
 const s=await staff(); await s.from('job_vacancies').update({status:'closed'}).eq('id',String(formData.get('id')))
 revalidatePath('/admin/careers');revalidatePath('/careers')
}
export async function updateApplication(formData:FormData){
 const s=await staff(); await s.from('job_applications').update({status:String(formData.get('status')),internal_notes:String(formData.get('internal_notes')||'')}).eq('id',String(formData.get('id')))
 revalidatePath('/admin/careers')
}
export async function getCvUrl(path:string){
 const s=await staff(); const {data,error}=await s.storage.from('career-cv').createSignedUrl(path,600)
 if(error) return null
 return data.signedUrl
}
