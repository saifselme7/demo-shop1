import { Link } from 'react-router-dom'
import { RevealImage } from '../components/ui/Reveal'
import { Reveal, RevealText } from '../components/ui/Reveal'
import { useLanguage } from '../i18n'

const catsData = [
  { slug: 'outerwear', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80', labelKey: 'outerwear' as const },
  { slug: 'knitwear', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80', labelKey: 'knitwear' as const },
  { slug: 'trousers', image: 'https://images.unsplash.com/photo-1584302058527-2e90841a2227?auto=format&fit=crop&w=1200&q=80', labelKey: 'trousers' as const },
  { slug: 'dresses', image: 'https://images.unsplash.com/photo-1571513808435-6d0d1c7d7a24?auto=format&fit=crop&w=1200&q=80', labelKey: 'dresses' as const },
]

export default function Categories() {
  const { t } = useLanguage()
  const cats = catsData.map((c) => ({
    ...c,
    label: t.shop.categories[c.labelKey],
  }))

  return (
    <section className="py-20 md:py-32">
      <div className="container-ecru-wide mb-12 md:mb-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow mb-3 block">{t.categories.eyebrow}</span>
            <RevealText
              as="h2"
              text={t.categories.title}
              className="font-display text-4xl md:text-6xl lg:text-7xl tracking-ultra-tight leading-[0.9]"
            />
          </div>
          <Reveal>
            <p className="max-w-md text-[13px] md:text-[14px] leading-relaxed text-muted">
              {t.categories.description}
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
                <h3 className="font-display text-lg md:text-xl tracking-ultra-tight">{c.label}</h3>
                <span className="text-[11px] uppercase tracking-wide-lg text-muted group-hover:text-ink">→</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
