import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from '../../lib/gsap'
import { UIProduct } from '../../services/types'
import { formatPrice } from '../../lib/utils'
import { cn } from '../../lib/utils'
import SafeImage from '../ui/SafeImage'

export default function ProductCard({ product, index = 0 }: { product: UIProduct; index?: number }) {
  const [hovered, setHovered] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)

  const onMouseEnter = () => {
    setHovered(true)
    if (imgRef.current) {
      gsap.to(imgRef.current, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
    }
  }
  const onMouseLeave = () => {
    setHovered(false)
    if (imgRef.current) {
      gsap.to(imgRef.current, { opacity: 1, duration: 0.5, ease: 'power2.inOut' })
    }
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block focus:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      data-cursor="hover"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <div ref={imgRef} className="absolute inset-0">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            loading={index < 4 ? 'eager' : 'lazy'}
            fetchPriority={index < 2 ? 'high' : 'auto'}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
          />
        </div>
        {product.images[1] && (
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              hovered ? 'opacity-100' : 'opacity-0',
            )}
            aria-hidden
          >
            <SafeImage
              src={product.images[1]}
              alt=""
              className="h-full w-full"
            />
          </div>
        )}

        {product.isNew && (
          <span className="absolute left-3 top-3 text-[10px] uppercase tracking-wide-lg text-ink bg-paper/90 px-2.5 py-1 backdrop-blur-md border border-line/50">
            New
          </span>
        )}
        <div className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="bg-paper/90 px-3 py-2 text-[10px] uppercase tracking-wide-lg backdrop-blur-md border border-line/50">
            View Detail
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-medium leading-tight truncate md:whitespace-normal">{product.name}</h3>
          <p className="mt-0.5 text-[12px] text-muted line-clamp-1">{product.subtitle}</p>
        </div>
        <span className="shrink-0 text-[14px] tabular-nums font-medium">{formatPrice(product.price, product.currency)}</span>
      </div>
      <div className="mt-2.5 flex gap-1.5">
        {product.colors.map((c) => (
          <span
            key={c.name}
            className="h-3 w-3 rounded-full border border-line/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.6)]"
            style={{ backgroundColor: c.hex }}
            title={c.name}
          />
        ))}
      </div>
    </Link>
  )
}
