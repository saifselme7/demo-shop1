import { supabase } from '../lib/supabase'

const BUCKET = 'payment-proofs'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
export const ALLOWED_PAYMENT_PROOF_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const PAYMENT_PROOF_MAX_SIZE = MAX_SIZE

export interface PaymentProofUpload {
  path: string
}

export function validatePaymentProofFile(file: File) {
  if (!file) throw new Error('Please choose a payment screenshot first.')
  if (file.size === 0) throw new Error('The selected file is empty.')
  if (file.size > MAX_SIZE) {
    throw new Error(`Screenshot too large — maximum 5 MB, yours is ${(file.size / 1024 / 1024).toFixed(2)} MB.`)
  }
  if (!ALLOWED_PAYMENT_PROOF_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type — please upload a JPG, JPEG, PNG or WEBP screenshot.')
  }
}

/**
 * Uploads a payment proof screenshot to the PRIVATE `payment-proofs` bucket.
 * The returned path is stored on the order (payment_proof_path / payment_proof_url).
 * Files are not publicly browsable — admins view them through signed URLs.
 */
export async function uploadPaymentProof(file: File): Promise<PaymentProofUpload> {
  validatePaymentProofFile(file)

  const extFromName = file.name.split('.').pop()?.toLowerCase() || ''
  const ext = ['jpg', 'jpeg', 'png', 'webp'].includes(extFromName) ? extFromName : file.type.includes('png') ? 'png' : 'jpg'

  const nonce =
    (globalThis.crypto && 'randomUUID' in globalThis.crypto
      ? globalThis.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)) + Date.now().toString(36)
  const path = `proofs/${nonce}.${ext}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })

  if (uploadError) throw uploadError

  return { path }
}

/**
 * Generates a short-lived signed URL for a payment proof.
 * Admin-only — the storage RLS only permits is_admin() reads.
 */
export async function getPaymentProofSignedUrl(path: string, expiresInSeconds = 60 * 10): Promise<string> {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, expiresInSeconds)

  if (error) throw error
  return data.signedUrl
}
