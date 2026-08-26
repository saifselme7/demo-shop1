import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useUI } from '../../store/ui'
import { useProducts } from '../../hooks/useProducts'
import { formatPrice } from '../../lib/utils'
import SafeImage from '../ui/SafeImage'

export default function SearchDrawer() {
  const open = useUI((s) => s.searchOpen)
  const setOpen = useUI((s) => s.setSearchOpen)
  const { products, loading } = useProducts()
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      const lenis = (window as any).lenis
      if (lenis) lenis.stop()
    } else {
      document.body.style.overflow = ''
      const lenis = (window as any).lenis
      if (lenis) lenis.start()
      setQuery('')
    }
    return () => {
      document.body.style.overflow = ''
      const lenis = (window as any).lenis
      if (lenis) lenis.start()
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  const filtered = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return products.filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.collection.toLowerCase().includes(q)
    ).slice(0, 12)
  }, [products, query])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed inset-0 z-[80] bg-paper flex flex-col"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-[68px] items-center justify-between px-6 border-b border-line shrink-0">
              <span className="font-display text-xl font-bold tracking-ultra-tight">Search — SAIF STORE</span>
              <button
                onClick={() => setOpen(false)}
                className="text-[11px] uppercase tracking-wide-lg px-3 py-2 -me-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                aria-label="Close search"
              >
                Close
              </button>
            </div>

            <div className="px-6 py-6 border-b border-line">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories, collections..."
                  autoFocus
                  className="w-full border border-line bg-cream px-4 py-4 text-[15px] focus:outline-none focus:border-ink pr-12 min-h-[52px]"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[11px] uppercase">{loading ? '...' : `${filtered.length}`}</span>
              </div>
              <p className="mt-3 text-[11px] text-muted">Press ESC to close — Results from Supabase real catalog</p>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {query.trim() === '' ? (
                <div className="py-12 text-center">
                  <span className="eyebrow mb-3 block">— Search</span>
                  <p className="font-serif italic text-lg text-muted">Type to search the reserve.</p>
                  <p className="mt-2 text-[11px] text-muted">Try: coat, knitwear, silk, wool, bag</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="eyebrow mb-3 block">— No results</span>
                  <p className="font-serif italic text-lg text-muted">No products found for "{query}"</p>
                  <Link to="/shop" onClick={() => setOpen(false)} className="mt-6 inline-block btn-underline text-[11px] uppercase">Browse all</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
                  {filtered.map((p, i) => (
                    <Link key={p.id} to={`/product/${p.slug}`} onClick={() => setOpen(false)} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                        <SafeImage src={p.images[0]} alt={p.name} className="h-full w-full group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="mt-3">
                        <h3 className="font-display text-[14px] font-medium leading-tight truncate">{p.name}</h3>
                        <p className="text-[11px] text-muted truncate">{p.subtitle}</p>
                        <span className="mt-1 block text-[12px] tabular-nums">{formatPrice(p.price, p.currency)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
