import { Link } from 'react-router-dom'
import { Reveal, RevealImage, RevealText } from '../components/ui/Reveal'
import { collections } from '../data/collections'
import { useLanguage, interpolate } from '../i18n'

export default function Editorial() {
  const { t, language } = useLanguage()
  return (
    <section className="py-16 md:py-24 lg:py-32">
      {collections.map((c, i) => (
        <div
          key={c.slug}
          className="container-ecru-wide mb-16 md:mb-24 lg:mb-32 grid gap-6 md:gap-8 lg:gap-10 lg:grid-cols-12"
        >
          <div className="lg:col-span-8">
            <RevealImage
              src={c.image}
              alt={c.title[language]}
              className="aspect-[4/5] md:aspect-[16/10]"
              parallax
            />
          </div>
          <div className="flex flex-col justify-end lg:col-span-4">
            <span className="eyebrow mb-3 block">{interpolate(t.editorial.collectionLabel, { number: String(i + 1).padStart(2, '0') })}</span>
            <RevealText
              as="h3"
              text={c.title[language]}
              className="font-display text-3xl md:text-4xl lg:text-5xl tracking-ultra-tight leading-[0.95]"
            />
            <Reveal delay={0.2}>
              <p className="mt-3 md:mt-4 font-serif italic text-base md:text-lg text-muted">{c.subtitle[language]}</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 md:mt-6 max-w-md text-[13px] md:text-[14px] leading-relaxed text-muted">{c.description[language]}</p>
            </Reveal>
            <Reveal delay={0.4}>
              <div className="mt-6 md:mt-8 flex items-center justify-between border-t border-line pt-5 md:pt-6">
                <span className="text-[11px] md:text-[12px] uppercase tracking-wide-lg text-muted">{interpolate(t.editorial.pieces, { count: c.pieces })}</span>
                <Link to={`/shop?collection=${c.slug}`} className="btn-underline text-[11px] uppercase tracking-wide-lg focus:outline-none focus-visible:ring-1 focus-visible:ring-ink" data-cursor="hover">
                  {t.editorial.discover}
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      ))}
    </section>
  )
}
