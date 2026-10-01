'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isLocale, type Locale } from '@/lib/i18n'

export async function setLocale(formData: FormData): Promise<void> {
  const value = String(formData.get('locale') || '')
  const path = String(formData.get('path') || '/')
  const locale: Locale = isLocale(value) ? value : 'es'
  const store = await cookies()
  store.set('bqt_locale', locale, { path:'/', maxAge:60*60*24*365, sameSite:'lax' })
  redirect(path.startsWith('/') ? path : '/')
}
