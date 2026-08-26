import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProduct, getRelated } from '../data/products'
import { useCart } from '../store/cart'
import { formatPrice } from '../lib/utils'
import ProductGallery from '../components/product/ProductGallery'
import SizeSelector from '../components/product/SizeSelector'
import ProductCard from '../components/product/ProductCard'
import { Reveal, RevealText } from '../components/ui/Reveal'

export default function Product() {
  const { slug } = useParams()
  const product = slug ? getProduct(slug) : undefined
  const related = slug ? getRelated(slug, 4) : []
  const addItem = useCart((s) => s.addItem)
  const [size, setSize] = useState<string | null>(null)
  const [color, setColor] = useState(product?.colors[0]?.name || '')
  const [error, setError] = useState(false)

  useEffect(() => {
    setSize(null)
    setColor(product?.colors[0]?.name || '')
    setError(false)
  }, [slug])

  if (!product) {
    return (
      <div className="container-ecru py-40 text-center">
        <p className="font-serif italic text-3xl">Piece not found.</p>
        <Link to="/shop" className="mt-8 inline-block btn-underline">Return to shop</Link>
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
      name: product.name,
      price: product.price,
      currency: product.currency,
      size,
      color,
      image: product.images[0],
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container-ecru-wide py-8 md:py-12">
        <nav className="mb-8 text-[11px] uppercase tracking-wide-lg text-muted">
          <Link to="/" className="link-line">Home</Link>
          <span className="mx-3">/</span>
          <Link to={`/shop/${product.category}`} className="link-line capitalize">{product.category}</Link>
          <span className="mx-3">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductGallery images={product.images} alt={product.name} />
          </div>

          <div className="lg:py-8">
            <span className="eyebrow mb-3 block">— {product.collection}</span>
            <RevealText
              as="h1"
              text={product.name}
              className="font-display text-4xl md:text-6xl tracking-ultra-tight leading-[0.95]"
            />
            <Reveal delay={0.15}>
              <p className="mt-3 font-serif italic text-xl text-muted">{product.subtitle}</p>
            </Reveal>

            <Reveal delay={0.25}>
              <div className="mt-8 flex items-baseline gap-4">
                <span className="font-display text-2xl tracking-ultra-tight">
                  {formatPrice(product.price, product.currency)}
                </span>
                <span className="text-[12px] uppercase tracking-wide-lg text-muted">incl. tax</span>
              </div>
            </Reveal>

            <Reveal delay={0.35}>
              <p className="mt-8 text-[15px] leading-relaxed text-ink/80">{product.description}</p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-10 flex flex-col gap-3">
                <span className="eyebrow">Colour — <span className="text-ink normal-case tracking-normal">{color}</span></span>
                <div className="flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      className="h-8 w-8 rounded-full border transition-all duration-300"
                      style={{
                        backgroundColor: c.hex,
                        borderColor: color === c.name ? '#0E0E0E' : '#DDD6CB',
                        transform: color === c.name ? 'scale(1.1)' : 'scale(1)',
                      }}
                      title={c.name}
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
                  <p className="mt-3 text-[12px] uppercase tracking-wide-lg text-ochre">
                    — Please select a size
                  </p>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="mt-8">
                <button
                  onClick={onAdd}
                  className="group relative w-full overflow-hidden border border-ink py-5 text-[12px] uppercase tracking-wide-lg"
                  data-cursor="hover"
                >
                  <span className="absolute inset-0 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-paper">
                    Add to cart — {formatPrice(product.price, product.currency)}
                  </span>
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.55}>
              <div className="mt-12 border-t border-line pt-8">
                <span className="eyebrow mb-4 block">Details</span>
                <ul className="flex flex-col gap-2 text-[14px] text-muted">
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
              <div className="mt-8 flex flex-col gap-2 text-[12px] uppercase tracking-wide-lg text-muted">
                <span>— Complimentary shipping above €250</span>
                <span>— Considered returns within 14 days</span>
                <span>— Numbered edition</span>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-32">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-4xl md:text-6xl tracking-ultra-tight">You may also like.</h2>
            <Link to="/shop" className="btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
              Browse all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
