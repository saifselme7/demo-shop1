import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminGetProductById, adminCreateProduct, adminUpdateProduct, adminSetProductImages, adminSetProductVariants } from '../../services/admin/products'
import { getCategories } from '../../services/categories'
import { getCollections } from '../../services/collections'
import { uploadProductImage, extractStoragePathFromUrl } from '../../services/admin/storage'

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
}

interface ImageItem {
  id: string
  image_url: string
  alt_text: string
  file?: File
  uploading?: boolean
  error?: string
  path?: string
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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  })

  const [images, setImages] = useState<ImageItem[]>([])
  const [variantsText, setVariantsText] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')

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
          })
          const imgs = (p.images || []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((img: any) => ({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text || '',
          }))
          setImages(imgs)
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const newItem: ImageItem = {
        id: `temp-${Date.now()}-${i}`,
        image_url: URL.createObjectURL(file),
        alt_text: '',
        file,
        uploading: false,
      }
      setImages((prev) => [...prev, newItem])
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return
    const newItem: ImageItem = {
      id: `temp-url-${Date.now()}`,
      image_url: imageUrlInput.trim(),
      alt_text: '',
    }
    setImages((prev) => [...prev, newItem])
    setImageUrlInput('')
  }

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  const handleAltChange = (id: string, alt: string) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, alt_text: alt } : img)))
  }

  const handleReorder = (id: string, direction: 'up' | 'down') => {
    setImages((prev) => {
      const idx = prev.findIndex((img) => img.id === id)
      if (idx === -1) return prev
      const newIdx = direction === 'up' ? idx - 1 : idx + 1
      if (newIdx < 0 || newIdx >= prev.length) return prev
      const newArr = [...prev]
      const temp = newArr[idx]
      newArr[idx] = newArr[newIdx]
      newArr[newIdx] = temp
      return newArr
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

      // Process images: upload files to Supabase Storage
      const processedImages: { image_url: string; alt_text: string; sort_order: number }[] = []
      const uploadErrors: string[] = []

      for (let idx = 0; idx < images.length; idx++) {
        const imgItem = images[idx]
        if (imgItem.file) {
          // Upload to storage
          setImages((prev) => prev.map((im) => (im.id === imgItem.id ? { ...im, uploading: true, error: undefined } : im)))
          try {
            const result = await uploadProductImage(form.id, imgItem.file, idx)
            processedImages.push({ image_url: result.url, alt_text: imgItem.alt_text, sort_order: idx })
            setImages((prev) => prev.map((im) => (im.id === imgItem.id ? { ...im, uploading: false, image_url: result.url, path: result.path } : im)))
          } catch (err: any) {
            const msg = err.message || 'Upload failed'
            uploadErrors.push(`${imgItem.file.name}: ${msg}`)
            setImages((prev) => prev.map((im) => (im.id === imgItem.id ? { ...im, uploading: false, error: msg } : im)))
          }
        } else {
          processedImages.push({ image_url: imgItem.image_url, alt_text: imgItem.alt_text, sort_order: idx })
        }
      }

      if (uploadErrors.length > 0) {
        throw new Error(`Image upload errors:\n${uploadErrors.join('\n')}`)
      }

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
        if (processedImages.length > 0) await adminSetProductImages(form.id, processedImages)
        if (variants.length > 0) await adminSetProductVariants(form.id, variants)
        setSuccess('Product created successfully — will appear in storefront after refresh')
        setTimeout(() => navigate('/admin/products'), 1200)
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
        await adminSetProductImages(id, processedImages)
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
    <div className="flex flex-col gap-6 max-w-[900px]">
      <div>
        <span className="eyebrow mb-2 block">— {mode === 'create' ? 'New Product' : 'Edit Product'}</span>
        <h1 className="font-display text-3xl tracking-ultra-tight">{mode === 'create' ? 'Create Product' : `Edit ${form.name}`}</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 border border-line p-6 bg-cream">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">ID (pXX)</label>
            <input value={form.id} onChange={(e) => handleChange('id', e.target.value)} disabled={mode === 'edit'} className="border border-line px-4 py-2.5 text-[13px] bg-paper disabled:opacity-60 focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Slug *</label>
            <input value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" placeholder="oversized-wool-coat" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Name *</label>
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="border border-line px-4 py-2.5 text-[14px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Subtitle</label>
          <input value={form.subtitle} onChange={(e) => handleChange('subtitle', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Price *</label>
            <input value={form.price} onChange={(e) => handleChange('price', e.target.value)} required className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" placeholder="685" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Compare At Price</label>
            <input value={form.compare_at_price} onChange={(e) => handleChange('compare_at_price', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" placeholder="850" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Currency</label>
            <input value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Category</label>
            <select value={form.category_id} onChange={(e) => handleChange('category_id', e.target.value)} className="border border-line px-4 py-2.5 text-[12px] uppercase tracking-wide-lg bg-paper focus:outline-none focus:border-ink min-h-[44px]">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="eyebrow">Collection</label>
            <select value={form.collection_id} onChange={(e) => handleChange('collection_id', e.target.value)} className="border border-line px-4 py-2.5 text-[12px] uppercase tracking-wide-lg bg-paper focus:outline-none focus:border-ink min-h-[44px]">
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-wide-lg cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={form.featured} onChange={(e) => handleChange('featured', e.target.checked)} />
            Featured
          </label>
          <label className="flex items-center gap-2 text-[12px] uppercase tracking-wide-lg cursor-pointer min-h-[44px]">
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
          <input value={form.sizes} onChange={(e) => handleChange('sizes', e.target.value)} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" placeholder="XS, S, M, L, XL" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Colors (one per line: Name:Hex)</label>
          <textarea value={form.colors} onChange={(e) => handleChange('colors', e.target.value)} rows={3} className="border border-line px-4 py-2.5 text-[13px] bg-paper focus:outline-none focus:border-ink min-h-[44px]" placeholder="Charcoal:#3A3A38" />
          <p className="text-[11px] text-muted">Format: Charcoal:#3A3A38 — one per line</p>
        </div>

        <div className="flex flex-col gap-4 border border-line p-4 bg-paper">
          <span className="eyebrow">Images — {images.length} — Primary is first, hover swap second</span>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" multiple onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="border border-ink bg-paper px-6 py-3 text-[11px] uppercase tracking-wide-lg hover:bg-ink hover:text-paper transition-colors min-h-[44px]">
              Upload Images (JPG/PNG/WEBP, max 5MB)
            </button>
            <div className="flex gap-2 flex-1">
              <input value={imageUrlInput} onChange={(e) => setImageUrlInput(e.target.value)} placeholder="Or paste image URL and add" className="border border-line bg-cream px-4 py-2.5 text-[12px] flex-1 min-h-[44px] focus:outline-none focus:border-ink" />
              <button type="button" onClick={handleAddImageUrl} className="border border-line px-4 py-2.5 text-[11px] uppercase tracking-wide-lg hover:border-ink min-h-[44px]">Add URL</button>
            </div>
          </div>

          {images.length > 0 ? (
            <div className="flex flex-col gap-3">
              {images.map((imgItem, idx) => (
                <div key={imgItem.id} className="flex gap-3 border border-line p-3 bg-cream items-start">
                  <div className="h-20 w-16 bg-paper border border-line overflow-hidden shrink-0">
                    <img src={imgItem.image_url} alt={imgItem.alt_text} className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wide-lg bg-ink text-paper px-2 py-1">{idx === 0 ? 'Primary' : idx === 1 ? 'Secondary (hover)' : `#${idx + 1}`}</span>
                      {imgItem.uploading && <span className="text-[10px] uppercase text-ochre animate-pulse">Uploading...</span>}
                      {imgItem.error && <span className="text-[10px] uppercase text-red-700">{imgItem.error}</span>}
                      {imgItem.path && <span className="text-[9px] font-mono text-muted truncate max-w-[150px]">{imgItem.path}</span>}
                    </div>
                    <input value={imgItem.alt_text} onChange={(e) => handleAltChange(imgItem.id, e.target.value)} placeholder="Alt text" className="border border-line bg-paper px-3 py-2 text-[11px] focus:outline-none focus:border-ink min-h-[36px]" />
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleReorder(imgItem.id, 'up')} disabled={idx === 0} className="text-[10px] uppercase link-line disabled:opacity-30 min-h-[28px]">↑ Up</button>
                      <button type="button" onClick={() => handleReorder(imgItem.id, 'down')} disabled={idx === images.length - 1} className="text-[10px] uppercase link-line disabled:opacity-30 min-h-[28px]">↓ Down</button>
                      <button type="button" onClick={() => handleRemoveImage(imgItem.id)} className="text-[10px] uppercase link-line text-ochre min-h-[28px]">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted">No images — add via upload or URL. First image is primary for ProductCard.</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="eyebrow">Variants (one per line: color_name:color_hex:size:sku:stock)</label>
          <textarea value={variantsText} onChange={(e) => setVariantsText(e.target.value)} rows={6} className="border border-line px-4 py-2.5 text-[11px] bg-paper focus:outline-none focus:border-ink font-mono min-h-[100px]" placeholder="Charcoal:#3A3A38:M:p01-charcoal-m:10" />
          <p className="text-[11px] text-muted">Unique per product+color+size, stock controls availability in storefront</p>
        </div>

        {error && <div className="border border-ochre/30 bg-ochre/10 px-4 py-3 text-[12px] text-ochre whitespace-pre-wrap break-words">{error}</div>}
        {success && <div className="border border-green-700/30 bg-green-700/10 px-4 py-3 text-[12px] text-green-800">{success}</div>}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={saving} className="border border-ink bg-ink text-paper px-8 py-3 text-[11px] uppercase tracking-wide-lg disabled:opacity-50 min-h-[44px]">
            {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="border border-line px-8 py-3 text-[11px] uppercase tracking-wide-lg hover:border-ink min-h-[44px]">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
