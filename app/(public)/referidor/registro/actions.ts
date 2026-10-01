'use server'

import { createClient } from '@/lib/supabase/server'

export async function registerReferrer(formData: FormData) {
  const fullName=String(formData.get('full_name')||'').trim()
  const email=String(formData.get('email')||'').trim().toLowerCase()
  const password=String(formData.get('password')||'')
  const phone=String(formData.get('phone')||'').trim()
  const country=String(formData.get('country')||'').trim()
  if(!fullName||!email||!password||!phone||!country)return {error:'Completa todos los campos obligatorios.'}
  if(password.length<8)return {error:'La contraseña debe tener al menos 8 caracteres.'}
  const supabase=await createClient()
  const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName,account_type:'referrer',phone,country}}})
  if(error)return {error:error.message}
  return {success:'Registro creado. Revisa tu correo para confirmar la cuenta. Tu acceso al portal quedará pendiente de aprobación.'}
}