import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from '../components/product/ProductCard'
import { products } from '../data/products'
import { cn } from '../lib/utils'

const categories = ['all', 'outerwear', 'knitwear', 'trousers', 'dresses', 'accessories']
const sorts = [
  { label: 'Latest', value: 'latest' },
  { label: 'Price — Low', value: 'price-asc' },
  { label: 'Price — High', value: 'price-desc' },
]

export default function Shop() {
  const { category } = useParams()
  const [active, setActive] = useState<string>(category && category !== 'all' ? category : 'all')
  const [sort, setSort] = useState('latest')

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="container-ecru-wide py-16 md:py-24"
    >
      <div className="mb-12 md:mb-16">
        <span className="eyebrow mb-3 block">— Collection</span>
        <h1 className="font-display text-6xl md:text-9xl tracking-ultra-tight leading-[0.9] capitalize">
          {active === 'all' ? 'All Pieces' : active}
        </h1>
      </div>

      <div className="mb-12 flex flex-col gap-6 border-y border-line py-5 md:flex-row md:items-center md:justify-between">
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={cn(
                'text-[12px] uppercase tracking-wide-lg transition-colors duration-300 link-line',
                active === c ? 'text-ochre' : 'text-ink',
              )}
              data-cursor="hover"
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <span className="text-[12px] uppercase tracking-wide-lg text-muted">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
          </span>
          <div className="flex gap-4">
            {sorts.map((s) => (
              <button
                key={s.value}
                onClick={() => setSort(s.value)}
                className={cn(
                  'text-[12px] uppercase tracking-wide-lg link-line',
                  sort === s.value ? 'text-ochre' : 'text-muted',
                )}
                data-cursor="hover"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-32 text-center">
          <p className="font-serif italic text-2xl text-muted">No pieces in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </motion.div>
  )
}
