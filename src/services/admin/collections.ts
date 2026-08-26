import { supabase } from '../../lib/supabase'

export async function adminGetCollections() {
  const { data, error } = await supabase.from('collections').select('*').order('name')
  if (error) throw error
  return data
}

export async function adminCreateCollection(col: { id: string; name: string; slug: string; subtitle?: string; description?: string; image_url?: string; pieces?: number }) {
  const { data, error } = await supabase.from('collections').insert({
    id: col.id,
    name: col.name,
    slug: col.slug,
    subtitle: col.subtitle || null,
    description: col.description || null,
    image_url: col.image_url || null,
    pieces: col.pieces || 0,
  }).select().single()
  if (error) throw error
  return data
}

export async function adminUpdateCollection(id: string, updates: { name?: string; slug?: string; subtitle?: string; description?: string; image_url?: string; pieces?: number }) {
  const { data, error } = await supabase.from('collections').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteCollection(id: string) {
  const { data: products, error: checkError } = await supabase.from('products').select('id').eq('collection_id', id).limit(1)
  if (checkError) throw checkError
  if (products && products.length > 0) {
    throw new Error('Cannot delete collection with existing products. Reassign or delete products first.')
  }
  const { error } = await supabase.from('collections').delete().eq('id', id)
  if (error) throw error
}
