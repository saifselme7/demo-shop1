import { supabase } from '../../lib/supabase'

export async function adminGetCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name')
  if (error) throw error
  return data
}

export async function adminCreateCategory(cat: { id: string; name: string; slug: string; description?: string; image_url?: string }) {
  const { data, error } = await supabase.from('categories').insert({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description || null,
    image_url: cat.image_url || null,
  }).select().single()
  if (error) throw error
  return data
}

export async function adminUpdateCategory(id: string, updates: { name?: string; slug?: string; description?: string; image_url?: string }) {
  const { data, error } = await supabase.from('categories').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteCategory(id: string) {
  // Check if products reference this category
  const { data: products, error: checkError } = await supabase.from('products').select('id').eq('category_id', id).limit(1)
  if (checkError) throw checkError
  if (products && products.length > 0) {
    throw new Error('Cannot delete category with existing products. Reassign or delete products first.')
  }
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}
