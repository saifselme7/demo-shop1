import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../store/cart'
import { formatPrice } from '../lib/utils'
import ProductGallery from '../components/product/ProductGallery'
import SizeSelector from '../components/product/SizeSelector'
import ProductCard from '../components/product/ProductCard'
import { Reveal, RevealText } from '../components/ui/Reveal'
import { useProductBySlug, useRelatedProducts } from '../hooks/useProducts'

export default function Product() {
  const { slug } = useParams()
  const { product, loading, error } = useProductBySlug(slug)
  const { products: related, loading: relatedLoading } = useRelatedProducts(product?.slug, product?.category, 4)

  const addItem = useCart((s) => s.addItem)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState('')
  const [sizeError, setSizeError] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (product) {
      setSize(null)
      setColor(product.colors[0]?.name || '')
      setSizeError(false)
      setAdded(false)
    }
  }, [product?.id])

  if (loading) {
    return (
      <div className="container-ecru-wide py-8 md:py-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="aspect-[3/4] bg-cream animate-pulse" />
          <div className="flex flex-col gap-6">
            <div className="h-8 bg-cream animate-pulse w-1/2" />
            <div className="h-12 bg-cream animate-pulse" />
            <div className="h-6 bg-cream animate-pulse w-3/4" />
            <div className="h-20 bg-cream animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-ecru py-32 md:py-40 text-center">
        <span className="eyebrow mb-4 block">— Error</span>
        <p className="font-display text-3xl md:text-4xl tracking-ultra-tight">Unable to load product.</p>
        <p className="mt-3 text-[11px] uppercase tracking-wide-lg text-muted">{error}</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
          Return to shop
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container-ecru py-32 md:py-40 text-center">
        <span className="eyebrow mb-4 block">— Not found</span>
        <p className="font-display text-4xl md:text-5xl tracking-ultra-tight">Piece not found.</p>
        <p className="mt-4 font-serif italic text-lg text-muted">It may have been retired from the reserve.</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
          Return to shop
        </Link>
      </div>
    )
  }

  const onAdd = () => {
    if (!size) {
      setSizeError(true)
      return
    }
    // Check stock for selected variant if available
    const variant = product.variants?.find((v) => v.color_name === color && v.size === size)
    if (variant && variant.stock <= 0) {
      setSizeError(true)
      return
    }

    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      currency: product.currency,
      size,
      color,
      image: product.images[0],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const selectedVariant = product.variants?.find((v) => v.color_name === color && v.size === size)
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-ecru-wide py-6 md:py-10 lg:py-12">
        <nav className="mb-6 md:mb-8 text-[11px] uppercase tracking-wide-lg text-muted overflow-x-auto whitespace-nowrap no-scrollbar flex items-center">
          <Link to="/" className="link-line">Home</Link>
          <span className="mx-2 md:mx-3">/</span>
          <Link to={`/shop/${product.category}`} className="link-line capitalize">{product.category}</Link>
          <span className="mx-2 md:mx-3">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-8 md:gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          <div className="lg:py-8">
            <span className="eyebrow mb-3 block">— {product.collection}</span>
            <RevealText
              as="h1"
              text={product.name}
              className="font-display text-3xl md:text-5xl lg:text-6xl tracking-ultra-tight leading-[0.95]"
            />
            <Reveal delay={0.15}>
              <p className="mt-3 font-serif italic text-lg md:text-xl text-muted">{product.subtitle}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-6 md:mt-8 flex items-baseline gap-4">
                <span className="font-display text-xl md:text-2xl tracking-ultra-tight">
                  {formatPrice(product.price, product.currency)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-[14px] line-through text-muted tabular-nums">
                    {formatPrice(product.compareAtPrice, product.currency)}
                  </span>
                )}
                <span className="text-[11px] md:text-[12px] uppercase tracking-wide-lg text-muted">incl. tax</span>
              </div>
              {selectedVariant && (
                <p className="mt-2 text-[11px] uppercase tracking-wide-lg text-muted">
                  Stock: {selectedVariant.stock} {selectedVariant.stock === 1 ? 'piece' : 'pieces'} — SKU: {selectedVariant.sku}
                </p>
              )}
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-6 md:mt-8 text-[14px] md:text-[15px] leading-relaxed text-ink/80 max-w-[520px]">{product.description}</p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-8 md:mt-10 flex flex-col gap-3">
                <span className="eyebrow">Colour — <span className="text-ink normal-case tracking-normal">{color}</span></span>
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
                      title={c.name}
                      aria-label={`Select color ${c.name}`}
                      data-cursor="hover"
                    />
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.45}>
              <div className="mt-8">
                <SizeSelector sizes={product.sizes} selected={size} onSelect={(s) => { setSize(s); setSizeError(false) }} />
                {sizeError && (
                  <p className="mt-3 text-[11px] md:text-[12px] uppercase tracking-wide-lg text-ochre">
                    {isOutOfStock ? '— Out of stock for this variant' : '— Please select a size'}
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-8">
                <button
                  onClick={onAdd}
                  disabled={isOutOfStock}
                  className="group relative w-full overflow-hidden border border-ink py-5 text-[11px] md:text-[12px] uppercase tracking-wide-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:opacity-50 disabled:cursor-not-allowed"
                  data-cursor="hover"
                  aria-label="Add to cart"
                >
                  <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-disabled:translate-y-full" />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-paper group-disabled:text-ink">
                    {added ? 'Added — View Cart' : isOutOfStock ? 'Out of stock' : `Add to cart — ${formatPrice(product.price, product.currency)}`}
                  </span>
                </button>
                {added && (
                  <p className="mt-3 text-[11px] uppercase tracking-wide-lg text-ochre animate-pulse">— Added to cart</p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-10 md:mt-12 border-t border-line pt-8">
                <span className="eyebrow mb-4 block">Details</span>
                <ul className="flex flex-col gap-2.5 text-[13px] md:text-[14px] text-muted">
                  {product.details.map((d) => (
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
                <span>— Complimentary shipping above €250</span>
                <span>— Considered returns within 14 days</span>
                <span>— Numbered edition</span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 md:mt-28 lg:mt-32">
          <div className="mb-8 md:mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-ultra-tight">You may also like.</h2>
            <Link to="/shop" className="btn-underline text-[11px] uppercase tracking-wide-lg w-fit focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">
              Browse all
            </Link>
          </div>
          {relatedLoading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-cream animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
