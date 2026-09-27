'use server'

import { createClient } from '@/lib/supabase/server'

export async function registerInvestor(formData: FormData) {
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  if (!name || !email || !password) {
    return { error: 'Todos los campos son obligatorios.' }
  }

  if (password.length < 8) {
    return { error: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: 'Registro creado. Revisa tu correo para confirmar la cuenta.',
  }
}
