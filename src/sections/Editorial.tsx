import { Link } from 'react-router-dom'
import { Reveal, RevealImage, RevealText } from '../components/ui/Reveal'
import { collections } from '../data/collections'

export default function Editorial() {
  return (
    <section className="py-20 md:py-32">
      {collections.map((c, i) => (
        <div
          key={c.slug}
          className="container-ecru-wide mb-20 md:mb-32 grid gap-6 md:mb-40 md:gap-10 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <RevealImage
              src={c.image}
              alt={c.title}
              className="aspect-[4/5] md:aspect-[16/10]"
              parallax
            />
          </div>
          <div className="flex flex-col justify-end lg:col-span-4">
            <span className="eyebrow mb-3 block">— Collection {String(i + 1).padStart(2, '0')}</span>
            <RevealText
              as="h3"
              text={c.title}
              className="font-display text-4xl md:text-5xl tracking-ultra-tight leading-[0.95]"
            />
            <Reveal delay={0.2}>
              <p className="mt-4 font-serif italic text-lg text-muted">{c.subtitle}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-md text-[14px] leading-relaxed text-muted">{c.description}</p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <span className="text-[12px] uppercase tracking-wide-lg text-muted">{c.pieces} pieces</span>
                <Link to="/shop" className="btn-underline text-[11px] uppercase tracking-wide-lg" data-cursor="hover">
                  Discover
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  )
}
