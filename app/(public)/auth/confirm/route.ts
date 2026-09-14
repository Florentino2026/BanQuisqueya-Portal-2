import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
export async function GET(request:Request){const url=new URL(request.url);const token_hash=url.searchParams.get('token_hash');const type=url.searchParams.get('type') as 'email'|'recovery'|'invite'|'email_change'|null;if(token_hash&&type){const supabase=await createClient();const {error}=await supabase.auth.verifyOtp({type,token_hash});if(!error)return NextResponse.redirect(new URL('/investor',url))}return NextResponse.redirect(new URL('/login?error=confirmation',url))}
