'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isStaffRole } from '@/lib/auth/roles'
async function staff(){const s=await createClient();const{data:c}=await s.auth.getClaims();const uid=c?.claims?.sub as string|undefined;if(!uid)redirect('/login');const{data:p}=await s.from('profiles').select('role').eq('id',uid).maybeSingle();if(!isStaffRole(p?.role))redirect('/admin');return{s,uid}}
export async function refreshMatches(f:FormData){const{s}=await staff();const project_id=String(f.get('project_id'));const{error}=await s.rpc('refresh_capital_project_matches',{p_project_id:project_id});if(error)throw new Error(error.message);revalidatePath('/admin/capital-matching')}
export async function updateMatch(f:FormData){const{s,uid}=await staff();const id=String(f.get('id'));const{error}=await s.from('capital_project_matches').update({status:String(f.get('status')),rationale:String(f.get('rationale')||''),notes:String(f.get('notes')||''),reviewed_by:uid,reviewed_at:new Date().toISOString()}).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/admin/capital-matching')}
