import { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/product/ProductCard'
import { products } from '../data/products'
import { cn } from '../lib/utils'
import { useLanguage } from '../i18n'

const categories = ['all', 'new', 'outerwear', 'knitwear', 'trousers', 'dresses', 'accessories'] as const

export default function Shop() {
  const { category } = useParams()
  const [active, setActive] = useState<string>(category && category !== 'all' ? category : 'all')
  const [sort, setSort] = useState('latest')
  const { t, language } = useLanguage()

  useEffect(() => {
    if (category && category !== 'all') setActive(category)
    else setActive('all')
  }, [category])

  const filtered = useMemo(() => {
    let list = active === 'all' ? products : products.filter((p) => p.category === active)
    if (active === 'new') list = products.filter((p) => p.isNew)
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [active, sort])

  const getCategoryLabel = (c: string) => {
    switch (c) {
      case 'all': return t.shop.categories.all
      case 'new': return t.shop.categories.new
      case 'outerwear': return t.shop.categories.outerwear
      case 'knitwear': return t.shop.categories.knitwear
      case 'trousers': return t.shop.categories.trousers
      case 'dresses': return t.shop.categories.dresses
      case 'accessories': return t.shop.categories.accessories
      default: return c
    }
  }

  const getSortLabel = (v: string) => {
    switch (v) {
      case 'latest': return t.shop.sort.latest
      case 'price-asc': return t.shop.sort.priceLow
      case 'price-desc': return t.shop.sort.priceHigh
      default: return v
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-12 md:py-20 lg:py-24"
    >
      <div className="mb-10 md:mb-14">
        <span className="eyebrow mb-3 block">{t.shop.eyebrow}</span>
        <h1 className="font-display text-[clamp(36px,10vw,96px)] md:text-7xl lg:text-8xl xl:text-9xl tracking-ultra-tight leading-[0.9] capitalize break-words">
          {active === 'all' ? t.shop.allPieces : getCategoryLabel(active)}
        </h1>
      </div>

      <div className="mb-10 md:mb-12 flex flex-col gap-5 border-y border-line py-4 md:py-5 md:flex-row md:items-center md:justify-between">
        <nav className="flex flex-wrap gap-x-5 gap-y-3 md:gap-x-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                'text-[11px] md:text-[12px] uppercase tracking-wide-lg transition-colors duration-300 link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink min-h-[28px]',
                active === c ? 'text-ochre' : 'text-ink hover:text-ochre',
              )}
              data-cursor="hover"
            >
              {getCategoryLabel(c)}
            </button>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
          <span className="text-[11px] md:text-[12px] uppercase tracking-wide-lg text-muted">
            {filtered.length} {filtered.length === 1 ? t.shop.piece : t.shop.pieces}
          </span>
          <span className="hidden md:inline text-line">|</span>
          <div className="flex flex-wrap gap-3 md:gap-4">
            {(['latest', 'price-asc', 'price-desc'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  'text-[11px] md:text-[12px] uppercase tracking-wide-lg link-line focus:outline-none focus-visible:ring-1 focus-visible:ring-ink',
                  sort === s ? 'text-ochre' : 'text-muted hover:text-ink',
                )}
                data-cursor="hover"
              >
                {getSortLabel(s)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 md:py-32 text-center">
          <span className="eyebrow mb-4 block">{t.shop.emptySub}</span>
          <p className="font-serif italic text-2xl text-muted">{t.shop.empty}</p>
          <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
            {t.shop.viewAll}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
