import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProductCard from '../components/product/ProductCard'
import { featured } from '../data/products'
import { Reveal, RevealText } from '../components/ui/Reveal'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.featured-grid > *', {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.featured-grid', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="container-ecru-wide py-20 md:py-32">
      <div className="mb-12 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="eyebrow mb-3 block">— Selected pieces</span>
          <RevealText
            as="h2"
            text="The Reserve."
            className="font-display text-6xl md:text-8xl tracking-ultra-tight leading-[0.9]"
          />
        </div>
        <Reveal>
          <Link to="/shop" className="btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
            View all — {featured.length} pieces
          </Link>
        </Reveal>
      </div>

      <div className="featured-grid grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 md:gap-y-16 lg:grid-cols-4">
        {featured.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>

      <div className="mt-20 hidden md:grid grid-cols-2 gap-x-6 gap-y-16 lg:grid-cols-4">
        {featured.slice(4, 8).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i + 4} />
        ))}
      </div>
    </section>
  )
}
