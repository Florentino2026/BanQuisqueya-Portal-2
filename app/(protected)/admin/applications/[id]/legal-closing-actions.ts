'use server'
import {revalidatePath} from 'next/cache'
import {redirect} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {isStaffRole} from '@/lib/auth/roles'
async function staff(){const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const{data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role)||!['admin','legal','contract_manager','executive','cfo'].includes(p.role))redirect('/admin');return{s,uid}}
export async function initializeLegalClosing(f:FormData){const{s}=await staff();const application_id=String(f.get('application_id'));const{error}=await s.rpc('initialize_legal_closing_requirements',{p_application_id:application_id});if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+application_id)}
export async function updateLegalRequirement(f:FormData){const{s}=await staff();const id=String(f.get('id'));const status=String(f.get('status'));if(!['pending','sent','signed','waived','complete'].includes(status))throw new Error('Invalid legal status');const{error}=await s.from('legal_closing_requirements').update({status,notes:String(f.get('notes')||'')||null}).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/admin/applications/'+String(f.get('application_id')))}
