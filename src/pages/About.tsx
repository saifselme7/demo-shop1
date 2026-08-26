import { motion } from 'framer-motion'
import { Reveal, RevealImage, RevealText } from '../components/ui/Reveal'
import { site } from '../data/site'

export default function About() {
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
            <span className="eyebrow text-paper/80 mb-3 block">— The atelier</span>
            <h1 className="font-display text-6xl md:text-9xl lg:text-10xl tracking-ultra-tight leading-[0.85] text-paper">
              A considered<br />
              <span className="font-serif italic font-normal">manufacture.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="container-ecru py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="eyebrow mb-4 block">— Manifesto</span>
          </div>
          <div className="lg:col-span-8">
            <RevealText
              as="p"
              text="SAIF STORE was founded in 2019 in Cairo as a quiet rebuttal to the seasonal noise of fashion. We make a small number of garments each year — patterns refined rather than replaced, cloth chosen for hand and longevity, and editions numbered, never replenished."
              className="font-display text-3xl md:text-5xl tracking-ultra-tight leading-[1.05]"
            />
          </div>
        </div>
      </section>

      <section className="container-ecru-wide pb-24 md:pb-32">
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {[
            { t: 'Cloth', d: 'Natural fibres only — merino, cashmere, linen, silk, cotton. Sourced from long-standing mills in Italy, Scotland, Ireland, and France.' },
            { t: 'Cut', d: 'Patterns are refined season over season. Nothing is replenished — each piece is part of a numbered edition, then retired.' },
            { t: 'Make', d: 'Manufactured in small ateliers across Portugal, Italy, Scotland, and France. Fair wage, slow pace, considered hand.' },
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
