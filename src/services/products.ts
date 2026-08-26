import { supabase } from '../lib/supabase'
import { Product, UIProduct, transformProduct } from './types'

export async function getProducts(): Promise<UIProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Product[]).map(transformProduct)
}

export async function getFeaturedProducts(limit = 8): Promise<UIProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as Product[]).map(transformProduct)
}

export async function getProductBySlug(slug: string): Promise<UIProduct | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('slug', slug)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return transformProduct(data as Product)
}

export async function getProductsByCategory(categorySlug: string): Promise<UIProduct[]> {
  if (categorySlug === 'all') return getProducts()
  if (categorySlug === 'new') {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .eq('is_new', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Product[]).map(transformProduct)
  }

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('category_id', categorySlug)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Product[]).map(transformProduct)
}

export async function getProductsByCollection(collectionSlug: string): Promise<UIProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('collection_id', collectionSlug)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as Product[]).map(transformProduct)
}

export async function getRelatedProducts(slug: string, categorySlug: string, limit = 4): Promise<UIProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      images:product_images(*),
      variants:product_variants(*)
    `)
    .eq('category_id', categorySlug)
    .neq('slug', slug)
    .limit(limit)

  if (error) throw error
  return (data as Product[]).map(transformProduct)
}
