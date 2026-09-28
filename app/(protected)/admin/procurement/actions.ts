'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function ctx(){const supabase=await createClient();const {data:claimsData}=await supabase.auth.getClaims();const userId=claimsData?.claims?.sub as string|undefined;if(!userId)redirect('/login');const {data:p}=await supabase.from('profiles').select('role').eq('id',userId).maybeSingle();return {supabase,userId,role:p?.role as string|undefined}}

export async function createVendor(formData:FormData){
 const {supabase,userId,role}=await ctx();if(!['admin','procurement','vendor_manager'].includes(role||''))redirect('/investor')
 const {error}=await supabase.from('vendors').insert({legal_name:String(formData.get('legal_name')),trade_name:String(formData.get('trade_name')||''),vendor_type:String(formData.get('vendor_type')||'contractor'),tax_id:String(formData.get('tax_id')||''),country:String(formData.get('country')||''),contact_name:String(formData.get('contact_name')||''),email:String(formData.get('email')||''),phone:String(formData.get('phone')||''),created_by:userId})
 if(error)redirect('/admin/procurement/vendors?error='+encodeURIComponent(error.message));revalidatePath('/admin/procurement/vendors');redirect('/admin/procurement/vendors?success=1')
}
export async function createRequest(formData:FormData){
 const {supabase,userId,role}=await ctx();if(!['admin','project_manager','developer','procurement'].includes(role||''))redirect('/investor')
 const projectId=String(formData.get('project_id'));const {error}=await supabase.from('procurement_requests').insert({project_id:projectId,requested_by:userId,category:String(formData.get('category')),description:String(formData.get('description')||''),requested_amount:Number(formData.get('requested_amount')||0),currency:String(formData.get('currency')||'USD'),required_date:String(formData.get('required_date')||'')||null,status:'submitted'})
 if(error)redirect('/admin/procurement?error='+encodeURIComponent(error.message));revalidatePath('/admin/procurement');redirect('/admin/procurement?success=1')
}
export async function updateRequest(formData:FormData){
 const {supabase,userId,role}=await ctx();if(!['admin','procurement','project_manager','finance','accounting'].includes(role||''))redirect('/investor')
 const id=String(formData.get('id'));const status=String(formData.get('status'));if(!['review','quoted','approved','rejected','ordered','received','closed'].includes(status))redirect('/admin/procurement?error=Estado+inválido')
 const {error}=await supabase.from('procurement_requests').update({status,updated_at:new Date().toISOString()}).eq('id',id);if(error)redirect('/admin/procurement?error='+encodeURIComponent(error.message))
 await supabase.from('audit_log').insert({actor_id:userId,action:'procurement_request_'+status,entity_type:'procurement_request',entity_id:id,department_code:'PROCUREMENT',new_data:{status}})
 revalidatePath('/admin/procurement');redirect('/admin/procurement?success=1')
}
