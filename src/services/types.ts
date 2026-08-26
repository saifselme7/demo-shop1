export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  subtitle: string | null
  description: string | null
  image_url: string | null
  pieces: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  slug: string
  name: string
  subtitle: string | null
  description: string | null
  price: number
  compare_at_price: number | null
  currency: string
  category_id: string | null
  collection_id: string | null
  featured: boolean
  is_new: boolean
  details: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  created_at: string
  updated_at: string
  // Joined
  images?: ProductImage[]
  variants?: ProductVariant[]
  category?: Category | null
  collection?: Collection | null
}

export interface ProductImage {
  id: string
  product_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  size: string
  sku: string
  stock: number
  created_at: string
  updated_at: string
}

// UI-friendly transformed product (compatible with old frontend)
export interface UIProduct {
  id: string
  slug: string
  name: string
  subtitle: string
  price: number
  currency: string
  category: string
  collection: string
  description: string
  details: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  images: string[]
  featured?: boolean
  isNew?: boolean
  compareAtPrice?: number | null
  stock?: number
  variants?: ProductVariant[]
}

export function transformProduct(p: Product): UIProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle || '',
    price: Number(p.price),
    currency: p.currency || '€',
    category: p.category_id || 'all',
    collection: p.collection_id || 'aw-reserve',
    description: p.description || '',
    details: p.details || [],
    sizes: p.sizes || [],
    colors: p.colors || [],
    images: (p.images || []).sort((a, b) => a.sort_order - b.sort_order).map((img) => img.image_url),
    featured: p.featured,
    isNew: p.is_new,
    compareAtPrice: p.compare_at_price ? Number(p.compare_at_price) : null,
    variants: p.variants,
  }
}
