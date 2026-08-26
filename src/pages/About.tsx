import { motion } from 'framer-motion'
import { Reveal, RevealImage, RevealText } from '../components/ui/Reveal'
import { site } from '../data/site'
import { useLanguage } from '../i18n'

export default function About() {
  const { t } = useLanguage()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <section className="relative h-[80vh] overflow-hidden">
        <RevealImage
          src="https://images.unsplash.com/photo-1475189771997-b2f0fb50c1ce?auto=format&fit=crop&w=2000&q=80"
          alt="Atelier"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
          parallax
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/50" />
        <div className="absolute inset-0 flex items-end px-6 pb-12 md:px-10 md:pb-16 lg:px-16">
          <div>
            <span className="eyebrow text-paper/80 mb-3 block">{t.about.eyebrow}</span>
            <h1 className="font-display text-5xl md:text-8xl lg:text-9xl tracking-ultra-tight leading-[0.85] text-paper">
              {t.about.title1}<br />
              <span className="font-serif italic font-normal">{t.about.title2}</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="container-ecru py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow mb-4 block">{t.about.manifestoEyebrow}</span>
          </div>
          <div className="lg:col-span-8">
            <RevealText
              as="p"
              text={t.about.manifestoText}
              className="font-display text-2xl md:text-4xl lg:text-5xl tracking-ultra-tight leading-[1.15]"
            />
          </div>
        </div>
      </section>

      <section className="container-ecru-wide pb-24 md:pb-32">
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {[
            { t: t.about.clothTitle, d: t.about.clothDesc },
            { t: t.about.cutTitle, d: t.about.cutDesc },
            { t: t.about.makeTitle, d: t.about.makeDesc },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 0.1}>
              <div className="border-t border-ink pt-6">
                <span className="font-display text-2xl tracking-ultra-tight">{x.t}</span>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">{x.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-ecru-wide pb-32 grid gap-6 md:grid-cols-2 md:gap-10">
        <RevealImage
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
          alt="Atelier"
          className="aspect-[4/5]"
        />
        <RevealImage
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1400&q=80"
          alt="Cloth"
          className="aspect-[4/5]"
          delay={0.15}
        />
      </section>

      <section className="container-ecru pb-24 text-center">
        <Reveal>
          <p className="font-serif italic text-2xl text-muted">{site.city} — Est. {site.founded}</p>
        </Reveal>
      </section>
    </motion.div>
  )
}
