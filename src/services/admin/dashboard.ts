import { supabase } from '../../lib/supabase'

export async function getDashboardStats() {
  const [productsRes, categoriesRes, collectionsRes, variantsRes, lowStockRes, outOfStockRes] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('collections').select('id', { count: 'exact', head: true }),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).lt('stock', 5).gt('stock', 0),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).eq('stock', 0),
  ])

  return {
    products: productsRes.count || 0,
    categories: categoriesRes.count || 0,
    collections: collectionsRes.count || 0,
    variants: variantsRes.count || 0,
    lowStock: lowStockRes.count || 0,
    outOfStock: outOfStockRes.count || 0,
  }
}
