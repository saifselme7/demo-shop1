import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminGetProductById, adminCreateProduct, adminUpdateProduct, adminSetProductImages, adminSetProductVariants } from '../../services/admin/products'
import { getCategories } from '../../services/categories'
import { getCollections } from '../../services/collections'

interface FormState {
  id: string
  slug: string
  name: string
  subtitle: string
  description: string
  price: string
  compare_at_price: string
  currency: string
  category_id: string
  collection_id: string
  featured: boolean
  is_new: boolean
  details: string
  sizes: string
  colors: string
  images: string
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProductForm({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<any[]>([])
  const [collections, setCollections] = useState<any[]>([])
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [form, setForm] = useState<FormState>({
    id: `p${Date.now().toString().slice(-4)}`,
    slug: '',
    name: '',
    subtitle: '',
    description: '',
    price: '',
    compare_at_price: '',
    currency: '€',
    category_id: 'outerwear',
    collection_id: 'aw-reserve',
    featured: false,
    is_new: false,
    details: '',
    sizes: '',
    colors: '',
    images: '',
  })

  const [variantsText, setVariantsText] = useState('')

  useEffect(() => {
    getCategories().then(setCategories).catch((e) => console.error('Categories load failed', e))
    getCollections().then(setCollections).catch((e) => console.error('Collections load failed', e))
  }, [])

  useEffect(() => {
    if (mode === 'edit' && id) {
      adminGetProductById(id)
        .then((p: any) => {
          setForm({
            id: p.id,
            slug: p.slug,
            name: p.name,
            subtitle: p.subtitle || '',
            description: p.description || '',
            price: String(p.price),
            compare_at_price: p.compare_at_price ? String(p.compare_at_price) : '',
            currency: p.currency || '€',
            category_id: p.category_id || 'outerwear',
            collection_id: p.collection_id || 'aw-reserve',
            featured: p.featured || false,
            is_new: p.is_new || false,
            details: (p.details || []).join('\n'),
            sizes: (p.sizes || []).join(', '),
            colors: (p.colors || []).map((c: any) => `${c.name}:${c.hex}`).join('\n'),
            images: (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => `${img.image_url} | ${img.alt_text || ''}`).join('\n'),
          })
          const variants = (p.variants || []).map((v: any) => `${v.color_name}:${v.color_hex}:${v.size}:${v.sku}:${v.stock}`).join('\n')
          setVariantsText(variants)
        })
        .catch((e) => {
          console.error('Product load failed', e)
          setError(e.message)
        })
        .finally(() => setLoading(false))
    }
  }, [mode, id])

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'name' && mode === 'create' && !prev.slug) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      if (!form.name || !form.slug || !form.price) {
        throw new Error('Name, slug and price are required')
      }

      const price = parseFloat(form.price)
      if (isNaN(price)) throw new Error('Price must be a number')

      const compare = form.compare_at_price ? parseFloat(form.compare_at_price) : null
      const details = form.details.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
      const colors = form.colors.split(/\r?\n/).map((line) => {
        const [name, hex] = line.split(':').map((s) => s.trim())
        if (!name || !hex) return null
        return { name, hex }
      }).filter(Boolean) as { name: string; hex: string }[]

      const images = form.images.split(/\r?\n/).map((line, idx) => {
        const [url, alt] = line.split('|').map((s) => s.trim())
        if (!url) return null
        return { image_url: url, alt_text: alt || '', sort_order: idx }
      }).filter(Boolean) as { image_url: string; alt_text: string; sort_order: number }[]

      const variants = variantsText.split(/\r?\n/).map((line) => {
        const [color_name, color_hex, size, sku, stockStr] = line.split(':').map((s) => s.trim())
        if (!color_name || !color_hex || !size || !sku) return null
        const stock = parseInt(stockStr || '10', 10)
        return { color_name, color_hex, size, sku, stock: isNaN(stock) ? 10 : stock }
      }).filter(Boolean) as { color_name: string; color_hex: string; size: string; sku: string; stock: number }[]

      if (mode === 'create') {
        await adminCreateProduct({
          id: form.id,
          slug: form.slug,
          name: form.name,
          subtitle: form.subtitle,
          description: form.description,
          price,
          compare_at_price: compare,
          currency: form.currency,
          category_id: form.category_id,
          collection_id: form.collection_id,
          featured: form.featured,
          is_new: form.is_new,
          details,
          sizes,
          colors,
        })
        if (images.length > 0) await adminSetProductImages(form.id, images)
        if (variants.length > 0) await adminSetProductVariants(form.id, variants)
        setSuccess('Product created successfully — will appear in storefront after refresh')
        setTimeout(() => navigate('/admin/products'), 1000)
      } else if (id) {
        await adminUpdateProduct(id, {
          slug: form.slug,
          name: form.name,
          subtitle: form.subtitle,
          description: form.description,
          price,
          compare_at_price: compare,
          currency: form.currency,
          category_id: form.category_id,
          collection_id: form.collection_id,
          featured: form.featured,
          is_new: form.is_new,
          details,
          sizes,
          colors,
        } as any)
        await adminSetProductImages(id, images)
        await adminSetProductVariants(id, variants)
        setSuccess('Product updated successfully — storefront will reflect changes')
      }
    } catch (err: any) {
      console.error('Save failed', err)
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="py-12"><span className="eyebrow">Loading product...</span></div>
  }

  return (
    <div className="flex flex-col gap-6 max-w-[800px]">
      <div>
        <span className="eyebrow mb-2 block">— {mode === 'create' ? 'New Product' : 'Edit Product'}</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">{mode === 'create' ? 'Create Product' : `Edit ${form.name}`}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-line p-6 bg-cream">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">ID (pXX)</label>
            <input value={form.id} onChange={(e) => handleChange('id', e.target.value)} disabled={mode === 'edit'} className="border border-line px-4 py-2.5 text-[13px] bg-paper disabled:opacity-60 focus:outline-none focus:border-ink" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Slug *</label>
            <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="oversized-wool-coat" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Name *</label>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="border border-line px-4 py-2.5 text-[14px] bg-paper focus:outline-none focus:border-ink" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Subtitle</label>
          <input value={form.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Price *</label>
            <input value={form.price} onChange={(e) => handleChange('price', e.target.value)} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="685" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Compare At Price</label>
            <input value={form.compare_at_price} onChange={(e) => handleChange('compare_at_price', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="850" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Currency</label>
            <input value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Category</label>
            <select value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className="border border-line px-4 py-2.5 text-[12px] uppercase tracking-wide-lg bg-paper focus:outline-none focus:border-ink">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Collection</label>
            <select value={form.collection_id} onChange={(e) => handleChange('collection_id', e.target.value)} className="border border-line px-4 py-2.5 text-[12px] uppercase tracking-wide-lg bg-paper focus:outline-none focus:border-ink">
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-wide-lg cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-wide-lg cursor-pointer">
            <input type="checkbox" checked={form.is_new} onChange={(e) => handleChange('is_new', e.target.checked)} />
            New Arrival
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Details (one per line)</label>
          <textarea value={form.details} onChange={(e) => handleChange('details', e.target.value)} rows={4} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="100% Italian merino wool" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Sizes (comma separated)</label>
          <input value={form.sizes} onChange={(e) => handleChange('sizes', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="XS, S, M, L, XL" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Colors (one per line: Name:Hex)</label>
          <textarea value={form.colors} onChange={(e) => handleChange('colors', e.target.value)} rows={3} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink" placeholder="Charcoal:#3A3A38" />
          <p className="text-[11px] text-muted">Format: Charcoal:#3A3A38 — one per line</p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Images (one per line: URL | alt)</label>
          <textarea value={form.images} onChange={(e) => handleChange('images', e.target.value)} rows={4} className="border border-line px-4 py-2.5 text-[12px] bg-paper focus:outline-none focus:border-ink" placeholder="https://... | Alt text" />
          <p className="text-[11px] text-muted">Preserve order, first is primary for ProductCard hover swap</p>
          {form.images && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.split(/\r?\n/).map((line, i) => {
                const url = line.split('|')[0]?.trim()
                if (!url) return null
                return <img key={i} src={url} alt="" className="h-16 w-12 object-cover border border-line" onError={(e) => (e.currentTarget.style.display = 'none')} />
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Variants (one per line: color_name:color_hex:size:sku:stock)</label>
          <textarea value={variantsText} onChange={(e) => setVariantsText(e.target.value)} rows={6} className="border border-line px-4 py-2.5 text-[11px] bg-paper focus:outline-none focus:border-ink font-mono" placeholder="Charcoal:#3A3A38:M:p01-charcoal-m:10" />
          <p className="text-[11px] text-muted">Unique per product+color+size, stock controls availability in storefront</p>
        </div>

        {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre whitespace-pre-wrap break-words">{error}</div>}
        {success && <div className="border border-green-700/30 bg-green-700/10 px-4 py-3 text-[12px] text-green-800">{success}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="border border-ink bg-ink text-paper px-8 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50">
            {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-line px-8 py-3 text-[11px] uppercase tracking-wide-lg hover:border-ink">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
