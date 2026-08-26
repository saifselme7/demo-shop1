import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardStats } from '../../services/admin/dashboard'
import { VERSION } from '../../lib/version'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ products: number; categories: number; collections: number; variants: number; lowStock: number; outOfStock: number; orders: number; pendingOrders: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => {
        console.error('Dashboard stats failed', e)
        setError(e.message)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <span className="eyebrow">— Dashboard</span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-cream animate-pulse border border-line" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 flex flex-col gap-4">
        <span className="eyebrow mb-4 block">— Error</span>
        <p className="font-serif italic text-xl text-muted">Unable to load dashboard — Supabase connection failed.</p>
        <p className="mt-2 text-[11px] uppercase tracking-wide-lg text-ochre break-words whitespace-pre-wrap">{error}</p>
        <div className="mt-4 border border-line bg-cream p-4 text-[11px] leading-relaxed">
          <div>SUPABASE URL PRESENT: {isSupabaseConfigured() ? 'YES' : 'NO'}</div>
          <div>Check Vercel env vars VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (must be prefixed VITE_ and set for Production, then redeploy).</div>
          <div className="mt-2">Deployed: {VERSION.commit}</div>
          <div>Expected: {VERSION.expected}</div>
        </div>
      </div>
    )
  }

  const cards = [
    { label: 'Products', value: stats?.products, href: '/admin/products' },
    { label: 'Orders', value: stats?.orders, href: '/admin/orders' },
    { label: 'Pending Orders', value: stats?.pendingOrders, href: '/admin/orders' },
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
        <p className="mt-3 text-[13px] text-muted max-w-[520px]">Real-time overview from Supabase. Orders are manual — customer places order, admin confirms/rejects, stock decreased on confirmation.</p>
        <p className="mt-2 text-[10px] font-mono text-muted">Deployed: {VERSION.commit} | Configured: {isSupabaseConfigured() ? 'YES' : 'NO'}</p>
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
          <Link to="/admin/orders" className="link-line text-ink">View Orders {stats?.pendingOrders ? `(${stats.pendingOrders} pending)` : ''}</Link>
          <Link to="/admin/products/new" className="link-line text-ink">+ New Product</Link>
          <Link to="/admin/categories" className="link-line text-ink">Manage Categories</Link>
          <Link to="/admin/collections" className="link-line text-ink">Manage Collections</Link>
          <Link to="/admin/diagnostic" className="link-line text-ink">Run Diagnostic</Link>
        </div>
      </div>
    </div>
  )
}
