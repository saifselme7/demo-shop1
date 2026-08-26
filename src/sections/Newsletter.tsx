import { useState } from 'react'
import MagneticButton from '../components/ui/MagneticButton'
import { Reveal, RevealText } from '../components/ui/Reveal'
import { useLanguage } from '../i18n'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-ink text-paper">
      <div className="container-ecru-wide grid gap-10 md:gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="eyebrow text-paper/60 mb-3 block">{t.newsletter.eyebrow}</span>
          <RevealText
            as="h2"
            text={t.newsletter.title}
            className="font-display text-3xl md:text-5xl lg:text-6xl xl:text-7xl tracking-ultra-tight leading-[0.95] text-paper"
          />
        </div>
        <div className="lg:col-span-5 flex flex-col justify-end">
          <Reveal>
            <p className="mb-6 md:mb-8 text-[13px] md:text-[14px] leading-relaxed text-paper/70">
              {t.newsletter.description}
            </p>
            {submitted ? (
              <p className="border-b border-paper/30 pb-4 font-serif italic text-lg">
                {t.newsletter.thankYou}
              </p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email) setSubmitted(true)
                }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-paper/30 pb-4"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.newsletter.placeholder}
                  className="flex-1 bg-transparent text-[14px] text-paper placeholder:text-paper/40 focus:outline-none focus-visible:ring-0 min-h-[44px]"
                  data-cursor="hover"
                />
                <MagneticButton type="submit" variant="ghost" className="text-paper w-full sm:w-auto justify-center sm:justify-start">
                  {t.newsletter.subscribe}
                </MagneticButton>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
