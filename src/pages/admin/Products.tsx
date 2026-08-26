import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { adminGetProducts, adminDeleteProduct } from '../../services/admin/products'
import { formatPrice } from '../../lib/utils'

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [collectionFilter, setCollectionFilter] = useState('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminGetProducts()
      setProducts(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.slug.includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || p.category_id === categoryFilter
      const matchesCollection = collectionFilter === 'all' || p.collection_id === collectionFilter
      return matchesSearch && matchesCategory && matchesCollection
    })
  }, [products, search, categoryFilter, collectionFilter])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete this product? \"${name}\" will be removed with its images and variants.`)) return
    setDeleting(id)
    try {
      await adminDeleteProduct(id)
      await load()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="eyebrow mb-2 block">— Products</span>
          <h1 className="font-display text-3xl md:text-4xl tracking-ultra-tight">Products — {loading ? '...' : filtered.length}</h1>
        </div>
        <Link to="/admin/products/new" className="border border-ink px-6 py-3 text-[11px] uppercase tracking-wide-lg bg-ink text-paper hover:bg-ochre transition-colors w-fit">
          + New Product
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 border-y border-line py-4">
        <input
          type="text"
          placeholder="Search by name or slug"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-line bg-cream px-4 py-2.5 text-[13px] focus:outline-none focus:border-ink flex-1 min-w-[200px]"
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-line bg-cream px-4 py-2.5 text-[12px] uppercase tracking-wide-lg focus:outline-none focus:border-ink">
          <option value="all">All Categories</option>
          <option value="outerwear">Outerwear</option>
          <option value="knitwear">Knitwear</option>
          <option value="trousers">Trousers</option>
          <option value="dresses">Dresses</option>
          <option value="accessories">Accessories</option>
        </select>
        <select value={collectionFilter} onChange={(e) => setCollectionFilter(e.target.value)} className="border border-line bg-cream px-4 py-2.5 text-[12px] uppercase tracking-wide-lg focus:outline-none focus:border-ink">
          <option value="all">All Collections</option>
          <option value="aw-reserve">AW — Reserve</option>
          <option value="spring-reserve">Spring — Reserve</option>
          <option value="atelier-archive">Atelier — Archive</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-cream animate-pulse border border-line" />
          ))}
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <p className="font-serif italic text-lg text-muted">Unable to load products.</p>
          <p className="mt-2 text-[11px] text-muted">{error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <span className="eyebrow mb-3 block">— Empty</span>
          <p className="font-serif italic text-xl text-muted">No products match.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-cream border-b border-line">
                <tr className="text-[11px] uppercase tracking-wide-lg text-muted">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Featured</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0
                  const firstImage = p.images?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url || ''
                  return (
                    <tr key={p.id} className="border-b border-line text-[13px] hover:bg-cream/50">
                      <td className="px-4 py-3">
                        <div className="h-12 w-10 bg-cream overflow-hidden">
                          {firstImage && <img src={firstImage} alt={p.name} className="h-full w-full object-cover" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-display font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-muted capitalize">{p.category_id}</td>
                      <td className="px-4 py-3 tabular-nums">{formatPrice(Number(p.price), p.currency)} {p.compare_at_price && <span className="line-through text-muted ml-2">{formatPrice(Number(p.compare_at_price), p.currency)}</span>}</td>
                      <td className="px-4 py-3 tabular-nums">{totalStock} {totalStock === 0 && <span className="text-ochre text-[11px] uppercase ml-2">Out</span>}</td>
                      <td className="px-4 py-3 text-[11px] uppercase">{p.featured ? 'Yes' : '—'} {p.is_new ? '/ New' : ''}</td>
                      <td className="px-4 py-3 flex gap-3">
                        <Link to={`/admin/products/${p.id}/edit`} className="link-line text-[11px] uppercase">Edit</Link>
                        <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id} className="link-line text-[11px] uppercase text-ochre disabled:opacity-50">
                          {deleting === p.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden flex flex-col gap-3">
            {filtered.map((p) => {
              const firstImage = p.images?.sort((a: any, b: any) => a.sort_order - b.sort_order)[0]?.image_url || ''
              const totalStock = p.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0
              return (
                <div key={p.id} className="border border-line bg-cream p-4 flex gap-4">
                  <div className="h-20 w-16 bg-paper overflow-hidden shrink-0">
                    {firstImage && <img src={firstImage} alt={p.name} className="h-full w-full object-cover" />}
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="font-display text-[14px] font-medium">{p.name}</span>
                    <span className="text-[11px] text-muted capitalize">{p.category_id} — {formatPrice(Number(p.price), p.currency)}</span>
                    <span className="text-[11px] tabular-nums">Stock: {totalStock}</span>
                    <div className="mt-2 flex gap-4">
                      <Link to={`/admin/products/${p.id}/edit`} className="text-[11px] uppercase link-line">Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-[11px] uppercase link-line text-ochre">Delete</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
