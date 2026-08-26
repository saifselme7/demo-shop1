import { supabase } from '../../lib/supabase'
import { Product } from '../types'

export async function adminGetProducts() {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function adminGetProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function adminCreateProduct(product: {
  id: string
  slug: string
  name: string
  subtitle?: string
  description?: string
  price: number
  compare_at_price?: number | null
  currency?: string
  category_id?: string | null
  collection_id?: string | null
  featured?: boolean
  is_new?: boolean
  details?: string[]
  sizes?: string[]
  colors?: { name: string; hex: string }[]
}) {
  const { data, error } = await supabase
    .from('products')
    .insert({
      id: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle || null,
      description: product.description || null,
      price: product.price,
      compare_at_price: product.compare_at_price || null,
      currency: product.currency || '€',
      category_id: product.category_id || null,
      collection_id: product.collection_id || null,
      featured: product.featured || false,
      is_new: product.is_new || false,
      details: product.details || [],
      sizes: product.sizes || [],
      colors: product.colors || [],
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateProduct(id: string, updates: Partial<Product> & { details?: string[]; sizes?: string[]; colors?: { name: string; hex: string }[] }) {
  const { data, error } = await supabase
    .from('products')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminDeleteProduct(id: string) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// Images
export async function adminAddProductImage(product_id: string, image_url: string, alt_text?: string, sort_order = 0) {
  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id, image_url, alt_text: alt_text || null, sort_order })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function adminUpdateProductImage(id: string, updates: { image_url?: string; alt_text?: string; sort_order?: number }) {
  const { data, error } = await supabase.from('product_images').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteProductImage(id: string) {
  const { error } = await supabase.from('product_images').delete().eq('id', id)
  if (error) throw error
}

export async function adminSetProductImages(product_id: string, images: { image_url: string; alt_text?: string; sort_order: number }[]) {
  // Delete existing and insert new (simpler for now)
  const { error: delError } = await supabase.from('product_images').delete().eq('product_id', product_id)
  if (delError) throw delError

  if (images.length === 0) return []

  const { data, error } = await supabase
    .from('product_images')
    .insert(images.map((img) => ({ product_id, image_url: img.image_url, alt_text: img.alt_text || null, sort_order: img.sort_order })))
    .select()

  if (error) throw error
  return data
}

// Variants
export async function adminAddVariant(variant: {
  product_id: string
  color_name: string
  color_hex: string
  size: string
  sku: string
  stock: number
}) {
  const { data, error } = await supabase.from('product_variants').insert(variant).select().single()
  if (error) throw error
  return data
}

export async function adminUpdateVariant(id: string, updates: Partial<{ color_name: string; color_hex: string; size: string; sku: string; stock: number }>) {
  const { data, error } = await supabase.from('product_variants').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteVariant(id: string) {
  const { error } = await supabase.from('product_variants').delete().eq('id', id)
  if (error) throw error
}

export async function adminSetProductVariants(product_id: string, variants: { color_name: string; color_hex: string; size: string; sku: string; stock: number }[]) {
  const { error: delError } = await supabase.from('product_variants').delete().eq('product_id', product_id)
  if (delError) throw delError

  if (variants.length === 0) return []

  const { data, error } = await supabase.from('product_variants').insert(variants.map((v) => ({ product_id, ...v }))).select()
  if (error) throw error
  return data
}
