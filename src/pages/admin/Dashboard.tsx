import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/admin/dashboard'

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ products: number; categories: number; collections: number; variants: number; lowStock: number; outOfStock: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <span className="eyebrow">— Dashboard</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-cream animate-pulse border border-line" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <span className="eyebrow mb-4 block">— Error</span>
        <p className="font-serif italic text-xl text-muted">Unable to load dashboard.</p>
        <p className="mt-2 text-[11px] uppercase tracking-wide-lg text-muted">{error}</p>
      </div>
    )
  }

  const cards = [
    { label: 'Products', value: stats?.products, href: '/admin/products' },
    { label: 'Categories', value: stats?.categories, href: '/admin/categories' },
    { label: 'Collections', value: stats?.collections, href: '/admin/collections' },
    { label: 'Variants', value: stats?.variants, href: '/admin/products' },
    { label: 'Low Stock (<5)', value: stats?.lowStock, href: '/admin/products' },
    { label: 'Out of Stock', value: stats?.outOfStock, href: '/admin/products' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="eyebrow mb-3 block">— Dashboard</span>
        <h1 className="font-display text-4xl md:text-5xl tracking-ultra-tight">SAIF STORE — Admin</h1>
        <p className="mt-3 text-[13px] text-muted max-w-[480px]">Real-time overview from Supabase. Public storefront remains read-only, admin writes require admin_users authorization.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.href} className="border border-line bg-cream p-6 hover:border-ink transition-colors group">
            <span className="eyebrow mb-2 block">{c.label}</span>
            <span className="font-display text-4xl tracking-ultra-tight group-hover:text-ochre transition-colors">{c.value}</span>
          </Link>
        ))}
      </div>

      <div className="border-t border-line pt-8 flex flex-col gap-3 text-[11px] uppercase tracking-wide-lg text-muted">
        <span>— Quick Actions</span>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/products/new" className="link-line text-ink">+ New Product</Link>
          <Link to="/admin/categories" className="link-line text-ink">Manage Categories</Link>
          <Link to="/admin/collections" className="link-line text-ink">Manage Collections</Link>
        </div>
      </div>
    </div>
  )
}
