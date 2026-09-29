'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'
async function staff(){const s=await createClient();const {data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const {data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role))redirect('/admin');return{s,uid}}
export async function registerDocument(f:FormData){const{s,uid}=await staff();const project_id=String(f.get('project_id'));const application_id=f.get('application_id')||null;const{data:d,error}=await s.from('project_document_register').insert({project_id,application_id,document_type:String(f.get('document_type')||'other'),title:String(f.get('title')),description:String(f.get('description')||''),status:String(f.get('status')||'required'),due_date:f.get('due_date')||null,confidentiality:String(f.get('confidentiality')||'internal'),created_by:uid}).select('id').single();if(error)throw new Error(error.message);const{error:ve}=await s.from('project_document_register_versions').insert({document_id:d.id,version:1,status:'draft',prepared_by:uid});if(ve)throw new Error(ve.message);revalidatePath('/admin/projects/'+project_id)}
