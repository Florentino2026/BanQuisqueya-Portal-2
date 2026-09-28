'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { canReviewKyc } from '@/lib/auth/roles'

async function requireKycReviewer() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  const userId = claimsData?.claims?.sub as string | undefined

  if (!userId) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle()

  if (!canReviewKyc(profile?.role)) redirect('/investor')

  return { supabase, userId }
}

export async function reviewKyc(formData: FormData) {
  const { supabase, userId } = await requireKycReviewer()

  const investorId = String(formData.get('investor_id') || '')
  const decision = String(formData.get('decision') || '')
  const notes = String(formData.get('notes') || '').trim()

  if (!investorId || !['approved', 'rejected', 'request_changes'].includes(decision)) {
    redirect('/admin/investors?error=Datos+de+revision+invalidos')
  }

  if (decision === 'rejected' && !notes) {
    redirect(`/admin/investors/${investorId}?error=Debe+indicar+el+motivo+del+rechazo`)
  }

  const newStatus =
    decision === 'approved' ? 'approved' :
    decision === 'rejected' ? 'rejected' :
    'pending'

  const { data: investor, error: investorError } = await supabase
    .from('investors')
    .select('id,user_id')
    .eq('id', investorId)
    .maybeSingle()

  if (investorError || !investor) {
    redirect(`/admin/investors/${investorId}?error=Inversionista+no+encontrado`)
  }

  const { error: reviewError } = await supabase
    .from('kyc_reviews')
    .insert({
      investor_id: investorId,
      reviewer_id: userId,
      decision,
      notes: notes || null,
    })

  if (reviewError) {
    redirect(`/admin/investors/${investorId}?error=${encodeURIComponent(reviewError.message)}`)
  }

  const { error: updateError } = await supabase
    .from('investors')
    .update({
      kyc_status: newStatus,
      status: decision === 'approved' ? 'active' : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq('id', investorId)

  if (updateError) {
    redirect(`/admin/investors/${investorId}?error=${encodeURIComponent(updateError.message)}`)
  }

  const title =
    decision === 'approved' ? 'KYC aprobado' :
    decision === 'rejected' ? 'KYC rechazado' :
    'KYC requiere cambios'

  const message =
    decision === 'approved'
      ? 'Su expediente KYC ha sido aprobado. Ya puede continuar con el proceso de inversión.'
      : decision === 'rejected'
        ? `Su expediente KYC no fue aprobado. Revise las observaciones en el portal.${notes ? ` Motivo: ${notes}` : ''}`
        : `Su expediente KYC requiere información o documentos adicionales.${notes ? ` Observaciones: ${notes}` : ''}`

  await supabase.from('notifications').insert({
    user_id: investor.user_id,
    title,
    message,
  })

  revalidatePath('/admin')
  revalidatePath('/admin/investors')
  revalidatePath(`/admin/investors/${investorId}`)
  revalidatePath('/investor/profile')
  redirect(`/admin/investors/${investorId}?success=${decision}`)
}

export async function updateDocumentReview(formData: FormData) {
  const { supabase, userId } = await requireAdmin()

  const documentId = String(formData.get('document_id') || '')
  const investorId = String(formData.get('investor_id') || '')
  const status = String(formData.get('status') || '')
  const notes = String(formData.get('notes') || '').trim()

  if (!documentId || !investorId || !['approved', 'rejected', 'submitted'].includes(status)) {
    redirect(`/admin/investors/${investorId}?error=Datos+del+documento+invalidos`)
  }

  const { error } = await supabase
    .from('documents')
    .update({ status })
    .eq('id', documentId)
    .eq('investor_id', investorId)

  if (error) {
    redirect(`/admin/investors/${investorId}?error=${encodeURIComponent(error.message)}`)
  }

  if (notes) {
    await supabase.from('kyc_reviews').insert({
      investor_id: investorId,
      reviewer_id: userId,
      decision: 'request_changes',
      notes: `Documento: ${notes}`,
    })
  }

  revalidatePath(`/admin/investors/${investorId}`)
  revalidatePath('/admin/investors')
  redirect(`/admin/investors/${investorId}?success=documento`)
}
