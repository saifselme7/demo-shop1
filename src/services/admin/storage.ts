import { supabase } from '../../lib/supabase'

const BUCKET = 'product-images'
const MAX_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface UploadResult {
  url: string
  path: string
}

function validateFile(file: File) {
  if (!file) throw new Error('No file provided')
  if (file.size === 0) throw new Error('Empty file')
  if (file.size > MAX_SIZE) throw new Error(`File too large — max 5 MB, got ${(file.size / 1024 / 1024).toFixed(2)} MB`)
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type ${file.type} — allowed JPG, PNG, WEBP`)
  }
}

export async function uploadProductImage(productId: string, file: File, index: number): Promise<UploadResult> {
  validateFile(file)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp'
  const safeExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'webp'
  const fileName = `${String(index + 1).padStart(2, '0')}.${safeExt}`
  const path = `products/${productId}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return { url: data.publicUrl, path }
}

export async function deleteProductImageFromStorage(path: string) {
  // path should be like products/p01/01.webp
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}

export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export function extractStoragePathFromUrl(url: string): string | null {
  // Extract path after /product-images/ from public URL
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split(`/product-images/`)
    if (parts.length === 2) return parts[1]
    // Also handle /storage/v1/object/public/product-images/...
    const match = url.match(/\/product-images\/(.+)$/)
    if (match) return match[1]
    return null
  } catch {
    return null
  }
}
