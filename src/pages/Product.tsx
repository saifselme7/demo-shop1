import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProduct, getRelated } from '../data/products'
import { useCart } from '../store/cart'
import { formatPrice, cn } from '../lib/utils'
import ProductGallery from '../components/product/ProductGallery'
import SizeSelector from '../components/product/SizeSelector'
import ProductCard from '../components/product/ProductCard'
import { Reveal, RevealText } from '../components/ui/Reveal'
import { useLanguage, interpolate } from '../i18n'

export default function Product() {
  const { slug } = useParams()
  const product = slug ? getProduct(slug) : undefined
  const related = slug ? getRelated(slug, 4) : []
  const addItem = useCart((s) => s.addItem)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState(product?.colors[0]?.name || '')
  const [error, setError] = useState(false)
  const [added, setAdded] = useState(false)
  const { t, language } = useLanguage()

  useEffect(() => {
    setSize(null)
    setColor(product?.colors[0]?.name || '')
    setError(false)
    setAdded(false)
  }, [slug, product?.colors])

  if (!product) {
    return (
      <div className="container-ecru py-32 md:py-40 text-center">
        <span className="eyebrow mb-4 block">— Not found</span>
        <p className="font-display text-4xl md:text-5xl tracking-ultra-tight">{t.product.notFound}</p>
        <p className="mt-4 font-serif italic text-lg text-muted">{t.product.notFoundSub}</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
          {t.product.returnToShop}
        </Link>
      </div>
    )
  }

  const onAdd = () => {
    if (!size) {
      setError(true)
      return
    }
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name[language],
      price: product.price,
      currency: product.currency,
      size,
      color,
      image: product.images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'outerwear': return t.shop.categories.outerwear
      case 'knitwear': return t.shop.categories.knitwear
      case 'trousers': return t.shop.categories.trousers
      case 'dresses': return t.shop.categories.dresses
      case 'accessories': return t.shop.categories.accessories
      default: return cat
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-ecru-wide py-6 md:py-10 lg:py-12">
        <nav className="mb-6 md:mb-8 text-[11px] uppercase tracking-wide-lg text-muted overflow-x-auto whitespace-nowrap no-scrollbar flex items-center">
          <Link to="/" className="link-line">{t.product.home}</Link>
          <span className="mx-2 md:mx-3">/</span>
          <Link to={`/shop/${product.category}`} className="link-line capitalize">{getCategoryLabel(product.category)}</Link>
          <span className="mx-2 md:mx-3">/</span>
          <span className="text-ink">{product.name[language]}</span>
        </nav>

        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} alt={product.name[language]} />
          </div>

          <div className="lg:py-8">
            <span className="eyebrow mb-3 block">— {product.collection}</span>
            <RevealText
              as="h1"
              text={product.name[language]}
              className="font-display text-3xl md:text-5xl lg:text-6xl tracking-ultra-tight leading-[0.95]"
            />
            <Reveal delay={0.15}>
              <p className="mt-3 font-serif italic text-lg md:text-xl text-muted">{product.subtitle[language]}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-6 md:mt-8 flex items-baseline gap-4">
                <span className="font-display text-xl md:text-2xl tracking-ultra-tight">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-[11px] md:text-[12px] uppercase tracking-wide-lg text-muted">{t.product.inclTax}</span>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-6 md:mt-8 text-[14px] md:text-[15px] leading-relaxed text-ink/80 max-w-[520px]">{product.description[language]}</p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-8 md:mt-10 flex flex-col gap-3">
                <span className="eyebrow">{t.product.color} — <span className="text-ink normal-case tracking-normal">{product.colors.find(c=>c.name===color)?.label[language] || color}</span></span>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className="h-9 w-9 md:h-9 md:w-9 rounded-full border transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: color === c.name ? '#0E0E0E' : '#DDD6CB',
                        transform: color === c.name ? 'scale(1.1)' : 'scale(1)',
                      }}
                      title={c.label[language]}
                      aria-label={`${t.product.color} ${c.label[language]}`}
                      data-cursor="hover"
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-8">
                <SizeSelector sizes={product.sizes} selected={size} onSelect={(s) => { setSize(s); setError(false) }} />
                {error && (
                  <p className="mt-3 text-[11px] md:text-[12px] uppercase tracking-wide-lg text-ochre">
                    {t.product.selectSizeError}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-8">
                <button
                  onClick={onAdd}
                  className="group relative w-full overflow-hidden border border-ink py-5 text-[11px] md:text-[12px] uppercase tracking-wide-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                  data-cursor="hover"
                  aria-label="Add to cart"
                >
                  <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                    {added ? t.product.added : interpolate(t.product.addToCart, { price: formatPrice(product.price, product.currency) })}
                  </span>
                </button>
                {added && (
                  <p className="mt-3 text-[11px] uppercase tracking-wide-lg text-ochre animate-pulse">{t.product.addedMsg}</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-10 md:mt-12 border-t border-line pt-8">
                <span className="eyebrow mb-4 block">{t.product.details}</span>
                <ul className="flex flex-col gap-2.5 text-[13px] md:text-[14px] text-muted">
                  {product.details[language].map((d) => (
                    <li key={d} className="flex gap-3">
                      <span className="text-ink">—</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div className="mt-8 flex flex-col gap-2 text-[11px] md:text-[12px] uppercase tracking-wide-lg text-muted">
                <span>{t.product.shipping1}</span>
                <span>{t.product.shipping2}</span>
                <span>{t.product.shipping3}</span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 md:mt-28 lg:mt-32">
          <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-ultra-tight">{t.product.related}</h2>
            <Link to="/shop" className="btn-underline text-[11px] uppercase tracking-wide-lg w-fit focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">
              {t.product.browseAll}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
