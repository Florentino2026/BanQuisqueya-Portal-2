'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function text(formData: FormData, key: string) {
  return String(formData.get(key) || '').trim()
}

async function getAuthenticatedInvestor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: investor } = await supabase
    .from('investors')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  return { supabase, user, investor }
}

export async function saveProfile(formData: FormData) {
  const { supabase, user } = await getAuthenticatedInvestor()

  const fullName = text(formData, 'full_name')
  const phone = text(formData, 'phone')
  const country = text(formData, 'country')
  const nationality = text(formData, 'nationality')
  const dateOfBirth = text(formData, 'date_of_birth')
  const address = text(formData, 'address')
  const city = text(formData, 'city')
  const stateProvince = text(formData, 'state_province')
  const postalCode = text(formData, 'postal_code')
  const investorType = text(formData, 'investor_type') || 'individual'
  const riskProfile = text(formData, 'risk_profile') || null
  const documentType = text(formData, 'document_type')
  const documentNumber = text(formData, 'document_number')
  const sourceOfFunds = text(formData, 'source_of_funds')
  const beneficialOwnerName = text(formData, 'beneficial_owner_name')
  const beneficialOwnerRelationship = text(formData, 'beneficial_owner_relationship')

  if (!fullName || !phone || !country || !nationality || !dateOfBirth || !address || !documentType || !documentNumber || !sourceOfFunds) {
    redirect('/investor/profile?error=required')
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: user.id, full_name: fullName }, { onConflict: 'id' })

  if (profileError) {
    redirect('/investor/profile?error=save')
  }

  const { error: investorError } = await supabase
    .from('investors')
    .upsert({
      user_id: user.id,
      investor_type: investorType,
      phone,
      country,
      nationality,
      date_of_birth: dateOfBirth,
      address,
      city: city || null,
      state_province: stateProvince || null,
      postal_code: postalCode || null,
      risk_profile: riskProfile,
      document_type: documentType,
      document_number: documentNumber,
      source_of_funds: sourceOfFunds,
      beneficial_owner_name: beneficialOwnerName || null,
      beneficial_owner_relationship: beneficialOwnerRelationship || null,
    }, { onConflict: 'user_id' })

  if (investorError) {
    redirect('/investor/profile?error=save')
  }

  revalidatePath('/investor')
  revalidatePath('/investor/profile')
  redirect('/investor/profile?saved=1')
}

export async function submitKyc(formData: FormData) {
  const { supabase, user, investor } = await getAuthenticatedInvestor()
  if (!investor) redirect('/investor/profile?error=profile')

  const requiredFields = [
    'full_name', 'phone', 'country', 'nationality', 'date_of_birth',
    'address', 'document_type', 'document_number', 'source_of_funds'
  ]

  for (const field of requiredFields) {
    if (!text(formData, field)) redirect('/investor/profile?error=required')
  }

  const { count } = await supabase
    .from('documents')
    .select('id', { count: 'exact', head: true })
    .eq('investor_id', investor.id)

  if (!count) {
    redirect('/investor/profile?error=document')
  }

  const { error } = await supabase
    .from('investors')
    .update({
      kyc_status: 'in_review',
      kyc_submitted_at: new Date().toISOString(),
    })
    .eq('id', investor.id)
    .eq('user_id', user.id)

  if (error) redirect('/investor/profile?error=submit')

  revalidatePath('/investor')
  revalidatePath('/investor/profile')
  redirect('/investor/profile?submitted=1')
}

export async function uploadKycDocument(formData: FormData) {
  const { supabase, user, investor } = await getAuthenticatedInvestor()
  if (!investor) redirect('/investor/profile?error=profile')

  const documentType = text(formData, 'upload_document_type')
  const file = formData.get('file')

  if (!documentType || !(file instanceof File) || file.size === 0) {
    redirect('/investor/profile?error=file')
  }

  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type) || file.size > 10 * 1024 * 1024) {
    redirect('/investor/profile?error=file')
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${user.id}/${crypto.randomUUID()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('investor-kyc')
    .upload(path, file, {
      contentType: file.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) {
    redirect('/investor/profile?error=upload')
  }

  const { error: recordError } = await supabase
    .from('documents')
    .insert({
      investor_id: investor.id,
      document_type: documentType,
      file_name: file.name,
      storage_path: path,
      status: 'submitted',
    })

  if (recordError) {
    await supabase.storage.from('investor-kyc').remove([path])
    redirect('/investor/profile?error=save_document')
  }

  revalidatePath('/investor/profile')
  redirect('/investor/profile?uploaded=1')
}
