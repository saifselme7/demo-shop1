import { Link } from 'react-router-dom'
import { RevealImage } from '../components/ui/Reveal'
import { Reveal, RevealText } from '../components/ui/Reveal'

const cats = [
  { label: 'Outerwear', slug: 'outerwear', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Knitwear', slug: 'knitwear', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Trousers', slug: 'trousers', image: 'https://images.unsplash.com/photo-1594633353590-b3f1dd9b1ae0?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dresses', slug: 'dresses', image: 'https://images.unsplash.com/photo-1496748560446-9d4be976f3a6?auto=format&fit=crop&w=1200&q=80' },
]

export default function Categories() {
  return (
    <section className="py-20 md:py-32">
      <div className="container-ecru-wide mb-12 md:mb-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow mb-3 block">— By category</span>
            <RevealText
              as="h2"
              text="Explore the wardrobe."
              className="font-display text-5xl md:text-7xl tracking-ultra-tight leading-[0.9]"
            />
          </div>
          <Reveal>
            <p className="max-w-md text-[14px] leading-relaxed text-muted">
              Each category holds a small, deliberate selection — pieces chosen for cut, cloth, and longevity.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="container-ecru-wide grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <Link to={`/shop/${c.slug}`} className="group block" data-cursor="hover">
              <RevealImage
                src={c.image}
                alt={c.label}
                className="aspect-[3/4]"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="mt-4 flex items-center justify-between">
                <h3 className="font-display text-xl tracking-ultra-tight">{c.label}</h3>
                <span className="text-[11px] uppercase tracking-wide-lg text-muted group-hover:text-ink">→</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
